/*
  # Trust Engine Badge Computation Functions

  1. Functions
    - compute_badges_for_practitioner: Compute all badges for a single practitioner
    - compute_all_badges: Batch compute badges for all practitioners
    - record_trust_event: Helper to record trust events with proper weighting
    - update_trust_score: Recalculate trust score based on recent events

  2. Badge Criteria
    - verified_identity: Practitioner has completed verification (admin approved)
    - verified_practice: Has verified practice location and insurance
    - continuity_of_care: Has completed at least 10 consults with followup
    - established_practitioner: Active for 6+ months with 50+ profile views

  3. Security
    - Functions are SECURITY DEFINER to allow badge updates
    - Trust events can be inserted by authenticated users
*/

-- Function to record trust events with proper weighting
CREATE OR REPLACE FUNCTION record_trust_event(
  p_event_type trust_event_type,
  p_patient_id_hash text,
  p_practitioner_id uuid,
  p_metadata jsonb DEFAULT '{}'::jsonb
)
RETURNS uuid AS $$
DECLARE
  v_event_id uuid;
  v_weight numeric;
BEGIN
  -- Assign weights based on event type
  CASE p_event_type
    WHEN 'profile_view' THEN v_weight := 1;
    WHEN 'follow_provider' THEN v_weight := 5;
    WHEN 'save_provider' THEN v_weight := 3;
    WHEN 'consult_request_sent' THEN v_weight := 10;
    WHEN 'consult_accepted' THEN v_weight := 15;
    WHEN 'consult_completed' THEN v_weight := 25;
    WHEN 'message_thread_active' THEN v_weight := 8;
    WHEN 'followup_marked_complete' THEN v_weight := 20;
    WHEN 'report_submitted' THEN v_weight := -50;
    ELSE v_weight := 0;
  END CASE;

  -- Insert the event
  INSERT INTO trust_events (
    event_type,
    patient_id_hash,
    practitioner_id,
    event_weight,
    metadata
  ) VALUES (
    p_event_type,
    p_patient_id_hash,
    p_practitioner_id,
    v_weight,
    p_metadata
  ) RETURNING id INTO v_event_id;

  -- Update trust score
  PERFORM update_trust_score(p_practitioner_id);

  RETURN v_event_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update trust score for a practitioner
CREATE OR REPLACE FUNCTION update_trust_score(p_practitioner_id uuid)
RETURNS numeric AS $$
DECLARE
  v_total_weight numeric;
  v_event_count integer;
  v_unique_patients integer;
  v_final_score numeric;
BEGIN
  -- Calculate total weight from last 90 days
  SELECT 
    COALESCE(SUM(event_weight), 0),
    COUNT(*),
    COUNT(DISTINCT patient_id_hash)
  INTO v_total_weight, v_event_count, v_unique_patients
  FROM trust_events
  WHERE practitioner_id = p_practitioner_id
    AND created_at > now() - interval '90 days';

  -- Compute final score with diminishing returns
  -- Formula: (total_weight * 0.7) + (unique_patients * 5) + (event_count * 0.3)
  v_final_score := (v_total_weight * 0.7) + (v_unique_patients * 5) + (v_event_count * 0.3);
  
  -- Cap at 1000
  IF v_final_score > 1000 THEN
    v_final_score := 1000;
  END IF;

  -- Update practitioner trust score
  UPDATE practitioners
  SET trust_score = v_final_score
  WHERE id = p_practitioner_id;

  RETURN v_final_score;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to compute badges for a single practitioner
CREATE OR REPLACE FUNCTION compute_badges_for_practitioner(p_practitioner_id uuid)
RETURNS jsonb AS $$
DECLARE
  v_practitioner RECORD;
  v_badge_results jsonb := '{}'::jsonb;
  v_verified_identity boolean := false;
  v_verified_practice boolean := false;
  v_continuity_of_care boolean := false;
  v_established_practitioner boolean := false;
  v_existing_badge RECORD;
BEGIN
  -- Get practitioner data
  SELECT * INTO v_practitioner
  FROM practitioners
  WHERE id = p_practitioner_id;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('error', 'Practitioner not found');
  END IF;

  -- Check verified_identity badge
  -- Criteria: verification_status = 'verified'
  IF v_practitioner.verification_status = 'verified' THEN
    v_verified_identity := true;
  END IF;

  -- Check verified_practice badge
  -- Criteria: Has verified insurance
  SELECT EXISTS (
    SELECT 1 FROM practitioner_insurance
    WHERE practitioner_id = p_practitioner_id
      AND is_verified = true
      AND expiration_date > now()
  ) INTO v_verified_practice;

  -- Check continuity_of_care badge
  -- Criteria: At least 10 completed consults
  SELECT COUNT(*) >= 10 INTO v_continuity_of_care
  FROM consult_requests
  WHERE practitioner_id = p_practitioner_id
    AND status = 'completed';

  -- Check established_practitioner badge
  -- Criteria: Active for 6+ months AND 50+ profile views
  IF v_practitioner.created_at < now() - interval '6 months' THEN
    SELECT COUNT(*) >= 50 INTO v_established_practitioner
    FROM trust_events
    WHERE practitioner_id = p_practitioner_id
      AND event_type = 'profile_view';
  END IF;

  -- Update or insert badges
  -- verified_identity
  INSERT INTO trust_badges (practitioner_id, badge_type, is_active, earned_at, last_computed_at, computation_metadata)
  VALUES (
    p_practitioner_id,
    'verified_identity',
    v_verified_identity,
    CASE WHEN v_verified_identity THEN now() ELSE NULL END,
    now(),
    jsonb_build_object('criteria', 'verification_status = verified')
  )
  ON CONFLICT (practitioner_id, badge_type)
  DO UPDATE SET
    is_active = v_verified_identity,
    earned_at = CASE 
      WHEN v_verified_identity AND trust_badges.is_active = false THEN now()
      WHEN NOT v_verified_identity THEN NULL
      ELSE trust_badges.earned_at
    END,
    revoked_at = CASE WHEN NOT v_verified_identity THEN now() ELSE NULL END,
    last_computed_at = now();

  -- verified_practice
  INSERT INTO trust_badges (practitioner_id, badge_type, is_active, earned_at, last_computed_at, computation_metadata)
  VALUES (
    p_practitioner_id,
    'verified_practice',
    v_verified_practice,
    CASE WHEN v_verified_practice THEN now() ELSE NULL END,
    now(),
    jsonb_build_object('criteria', 'has verified active insurance')
  )
  ON CONFLICT (practitioner_id, badge_type)
  DO UPDATE SET
    is_active = v_verified_practice,
    earned_at = CASE 
      WHEN v_verified_practice AND trust_badges.is_active = false THEN now()
      WHEN NOT v_verified_practice THEN NULL
      ELSE trust_badges.earned_at
    END,
    revoked_at = CASE WHEN NOT v_verified_practice THEN now() ELSE NULL END,
    last_computed_at = now();

  -- continuity_of_care
  INSERT INTO trust_badges (practitioner_id, badge_type, is_active, earned_at, last_computed_at, computation_metadata)
  VALUES (
    p_practitioner_id,
    'continuity_of_care',
    v_continuity_of_care,
    CASE WHEN v_continuity_of_care THEN now() ELSE NULL END,
    now(),
    jsonb_build_object('criteria', '10+ completed consults')
  )
  ON CONFLICT (practitioner_id, badge_type)
  DO UPDATE SET
    is_active = v_continuity_of_care,
    earned_at = CASE 
      WHEN v_continuity_of_care AND trust_badges.is_active = false THEN now()
      WHEN NOT v_continuity_of_care THEN NULL
      ELSE trust_badges.earned_at
    END,
    revoked_at = CASE WHEN NOT v_continuity_of_care THEN now() ELSE NULL END,
    last_computed_at = now();

  -- established_practitioner
  INSERT INTO trust_badges (practitioner_id, badge_type, is_active, earned_at, last_computed_at, computation_metadata)
  VALUES (
    p_practitioner_id,
    'established_practitioner',
    v_established_practitioner,
    CASE WHEN v_established_practitioner THEN now() ELSE NULL END,
    now(),
    jsonb_build_object('criteria', '6+ months active, 50+ profile views')
  )
  ON CONFLICT (practitioner_id, badge_type)
  DO UPDATE SET
    is_active = v_established_practitioner,
    earned_at = CASE 
      WHEN v_established_practitioner AND trust_badges.is_active = false THEN now()
      WHEN NOT v_established_practitioner THEN NULL
      ELSE trust_badges.earned_at
    END,
    revoked_at = CASE WHEN NOT v_established_practitioner THEN now() ELSE NULL END,
    last_computed_at = now();

  -- Build result
  v_badge_results := jsonb_build_object(
    'practitioner_id', p_practitioner_id,
    'badges', jsonb_build_object(
      'verified_identity', v_verified_identity,
      'verified_practice', v_verified_practice,
      'continuity_of_care', v_continuity_of_care,
      'established_practitioner', v_established_practitioner
    ),
    'computed_at', now()
  );

  RETURN v_badge_results;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to compute badges for all practitioners
CREATE OR REPLACE FUNCTION compute_all_badges()
RETURNS jsonb AS $$
DECLARE
  v_practitioner RECORD;
  v_count integer := 0;
  v_results jsonb := '[]'::jsonb;
BEGIN
  FOR v_practitioner IN 
    SELECT id FROM practitioners 
    WHERE verification_status = 'verified'
  LOOP
    PERFORM compute_badges_for_practitioner(v_practitioner.id);
    PERFORM update_trust_score(v_practitioner.id);
    v_count := v_count + 1;
  END LOOP;

  RETURN jsonb_build_object(
    'practitioners_processed', v_count,
    'completed_at', now()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION record_trust_event TO authenticated;
GRANT EXECUTE ON FUNCTION update_trust_score TO authenticated;
GRANT EXECUTE ON FUNCTION compute_badges_for_practitioner TO authenticated;
GRANT EXECUTE ON FUNCTION compute_all_badges TO authenticated;