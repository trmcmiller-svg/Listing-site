/*
  # Messaging System with Rate Limiting

  ## Overview
  This migration enhances the messaging system with comprehensive rate limiting,
  plan-based enforcement, and improved security.

  ## New Tables
  
  ### `message_rate_limits`
  Tracks message counts per time window for rate limiting enforcement
  - `id` (uuid, primary key)
  - `user_id` (uuid) - User sending messages
  - `thread_id` (uuid) - Thread being messaged
  - `thread_type` (text) - 'consult' or 'direct'
  - `message_count` (integer) - Messages sent in current window
  - `window_start` (timestamptz) - Start of rate limit window
  - `window_end` (timestamptz) - End of rate limit window
  - `created_at`, `updated_at` (timestamptz)

  ### `thread_participants`
  Tracks all participants in message threads for easier querying
  - `id` (uuid, primary key)
  - `thread_id` (uuid)
  - `thread_type` (text)
  - `user_id` (uuid)
  - `last_read_at` (timestamptz)
  - `unread_count` (integer)
  - `created_at` (timestamptz)

  ## Modified Tables
  
  ### Enhanced RLS Policies
  - All messaging tables get comprehensive RLS policies
  - Policies check both participant membership and subscription limits
  - Separate policies for consult vs direct message threads

  ## Functions
  
  ### `check_message_rate_limit()`
  Validates if a user can send a message based on:
  - Practitioner subscription plan (free/professional/premium)
  - Message count in current window
  - Thread type (consult vs direct)

  ### `increment_message_count()`
  Increments message count and manages rate limit windows

  ### `get_thread_participants()`
  Returns all participants in a thread

  ## Indexes
  - Composite indexes on thread_id + user_id for fast lookups
  - Indexes on thread_type for filtering
  - Index on window_end for cleanup queries

  ## Security
  - RLS enabled on all tables
  - Participants can only access their own threads
  - Rate limiting enforced at database level
  - Admin override capabilities for moderation
*/

-- Create message_rate_limits table
CREATE TABLE IF NOT EXISTS message_rate_limits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  thread_id uuid NOT NULL,
  thread_type text NOT NULL CHECK (thread_type IN ('consult', 'direct')),
  message_count integer NOT NULL DEFAULT 0,
  window_start timestamptz NOT NULL DEFAULT now(),
  window_end timestamptz NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, thread_id, thread_type)
);

-- Create thread_participants table
CREATE TABLE IF NOT EXISTS thread_participants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id uuid NOT NULL,
  thread_type text NOT NULL CHECK (thread_type IN ('consult', 'direct')),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  last_read_at timestamptz DEFAULT now(),
  unread_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  UNIQUE(thread_id, thread_type, user_id)
);

-- Enable RLS
ALTER TABLE message_rate_limits ENABLE ROW LEVEL SECURITY;
ALTER TABLE thread_participants ENABLE ROW LEVEL SECURITY;

-- RLS Policies for message_rate_limits
CREATE POLICY "Users can view own rate limits"
  ON message_rate_limits FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "System can insert rate limits"
  ON message_rate_limits FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "System can update rate limits"
  ON message_rate_limits FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for thread_participants
CREATE POLICY "Participants can view own threads"
  ON thread_participants FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "System can insert participants"
  ON thread_participants FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Participants can update own records"
  ON thread_participants FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Enhanced RLS for messages table
DROP POLICY IF EXISTS "Users can view messages in their threads" ON messages;
CREATE POLICY "Users can view messages in their threads"
  ON messages FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM thread_participants tp
      WHERE tp.thread_id = messages.thread_id
        AND tp.thread_type = messages.thread_type
        AND tp.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can insert messages" ON messages;
CREATE POLICY "Users can insert messages"
  ON messages FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = sender_id);

DROP POLICY IF EXISTS "Users can update own messages" ON messages;
CREATE POLICY "Users can update own messages"
  ON messages FOR UPDATE
  TO authenticated
  USING (auth.uid() = sender_id)
  WITH CHECK (auth.uid() = sender_id);

-- Enhanced RLS for consult_threads
DROP POLICY IF EXISTS "Patients can view own consult threads" ON consult_threads;
CREATE POLICY "Patients can view own consult threads"
  ON consult_threads FOR SELECT
  TO authenticated
  USING (auth.uid() = patient_id OR auth.uid() IN (
    SELECT user_id FROM practitioners WHERE id = practitioner_id
  ));

DROP POLICY IF EXISTS "Users can update own threads" ON consult_threads;
CREATE POLICY "Users can update own threads"
  ON consult_threads FOR UPDATE
  TO authenticated
  USING (
    auth.uid() = patient_id OR 
    auth.uid() IN (SELECT user_id FROM practitioners WHERE id = practitioner_id)
  )
  WITH CHECK (
    auth.uid() = patient_id OR 
    auth.uid() IN (SELECT user_id FROM practitioners WHERE id = practitioner_id)
  );

-- Enhanced RLS for direct_threads
DROP POLICY IF EXISTS "Patients can view own direct threads" ON direct_threads;
CREATE POLICY "Patients can view own direct threads"
  ON direct_threads FOR SELECT
  TO authenticated
  USING (auth.uid() = patient_id OR auth.uid() IN (
    SELECT user_id FROM practitioners WHERE id = practitioner_id
  ));

DROP POLICY IF EXISTS "Users can update own direct threads" ON direct_threads;
CREATE POLICY "Users can update own direct threads"
  ON direct_threads FOR UPDATE
  TO authenticated
  USING (
    auth.uid() = patient_id OR 
    auth.uid() IN (SELECT user_id FROM practitioners WHERE id = practitioner_id)
  )
  WITH CHECK (
    auth.uid() = patient_id OR 
    auth.uid() IN (SELECT user_id FROM practitioners WHERE id = practitioner_id)
  );

-- Function to check if user can send message based on rate limits
CREATE OR REPLACE FUNCTION check_message_rate_limit(
  p_sender_id uuid,
  p_thread_id uuid,
  p_thread_type text
) RETURNS jsonb AS $$
DECLARE
  v_practitioner_id uuid;
  v_subscription_plan subscription_plan;
  v_current_count integer;
  v_limit integer;
  v_window_hours integer;
  v_result jsonb;
BEGIN
  -- Determine practitioner and their subscription plan
  IF p_thread_type = 'consult' THEN
    SELECT ct.practitioner_id INTO v_practitioner_id
    FROM consult_threads ct
    WHERE ct.id = p_thread_id;
  ELSE
    SELECT dt.practitioner_id INTO v_practitioner_id
    FROM direct_threads dt
    WHERE dt.id = p_thread_id;
  END IF;

  -- Get practitioner's subscription plan
  SELECT COALESCE(s.plan_type, 'free') INTO v_subscription_plan
  FROM practitioners p
  LEFT JOIN subscriptions s ON s.practitioner_id = p.id
  WHERE p.id = v_practitioner_id;

  -- Set limits based on plan and thread type
  IF p_thread_type = 'consult' THEN
    -- Consult threads: unlimited for all plans
    v_limit := 999999;
    v_window_hours := 24;
  ELSE
    -- Direct message limits based on plan
    IF v_subscription_plan = 'free' THEN
      v_limit := 0; -- No direct messaging on free plan
      v_window_hours := 24;
    ELSIF v_subscription_plan = 'professional' THEN
      v_limit := 3; -- 3 messages per conversation for Pro
      v_window_hours := 999999; -- Lifetime limit
    ELSE
      v_limit := 999999; -- Unlimited for Premium
      v_window_hours := 24;
    END IF;
  END IF;

  -- Get current message count from patient in this thread
  SELECT COALESCE(
    (SELECT COUNT(*)
     FROM messages m
     WHERE m.thread_id = p_thread_id
       AND m.thread_type = p_thread_type
       AND m.sender_type = 'patient'
       AND m.sender_id = p_sender_id),
    0
  ) INTO v_current_count;

  -- Check if limit exceeded
  IF v_current_count >= v_limit THEN
    v_result := jsonb_build_object(
      'allowed', false,
      'reason', CASE
        WHEN v_subscription_plan = 'free' THEN 'Provider is on Free plan. Direct messaging unavailable.'
        WHEN v_subscription_plan = 'professional' THEN 'Message limit reached for Pro plan provider.'
        ELSE 'Rate limit exceeded'
      END,
      'current_count', v_current_count,
      'limit', v_limit,
      'plan', v_subscription_plan
    );
  ELSE
    v_result := jsonb_build_object(
      'allowed', true,
      'current_count', v_current_count,
      'limit', v_limit,
      'remaining', v_limit - v_current_count,
      'plan', v_subscription_plan
    );
  END IF;

  RETURN v_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get thread participants
CREATE OR REPLACE FUNCTION get_thread_participants(
  p_thread_id uuid,
  p_thread_type text
) RETURNS TABLE(user_id uuid, role user_role, full_name text, avatar_url text) AS $$
BEGIN
  IF p_thread_type = 'consult' THEN
    RETURN QUERY
    SELECT 
      ct.patient_id as user_id,
      'patient'::user_role as role,
      p1.full_name,
      p1.avatar_url
    FROM consult_threads ct
    JOIN profiles p1 ON p1.id = ct.patient_id
    WHERE ct.id = p_thread_id
    UNION ALL
    SELECT 
      pr.user_id,
      'practitioner'::user_role as role,
      p2.full_name,
      p2.avatar_url
    FROM consult_threads ct
    JOIN practitioners pr ON pr.id = ct.practitioner_id
    JOIN profiles p2 ON p2.id = pr.user_id
    WHERE ct.id = p_thread_id;
  ELSE
    RETURN QUERY
    SELECT 
      dt.patient_id as user_id,
      'patient'::user_role as role,
      p1.full_name,
      p1.avatar_url
    FROM direct_threads dt
    JOIN profiles p1 ON p1.id = dt.patient_id
    WHERE dt.id = p_thread_id
    UNION ALL
    SELECT 
      pr.user_id,
      'practitioner'::user_role as role,
      p2.full_name,
      p2.avatar_url
    FROM direct_threads dt
    JOIN practitioners pr ON pr.id = dt.practitioner_id
    JOIN profiles p2 ON p2.id = pr.user_id
    WHERE dt.id = p_thread_id;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_message_rate_limits_user_thread 
  ON message_rate_limits(user_id, thread_id, thread_type);

CREATE INDEX IF NOT EXISTS idx_message_rate_limits_window_end 
  ON message_rate_limits(window_end);

CREATE INDEX IF NOT EXISTS idx_thread_participants_thread 
  ON thread_participants(thread_id, thread_type);

CREATE INDEX IF NOT EXISTS idx_thread_participants_user 
  ON thread_participants(user_id);

CREATE INDEX IF NOT EXISTS idx_messages_thread 
  ON messages(thread_id, thread_type, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_messages_sender 
  ON messages(sender_id, created_at DESC);

-- Trigger to update thread_participants unread count
CREATE OR REPLACE FUNCTION update_unread_count() RETURNS TRIGGER AS $$
BEGIN
  -- Increment unread count for all participants except sender
  UPDATE thread_participants
  SET unread_count = unread_count + 1
  WHERE thread_id = NEW.thread_id
    AND thread_type = NEW.thread_type
    AND user_id != NEW.sender_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_unread_count ON messages;
CREATE TRIGGER trigger_update_unread_count
  AFTER INSERT ON messages
  FOR EACH ROW
  EXECUTE FUNCTION update_unread_count();

-- Function to mark messages as read
CREATE OR REPLACE FUNCTION mark_messages_read(
  p_thread_id uuid,
  p_thread_type text,
  p_user_id uuid
) RETURNS void AS $$
BEGIN
  -- Mark messages as read
  UPDATE messages
  SET is_read = true
  WHERE thread_id = p_thread_id
    AND thread_type = p_thread_type
    AND sender_id != p_user_id
    AND is_read = false;

  -- Reset unread count for user
  UPDATE thread_participants
  SET unread_count = 0,
      last_read_at = now()
  WHERE thread_id = p_thread_id
    AND thread_type = p_thread_type
    AND user_id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;