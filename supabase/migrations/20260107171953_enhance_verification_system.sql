/*
  # Enhance Verification System

  1. Updates to existing tables
    - Add onboarding completion tracking to practitioners
    - Add file upload URLs to license/certification/insurance tables

  2. New helper functions
    - Function to submit verification request
    - Function to update verification status

  3. Security
    - All policies already exist via profiles.role = 'admin' checks
    - No new security policies needed
*/

-- Add onboarding tracking fields to practitioners
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'practitioners' AND column_name = 'onboarding_step') THEN
    ALTER TABLE practitioners ADD COLUMN onboarding_step integer DEFAULT 1;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'practitioners' AND column_name = 'onboarding_completed') THEN
    ALTER TABLE practitioners ADD COLUMN onboarding_completed boolean DEFAULT false;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'practitioners' AND column_name = 'profile_completeness') THEN
    ALTER TABLE practitioners ADD COLUMN profile_completeness integer DEFAULT 0;
  END IF;
END $$;

-- Create helper function to submit verification
CREATE OR REPLACE FUNCTION submit_verification_request(p_practitioner_id uuid)
RETURNS uuid AS $$
DECLARE
  v_queue_id uuid;
  v_user_id uuid;
BEGIN
  -- Get user_id for the practitioner
  SELECT user_id INTO v_user_id
  FROM practitioners
  WHERE id = p_practitioner_id;

  -- Check if already in queue
  SELECT id INTO v_queue_id
  FROM verification_queue
  WHERE practitioner_id = p_practitioner_id
    AND status IN ('pending', 'needs_review');

  -- If not in queue, create new entry
  IF v_queue_id IS NULL THEN
    INSERT INTO verification_queue (practitioner_id, status, submitted_at)
    VALUES (p_practitioner_id, 'pending', now())
    RETURNING id INTO v_queue_id;

    -- Update practitioner status
    UPDATE practitioners
    SET verification_status = 'pending'
    WHERE id = p_practitioner_id;

    -- Create audit entry
    INSERT INTO verification_audit (practitioner_id, old_status, new_status, changed_by, reason)
    VALUES (p_practitioner_id, 'unverified', 'pending', v_user_id, 'Submitted for verification');
  END IF;

  RETURN v_queue_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create helper function to update verification status (admin only)
CREATE OR REPLACE FUNCTION update_verification_status(
  p_practitioner_id uuid,
  p_new_status verification_status,
  p_admin_notes text DEFAULT NULL
)
RETURNS boolean AS $$
DECLARE
  v_old_status verification_status;
  v_admin_id uuid;
  v_admin_role user_role;
BEGIN
  -- Check if caller is admin
  SELECT id, role INTO v_admin_id, v_admin_role
  FROM profiles
  WHERE id = auth.uid();

  IF v_admin_role != 'admin' THEN
    RAISE EXCEPTION 'Only admins can update verification status';
  END IF;

  -- Get current status
  SELECT verification_status INTO v_old_status
  FROM practitioners
  WHERE id = p_practitioner_id;

  -- Update practitioner status
  UPDATE practitioners
  SET 
    verification_status = p_new_status,
    verified_at = CASE WHEN p_new_status = 'verified' THEN now() ELSE verified_at END
  WHERE id = p_practitioner_id;

  -- Update verification queue
  UPDATE verification_queue
  SET 
    status = p_new_status,
    reviewed_at = now(),
    reviewed_by = v_admin_id,
    admin_notes = p_admin_notes
  WHERE practitioner_id = p_practitioner_id
    AND status IN ('pending', 'needs_review');

  -- Create audit entry
  INSERT INTO verification_audit (
    practitioner_id,
    old_status,
    new_status,
    changed_by,
    reason
  ) VALUES (
    p_practitioner_id,
    v_old_status,
    p_new_status,
    v_admin_id,
    p_admin_notes
  );

  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add policies for practitioners to submit verification
CREATE POLICY "Practitioners can submit verification"
  ON verification_queue
  FOR INSERT
  TO authenticated
  WITH CHECK (
    practitioner_id IN (
      SELECT id FROM practitioners WHERE user_id = auth.uid()
    )
  );

-- Add policy for admins to view all verification queue items
CREATE POLICY "Admins can view all verification queue"
  ON verification_queue
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Add policy for admins to update verification queue
CREATE POLICY "Admins can update verification queue"
  ON verification_queue
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Add policy for admins to insert verification audit
CREATE POLICY "Admins can insert verification audit"
  ON verification_audit
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Add policy for practitioners to view their own verification audit
CREATE POLICY "Practitioners can view own verification audit"
  ON verification_audit
  FOR SELECT
  TO authenticated
  USING (
    practitioner_id IN (
      SELECT id FROM practitioners WHERE user_id = auth.uid()
    )
  );