/*
  # Admin Tools - Sprint 7
  
  ## Overview
  Comprehensive admin tooling for content moderation, platform analytics, and admin notifications.
  
  ## New Tables
  
  ### 1. content_reports
  Tracks user-reported content for moderation
  - `id` (uuid, primary key)
  - `reporter_id` (uuid) - User who submitted the report
  - `reported_user_id` (uuid) - User being reported
  - `report_type` (enum) - Type of violation
  - `reported_content_type` (text) - What was reported (profile, message, etc.)
  - `reported_content_id` (uuid) - ID of the reported content
  - `report_reason` (text) - Detailed reason
  - `status` (enum) - pending, reviewing, resolved, dismissed
  - `reviewed_by` (uuid) - Admin who reviewed
  - `admin_notes` (text) - Internal notes
  - `action_taken` (text) - What action was taken
  - `resolved_at` (timestamptz)
  - Timestamps
  
  ### 2. platform_analytics
  Aggregated platform metrics for admin dashboard
  - `id` (uuid, primary key)
  - `date` (date) - Analytics date
  - `metric_type` (text) - Type of metric
  - `metric_value` (numeric) - Value
  - `metadata` (jsonb) - Additional data
  - Timestamps
  
  ### 3. admin_notifications
  Real-time notifications for admin actions needed
  - `id` (uuid, primary key)
  - `notification_type` (text) - Type of notification
  - `title` (text)
  - `message` (text)
  - `priority` (text) - low, medium, high, urgent
  - `is_read` (boolean)
  - `link_url` (text) - Deep link to relevant page
  - `metadata` (jsonb)
  - Timestamps
  
  ### 4. badge_audit_log
  Comprehensive audit trail for badge changes
  - `id` (uuid, primary key)
  - `badge_id` (uuid) - References trust_badges
  - `practitioner_id` (uuid)
  - `badge_type` (badge_type enum)
  - `action` (text) - awarded, revoked, recomputed
  - `previous_state` (jsonb) - State before change
  - `new_state` (jsonb) - State after change
  - `trigger_reason` (text) - Why the change happened
  - `automated` (boolean) - Was it automated or manual
  - `admin_user_id` (uuid) - If manual, who did it
  - Timestamps
  
  ### 5. verification_audit_log
  Track all verification status changes
  - `id` (uuid, primary key)
  - `practitioner_id` (uuid)
  - `previous_status` (verification_status)
  - `new_status` (verification_status)
  - `admin_user_id` (uuid)
  - `admin_notes` (text)
  - `documents_reviewed` (jsonb)
  - Timestamps
  
  ## Security
  - All tables have RLS enabled
  - Only admins can access these tables
  - Comprehensive audit trails
  
  ## Indexes
  - Optimized for admin dashboard queries
  - Fast filtering by status, date, and type
*/

-- Create content_reports table
CREATE TABLE IF NOT EXISTS content_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  reported_user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  report_type text NOT NULL CHECK (report_type IN ('spam', 'inappropriate', 'harassment', 'fraud', 'fake_credentials', 'other')),
  reported_content_type text NOT NULL CHECK (reported_content_type IN ('profile', 'message', 'photo', 'niccybox_module', 'consult_request')),
  reported_content_id uuid,
  report_reason text NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'reviewing', 'resolved', 'dismissed')),
  reviewed_by uuid REFERENCES profiles(id),
  admin_notes text,
  action_taken text,
  resolved_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create platform_analytics table
CREATE TABLE IF NOT EXISTS platform_analytics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  date date NOT NULL,
  metric_type text NOT NULL,
  metric_value numeric NOT NULL DEFAULT 0,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(date, metric_type)
);

-- Create admin_notifications table
CREATE TABLE IF NOT EXISTS admin_notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  notification_type text NOT NULL CHECK (notification_type IN ('verification_pending', 'report_submitted', 'badge_anomaly', 'system_alert', 'threshold_reached')),
  title text NOT NULL,
  message text NOT NULL,
  priority text NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  is_read boolean DEFAULT false,
  link_url text,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create badge_audit_log table
CREATE TABLE IF NOT EXISTS badge_audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  badge_id uuid REFERENCES trust_badges(id) ON DELETE SET NULL,
  practitioner_id uuid NOT NULL REFERENCES practitioners(id) ON DELETE CASCADE,
  badge_type text NOT NULL,
  action text NOT NULL CHECK (action IN ('awarded', 'revoked', 'recomputed', 'manually_granted', 'manually_removed')),
  previous_state jsonb,
  new_state jsonb,
  trigger_reason text NOT NULL,
  automated boolean DEFAULT true,
  admin_user_id uuid REFERENCES profiles(id),
  created_at timestamptz DEFAULT now()
);

-- Create verification_audit_log table
CREATE TABLE IF NOT EXISTS verification_audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  practitioner_id uuid NOT NULL REFERENCES practitioners(id) ON DELETE CASCADE,
  previous_status text NOT NULL,
  new_status text NOT NULL,
  admin_user_id uuid NOT NULL REFERENCES profiles(id),
  admin_notes text,
  documents_reviewed jsonb,
  created_at timestamptz DEFAULT now()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_content_reports_status ON content_reports(status);
CREATE INDEX IF NOT EXISTS idx_content_reports_reporter ON content_reports(reporter_id);
CREATE INDEX IF NOT EXISTS idx_content_reports_reported_user ON content_reports(reported_user_id);
CREATE INDEX IF NOT EXISTS idx_content_reports_created ON content_reports(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_platform_analytics_date ON platform_analytics(date DESC);
CREATE INDEX IF NOT EXISTS idx_platform_analytics_metric_type ON platform_analytics(metric_type);

CREATE INDEX IF NOT EXISTS idx_admin_notifications_priority ON admin_notifications(priority, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_admin_notifications_unread ON admin_notifications(is_read, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_badge_audit_practitioner ON badge_audit_log(practitioner_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_badge_audit_badge ON badge_audit_log(badge_id);

CREATE INDEX IF NOT EXISTS idx_verification_audit_practitioner ON verification_audit_log(practitioner_id, created_at DESC);

-- Enable RLS
ALTER TABLE content_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE platform_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE badge_audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE verification_audit_log ENABLE ROW LEVEL SECURITY;

-- RLS Policies - Admin only access
CREATE POLICY "Admins can view all content reports"
  ON content_reports FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can update content reports"
  ON content_reports FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Users can insert their own reports"
  ON content_reports FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = reporter_id);

CREATE POLICY "Admins can view platform analytics"
  ON platform_analytics FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can view admin notifications"
  ON admin_notifications FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can update admin notifications"
  ON admin_notifications FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can view badge audit log"
  ON badge_audit_log FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can view verification audit log"
  ON verification_audit_log FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Function to create admin notification
CREATE OR REPLACE FUNCTION create_admin_notification(
  p_type text,
  p_title text,
  p_message text,
  p_priority text DEFAULT 'medium',
  p_link_url text DEFAULT NULL,
  p_metadata jsonb DEFAULT '{}'::jsonb
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_notification_id uuid;
BEGIN
  INSERT INTO admin_notifications (
    notification_type,
    title,
    message,
    priority,
    link_url,
    metadata
  ) VALUES (
    p_type,
    p_title,
    p_message,
    p_priority,
    p_link_url,
    p_metadata
  )
  RETURNING id INTO v_notification_id;
  
  RETURN v_notification_id;
END;
$$;

-- Function to log badge changes
CREATE OR REPLACE FUNCTION log_badge_change()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_action text;
  v_reason text;
BEGIN
  IF (TG_OP = 'INSERT') THEN
    v_action := 'awarded';
    v_reason := 'Badge automatically computed and awarded';
    
    INSERT INTO badge_audit_log (
      badge_id,
      practitioner_id,
      badge_type,
      action,
      previous_state,
      new_state,
      trigger_reason,
      automated
    ) VALUES (
      NEW.id,
      NEW.practitioner_id,
      NEW.badge_type,
      v_action,
      NULL,
      jsonb_build_object(
        'is_active', NEW.is_active,
        'earned_at', NEW.earned_at,
        'computation_metadata', NEW.computation_metadata
      ),
      v_reason,
      true
    );
    
  ELSIF (TG_OP = 'UPDATE') THEN
    IF (OLD.is_active = true AND NEW.is_active = false) THEN
      v_action := 'revoked';
      v_reason := 'Badge criteria no longer met';
    ELSIF (OLD.is_active = false AND NEW.is_active = true) THEN
      v_action := 'awarded';
      v_reason := 'Badge criteria met again';
    ELSE
      v_action := 'recomputed';
      v_reason := 'Badge recomputed';
    END IF;
    
    INSERT INTO badge_audit_log (
      badge_id,
      practitioner_id,
      badge_type,
      action,
      previous_state,
      new_state,
      trigger_reason,
      automated
    ) VALUES (
      NEW.id,
      NEW.practitioner_id,
      NEW.badge_type,
      v_action,
      jsonb_build_object(
        'is_active', OLD.is_active,
        'earned_at', OLD.earned_at,
        'computation_metadata', OLD.computation_metadata
      ),
      jsonb_build_object(
        'is_active', NEW.is_active,
        'earned_at', NEW.earned_at,
        'computation_metadata', NEW.computation_metadata
      ),
      v_reason,
      true
    );
  END IF;
  
  RETURN NEW;
END;
$$;

-- Trigger for badge audit logging
DROP TRIGGER IF EXISTS trigger_log_badge_changes ON trust_badges;
CREATE TRIGGER trigger_log_badge_changes
  AFTER INSERT OR UPDATE ON trust_badges
  FOR EACH ROW
  EXECUTE FUNCTION log_badge_change();

-- Function to track analytics metrics
CREATE OR REPLACE FUNCTION update_platform_metric(
  p_date date,
  p_metric_type text,
  p_value numeric,
  p_metadata jsonb DEFAULT '{}'::jsonb
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO platform_analytics (
    date,
    metric_type,
    metric_value,
    metadata
  ) VALUES (
    p_date,
    p_metric_type,
    p_value,
    p_metadata
  )
  ON CONFLICT (date, metric_type)
  DO UPDATE SET
    metric_value = platform_analytics.metric_value + EXCLUDED.metric_value,
    metadata = EXCLUDED.metadata,
    updated_at = now();
END;
$$;

-- Trigger to create notification when report is submitted
CREATE OR REPLACE FUNCTION notify_admin_on_report()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  PERFORM create_admin_notification(
    'report_submitted',
    'New Content Report',
    'A user has reported ' || NEW.reported_content_type || ' for ' || NEW.report_type,
    CASE
      WHEN NEW.report_type IN ('fraud', 'fake_credentials') THEN 'high'
      WHEN NEW.report_type = 'harassment' THEN 'medium'
      ELSE 'low'
    END,
    '/admin-dashboard?tab=moderation&report=' || NEW.id::text,
    jsonb_build_object(
      'report_id', NEW.id,
      'report_type', NEW.report_type,
      'reporter_id', NEW.reporter_id
    )
  );
  
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trigger_notify_on_report ON content_reports;
CREATE TRIGGER trigger_notify_on_report
  AFTER INSERT ON content_reports
  FOR EACH ROW
  EXECUTE FUNCTION notify_admin_on_report();

-- Trigger to create notification for verification queue
CREATE OR REPLACE FUNCTION notify_admin_on_verification_submission()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF (NEW.status = 'pending' AND (OLD IS NULL OR OLD.status != 'pending')) THEN
    PERFORM create_admin_notification(
      'verification_pending',
      'New Verification Submission',
      'A practitioner has submitted credentials for verification',
      'medium',
      '/admin-dashboard?tab=verifications',
      jsonb_build_object('practitioner_id', NEW.practitioner_id)
    );
  END IF;
  
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trigger_notify_on_verification ON verification_queue;
CREATE TRIGGER trigger_notify_on_verification
  AFTER INSERT OR UPDATE ON verification_queue
  FOR EACH ROW
  EXECUTE FUNCTION notify_admin_on_verification_submission();

-- Update the verification status function to log changes
CREATE OR REPLACE FUNCTION update_verification_status(
  p_practitioner_id uuid,
  p_new_status text,
  p_admin_notes text DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_old_status text;
  v_admin_id uuid;
BEGIN
  v_admin_id := auth.uid();
  
  SELECT verification_status INTO v_old_status
  FROM practitioners
  WHERE id = p_practitioner_id;
  
  UPDATE practitioners
  SET
    verification_status = p_new_status::text,
    verified_at = CASE WHEN p_new_status = 'verified' THEN now() ELSE NULL END,
    updated_at = now()
  WHERE id = p_practitioner_id;
  
  UPDATE verification_queue
  SET
    status = p_new_status::text,
    reviewed_at = now(),
    reviewed_by = v_admin_id,
    admin_notes = p_admin_notes,
    updated_at = now()
  WHERE practitioner_id = p_practitioner_id;
  
  INSERT INTO verification_audit_log (
    practitioner_id,
    previous_status,
    new_status,
    admin_user_id,
    admin_notes
  ) VALUES (
    p_practitioner_id,
    v_old_status,
    p_new_status,
    v_admin_id,
    p_admin_notes
  );
  
  IF p_new_status = 'verified' THEN
    PERFORM create_admin_notification(
      'verification_pending',
      'Practitioner Verified',
      'Practitioner verification completed successfully',
      'low',
      NULL,
      jsonb_build_object('practitioner_id', p_practitioner_id)
    );
  END IF;
END;
$$;
