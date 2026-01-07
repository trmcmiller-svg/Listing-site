/*
  # Just Gorge V1 - Core Database Schema
  
  ## Overview
  This migration establishes the complete data model for the Just Gorge platform,
  a trust-first discovery platform for medical aesthetics practitioners.
  
  ## Key Principles
  - Identity-first verification gating
  - Append-only audit trails for trust and verification
  - Row Level Security (RLS) enabled on all tables
  - Pseudonymous patient identifiers for privacy
  - No medical data storage
  
  ## Tables Created
  
  ### 1. User Management
  - profiles: Extended user profile data
  
  ### 2. Practitioner Identity & Verification
  - practitioners: Core practitioner identity and business info
  - practices: Clinic/entity information
  - practitioner_licenses: Professional license details
  - practitioner_certifications: Training and certifications
  - practitioner_insurance: Malpractice insurance records
  - verification_queue: Pending verification requests
  - verification_audit: Immutable verification decision log
  
  ### 3. Specialties & Treatments
  - specialties: Treatment types and modalities
  - practitioner_specialties: Junction table for practitioner specialties
  
  ### 4. Trust Engine
  - trust_events: Append-only event log for trust signals
  - trust_badges: Computed badge state per practitioner
  - badge_audit: Badge state change history
  
  ### 5. Niccybox Profile System
  - niccybox_modules: Modular profile components
  
  ### 6. Connection & Messaging
  - consult_requests: Patient consultation requests
  - consult_threads: Active consultation conversations
  - direct_threads: Direct messaging threads (for premium)
  - messages: Message content
  
  ### 7. Subscription & Entitlements
  - subscriptions: Practitioner subscription plans
  
  ### 8. Admin & Moderation
  - admin_actions: Audit trail of all admin actions
  - content_reports: User-submitted reports
  
  ## Security
  - All tables have RLS enabled
  - Policies enforce role-based access control
  - Audit trails are immutable
  - Patient identifiers are hashed for privacy
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- ENUMS
-- ============================================================================

CREATE TYPE user_role AS ENUM ('patient', 'practitioner', 'admin');
CREATE TYPE verification_status AS ENUM ('unverified', 'pending', 'verified', 'rejected', 'needs_review');
CREATE TYPE practitioner_type AS ENUM ('md', 'do', 'np', 'pa', 'rn', 'aesthetician', 'laser_tech', 'other');
CREATE TYPE subscription_plan AS ENUM ('free', 'professional', 'premium');
CREATE TYPE subscription_status AS ENUM ('active', 'cancelled', 'past_due', 'trialing');
CREATE TYPE consult_status AS ENUM ('pending', 'accepted', 'declined', 'cancelled', 'completed');
CREATE TYPE thread_status AS ENUM ('active', 'archived', 'blocked');
CREATE TYPE trust_event_type AS ENUM (
  'profile_view',
  'follow_provider',
  'save_provider',
  'consult_request_sent',
  'consult_accepted',
  'consult_completed',
  'message_thread_active',
  'followup_marked_complete',
  'report_submitted'
);
CREATE TYPE badge_type AS ENUM (
  'verified_identity',
  'verified_practice',
  'continuity_of_care',
  'established_practitioner'
);
CREATE TYPE niccybox_module_type AS ENUM (
  'identity',
  'information',
  'collection',
  'your_why',
  'connection'
);
CREATE TYPE report_type AS ENUM ('spam', 'inappropriate', 'harassment', 'fraud', 'other');
CREATE TYPE report_status AS ENUM ('pending', 'reviewing', 'resolved', 'dismissed');

-- ============================================================================
-- 1. USER MANAGEMENT
-- ============================================================================

CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role user_role NOT NULL DEFAULT 'patient',
  email text NOT NULL,
  full_name text,
  phone text,
  avatar_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE INDEX idx_profiles_role ON profiles(role);

-- ============================================================================
-- 2. PRACTITIONER IDENTITY & VERIFICATION
-- ============================================================================

CREATE TABLE IF NOT EXISTS practitioners (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  legal_name text NOT NULL,
  professional_title text NOT NULL,
  practitioner_type practitioner_type NOT NULL,
  bio text,
  years_experience integer,
  accepts_new_patients boolean DEFAULT true,
  professional_email text,
  professional_phone text,
  website_url text,
  verification_status verification_status DEFAULT 'unverified',
  verified_at timestamptz,
  trust_score numeric DEFAULT 0,
  search_vector tsvector,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

ALTER TABLE practitioners ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Practitioners can view own data"
  ON practitioners FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Practitioners can update own data"
  ON practitioners FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Anyone can view verified practitioners"
  ON practitioners FOR SELECT
  TO authenticated
  USING (verification_status = 'verified');

CREATE INDEX idx_practitioners_user_id ON practitioners(user_id);
CREATE INDEX idx_practitioners_verification_status ON practitioners(verification_status);
CREATE INDEX idx_practitioners_type ON practitioners(practitioner_type);
CREATE INDEX idx_practitioners_search ON practitioners USING gin(search_vector);
CREATE INDEX idx_practitioners_trust_score ON practitioners(trust_score DESC);

-- ============================================================================

CREATE TABLE IF NOT EXISTS practices (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  address_line1 text NOT NULL,
  address_line2 text,
  city text NOT NULL,
  state text NOT NULL,
  zip_code text NOT NULL,
  country text DEFAULT 'US',
  phone text,
  email text,
  website_url text,
  is_verified boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE practices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view verified practices"
  ON practices FOR SELECT
  TO authenticated
  USING (is_verified = true);

CREATE INDEX idx_practices_location ON practices(city, state, zip_code);

-- ============================================================================

CREATE TABLE IF NOT EXISTS practitioner_licenses (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  practitioner_id uuid NOT NULL REFERENCES practitioners(id) ON DELETE CASCADE,
  license_type text NOT NULL,
  license_number text NOT NULL,
  issuing_state text NOT NULL,
  issue_date date,
  expiration_date date,
  is_active boolean DEFAULT true,
  document_url text,
  verified boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE practitioner_licenses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Practitioners can manage own licenses"
  ON practitioner_licenses FOR ALL
  TO authenticated
  USING (
    practitioner_id IN (
      SELECT id FROM practitioners WHERE user_id = auth.uid()
    )
  );

CREATE INDEX idx_licenses_practitioner ON practitioner_licenses(practitioner_id);
CREATE INDEX idx_licenses_expiration ON practitioner_licenses(expiration_date);

-- ============================================================================

CREATE TABLE IF NOT EXISTS practitioner_certifications (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  practitioner_id uuid NOT NULL REFERENCES practitioners(id) ON DELETE CASCADE,
  certification_name text NOT NULL,
  issuing_organization text NOT NULL,
  issue_date date,
  expiration_date date,
  certification_number text,
  document_url text,
  is_verified boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE practitioner_certifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Practitioners can manage own certifications"
  ON practitioner_certifications FOR ALL
  TO authenticated
  USING (
    practitioner_id IN (
      SELECT id FROM practitioners WHERE user_id = auth.uid()
    )
  );

CREATE INDEX idx_certifications_practitioner ON practitioner_certifications(practitioner_id);

-- ============================================================================

CREATE TABLE IF NOT EXISTS practitioner_insurance (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  practitioner_id uuid NOT NULL REFERENCES practitioners(id) ON DELETE CASCADE,
  insurance_type text NOT NULL DEFAULT 'malpractice',
  provider_name text NOT NULL,
  policy_number text NOT NULL,
  coverage_amount numeric,
  effective_date date NOT NULL,
  expiration_date date NOT NULL,
  document_url text,
  is_verified boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE practitioner_insurance ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Practitioners can manage own insurance"
  ON practitioner_insurance FOR ALL
  TO authenticated
  USING (
    practitioner_id IN (
      SELECT id FROM practitioners WHERE user_id = auth.uid()
    )
  );

CREATE INDEX idx_insurance_practitioner ON practitioner_insurance(practitioner_id);
CREATE INDEX idx_insurance_expiration ON practitioner_insurance(expiration_date);

-- ============================================================================

CREATE TABLE IF NOT EXISTS verification_queue (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  practitioner_id uuid NOT NULL REFERENCES practitioners(id) ON DELETE CASCADE,
  status verification_status NOT NULL DEFAULT 'pending',
  submitted_at timestamptz DEFAULT now(),
  reviewed_at timestamptz,
  reviewed_by uuid REFERENCES profiles(id),
  admin_notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE verification_queue ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Practitioners can view own verification status"
  ON verification_queue FOR SELECT
  TO authenticated
  USING (
    practitioner_id IN (
      SELECT id FROM practitioners WHERE user_id = auth.uid()
    )
  );

CREATE INDEX idx_verification_queue_status ON verification_queue(status);
CREATE INDEX idx_verification_queue_submitted ON verification_queue(submitted_at);

-- ============================================================================

CREATE TABLE IF NOT EXISTS verification_audit (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  practitioner_id uuid NOT NULL REFERENCES practitioners(id) ON DELETE CASCADE,
  old_status verification_status,
  new_status verification_status NOT NULL,
  changed_by uuid NOT NULL REFERENCES profiles(id),
  reason text,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE verification_audit ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view verification audit"
  ON verification_audit FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE INDEX idx_verification_audit_practitioner ON verification_audit(practitioner_id);
CREATE INDEX idx_verification_audit_created ON verification_audit(created_at DESC);

-- ============================================================================
-- 3. SPECIALTIES & TREATMENTS
-- ============================================================================

CREATE TABLE IF NOT EXISTS specialties (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL UNIQUE,
  category text NOT NULL,
  description text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE specialties ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active specialties"
  ON specialties FOR SELECT
  TO authenticated
  USING (is_active = true);

CREATE INDEX idx_specialties_category ON specialties(category);

-- ============================================================================

CREATE TABLE IF NOT EXISTS practitioner_specialties (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  practitioner_id uuid NOT NULL REFERENCES practitioners(id) ON DELETE CASCADE,
  specialty_id uuid NOT NULL REFERENCES specialties(id) ON DELETE CASCADE,
  years_experience integer,
  is_primary boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  UNIQUE(practitioner_id, specialty_id)
);

ALTER TABLE practitioner_specialties ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Practitioners can manage own specialties"
  ON practitioner_specialties FOR ALL
  TO authenticated
  USING (
    practitioner_id IN (
      SELECT id FROM practitioners WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Anyone can view verified practitioner specialties"
  ON practitioner_specialties FOR SELECT
  TO authenticated
  USING (
    practitioner_id IN (
      SELECT id FROM practitioners WHERE verification_status = 'verified'
    )
  );

CREATE INDEX idx_prac_specialties_practitioner ON practitioner_specialties(practitioner_id);
CREATE INDEX idx_prac_specialties_specialty ON practitioner_specialties(specialty_id);

-- ============================================================================
-- 4. TRUST ENGINE
-- ============================================================================

CREATE TABLE IF NOT EXISTS trust_events (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_type trust_event_type NOT NULL,
  patient_id_hash text NOT NULL,
  practitioner_id uuid NOT NULL REFERENCES practitioners(id) ON DELETE CASCADE,
  event_weight numeric NOT NULL DEFAULT 0,
  metadata jsonb DEFAULT '{}'::jsonb,
  source text DEFAULT 'web',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE trust_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "System can insert trust events"
  ON trust_events FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE INDEX idx_trust_events_practitioner ON trust_events(practitioner_id);
CREATE INDEX idx_trust_events_type ON trust_events(event_type);
CREATE INDEX idx_trust_events_created ON trust_events(created_at DESC);
CREATE INDEX idx_trust_events_patient_hash ON trust_events(patient_id_hash);

-- ============================================================================

CREATE TABLE IF NOT EXISTS trust_badges (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  practitioner_id uuid NOT NULL REFERENCES practitioners(id) ON DELETE CASCADE,
  badge_type badge_type NOT NULL,
  is_active boolean DEFAULT false,
  earned_at timestamptz,
  revoked_at timestamptz,
  last_computed_at timestamptz DEFAULT now(),
  computation_metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(practitioner_id, badge_type)
);

ALTER TABLE trust_badges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active badges"
  ON trust_badges FOR SELECT
  TO authenticated
  USING (is_active = true);

CREATE INDEX idx_trust_badges_practitioner ON trust_badges(practitioner_id);
CREATE INDEX idx_trust_badges_type ON trust_badges(badge_type);
CREATE INDEX idx_trust_badges_active ON trust_badges(is_active) WHERE is_active = true;

-- ============================================================================

CREATE TABLE IF NOT EXISTS badge_audit (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  practitioner_id uuid NOT NULL REFERENCES practitioners(id) ON DELETE CASCADE,
  badge_type badge_type NOT NULL,
  action text NOT NULL,
  old_state boolean,
  new_state boolean NOT NULL,
  reason text,
  computation_data jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE badge_audit ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view badge audit"
  ON badge_audit FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE INDEX idx_badge_audit_practitioner ON badge_audit(practitioner_id);
CREATE INDEX idx_badge_audit_created ON badge_audit(created_at DESC);

-- ============================================================================
-- 5. NICCYBOX PROFILE SYSTEM
-- ============================================================================

CREATE TABLE IF NOT EXISTS niccybox_modules (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  practitioner_id uuid NOT NULL REFERENCES practitioners(id) ON DELETE CASCADE,
  module_type niccybox_module_type NOT NULL,
  module_data jsonb NOT NULL DEFAULT '{}'::jsonb,
  display_order integer DEFAULT 0,
  is_visible boolean DEFAULT true,
  is_approved boolean DEFAULT false,
  version integer DEFAULT 1,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE niccybox_modules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Practitioners can manage own modules"
  ON niccybox_modules FOR ALL
  TO authenticated
  USING (
    practitioner_id IN (
      SELECT id FROM practitioners WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Anyone can view approved visible modules"
  ON niccybox_modules FOR SELECT
  TO authenticated
  USING (
    is_visible = true AND 
    is_approved = true AND
    practitioner_id IN (
      SELECT id FROM practitioners WHERE verification_status = 'verified'
    )
  );

CREATE INDEX idx_niccybox_practitioner ON niccybox_modules(practitioner_id);
CREATE INDEX idx_niccybox_type ON niccybox_modules(module_type);
CREATE INDEX idx_niccybox_display_order ON niccybox_modules(practitioner_id, display_order);

-- ============================================================================
-- 6. CONNECTION & MESSAGING
-- ============================================================================

CREATE TABLE IF NOT EXISTS consult_requests (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  practitioner_id uuid NOT NULL REFERENCES practitioners(id) ON DELETE CASCADE,
  treatment_interest text,
  message text NOT NULL,
  patient_notes text,
  status consult_status DEFAULT 'pending',
  response_message text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE consult_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Patients can view own consult requests"
  ON consult_requests FOR SELECT
  TO authenticated
  USING (patient_id = auth.uid());

CREATE POLICY "Practitioners can view requests to them"
  ON consult_requests FOR SELECT
  TO authenticated
  USING (
    practitioner_id IN (
      SELECT id FROM practitioners WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Patients can create consult requests"
  ON consult_requests FOR INSERT
  TO authenticated
  WITH CHECK (patient_id = auth.uid());

CREATE POLICY "Practitioners can update requests to them"
  ON consult_requests FOR UPDATE
  TO authenticated
  USING (
    practitioner_id IN (
      SELECT id FROM practitioners WHERE user_id = auth.uid()
    )
  );

CREATE INDEX idx_consult_requests_patient ON consult_requests(patient_id);
CREATE INDEX idx_consult_requests_practitioner ON consult_requests(practitioner_id);
CREATE INDEX idx_consult_requests_status ON consult_requests(status);

-- ============================================================================

CREATE TABLE IF NOT EXISTS consult_threads (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  consult_request_id uuid NOT NULL REFERENCES consult_requests(id) ON DELETE CASCADE,
  patient_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  practitioner_id uuid NOT NULL REFERENCES practitioners(id) ON DELETE CASCADE,
  status thread_status DEFAULT 'active',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(consult_request_id)
);

ALTER TABLE consult_threads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Patients can view own consult threads"
  ON consult_threads FOR SELECT
  TO authenticated
  USING (patient_id = auth.uid());

CREATE POLICY "Practitioners can view threads with them"
  ON consult_threads FOR SELECT
  TO authenticated
  USING (
    practitioner_id IN (
      SELECT id FROM practitioners WHERE user_id = auth.uid()
    )
  );

CREATE INDEX idx_consult_threads_patient ON consult_threads(patient_id);
CREATE INDEX idx_consult_threads_practitioner ON consult_threads(practitioner_id);

-- ============================================================================

CREATE TABLE IF NOT EXISTS direct_threads (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  practitioner_id uuid NOT NULL REFERENCES practitioners(id) ON DELETE CASCADE,
  message_count_by_patient integer DEFAULT 0,
  status thread_status DEFAULT 'active',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(patient_id, practitioner_id)
);

ALTER TABLE direct_threads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Patients can view own direct threads"
  ON direct_threads FOR SELECT
  TO authenticated
  USING (patient_id = auth.uid());

CREATE POLICY "Practitioners can view threads with them"
  ON direct_threads FOR SELECT
  TO authenticated
  USING (
    practitioner_id IN (
      SELECT id FROM practitioners WHERE user_id = auth.uid()
    )
  );

CREATE INDEX idx_direct_threads_patient ON direct_threads(patient_id);
CREATE INDEX idx_direct_threads_practitioner ON direct_threads(practitioner_id);

-- ============================================================================

CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  thread_id uuid NOT NULL,
  thread_type text NOT NULL CHECK (thread_type IN ('consult', 'direct')),
  sender_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  sender_type text NOT NULL CHECK (sender_type IN ('patient', 'practitioner')),
  content text NOT NULL,
  is_read boolean DEFAULT false,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view messages in their threads"
  ON messages FOR SELECT
  TO authenticated
  USING (
    (thread_type = 'consult' AND thread_id IN (
      SELECT id FROM consult_threads 
      WHERE patient_id = auth.uid() OR practitioner_id IN (
        SELECT id FROM practitioners WHERE user_id = auth.uid()
      )
    )) OR
    (thread_type = 'direct' AND thread_id IN (
      SELECT id FROM direct_threads 
      WHERE patient_id = auth.uid() OR practitioner_id IN (
        SELECT id FROM practitioners WHERE user_id = auth.uid()
      )
    ))
  );

CREATE POLICY "Users can send messages in their threads"
  ON messages FOR INSERT
  TO authenticated
  WITH CHECK (sender_id = auth.uid());

CREATE INDEX idx_messages_thread ON messages(thread_id, thread_type);
CREATE INDEX idx_messages_sender ON messages(sender_id);
CREATE INDEX idx_messages_created ON messages(created_at DESC);

-- ============================================================================
-- 7. SUBSCRIPTION & ENTITLEMENTS
-- ============================================================================

CREATE TABLE IF NOT EXISTS subscriptions (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  practitioner_id uuid NOT NULL REFERENCES practitioners(id) ON DELETE CASCADE,
  plan_type subscription_plan NOT NULL DEFAULT 'free',
  status subscription_status NOT NULL DEFAULT 'active',
  current_period_start timestamptz,
  current_period_end timestamptz,
  stripe_subscription_id text,
  stripe_customer_id text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(practitioner_id)
);

ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Practitioners can view own subscription"
  ON subscriptions FOR SELECT
  TO authenticated
  USING (
    practitioner_id IN (
      SELECT id FROM practitioners WHERE user_id = auth.uid()
    )
  );

CREATE INDEX idx_subscriptions_practitioner ON subscriptions(practitioner_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);

-- ============================================================================
-- 8. ADMIN & MODERATION
-- ============================================================================

CREATE TABLE IF NOT EXISTS admin_actions (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  admin_id uuid NOT NULL REFERENCES profiles(id),
  action_type text NOT NULL,
  target_type text NOT NULL,
  target_id uuid NOT NULL,
  description text NOT NULL,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE admin_actions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view admin actions"
  ON admin_actions FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can create admin actions"
  ON admin_actions FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE INDEX idx_admin_actions_admin ON admin_actions(admin_id);
CREATE INDEX idx_admin_actions_target ON admin_actions(target_type, target_id);
CREATE INDEX idx_admin_actions_created ON admin_actions(created_at DESC);

-- ============================================================================

CREATE TABLE IF NOT EXISTS content_reports (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  reporter_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  reported_user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  report_type report_type NOT NULL,
  status report_status DEFAULT 'pending',
  content_type text NOT NULL,
  content_id uuid NOT NULL,
  description text NOT NULL,
  reviewed_by uuid REFERENCES profiles(id),
  reviewed_at timestamptz,
  resolution_notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE content_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can create reports"
  ON content_reports FOR INSERT
  TO authenticated
  WITH CHECK (reporter_id = auth.uid());

CREATE POLICY "Users can view own reports"
  ON content_reports FOR SELECT
  TO authenticated
  USING (reporter_id = auth.uid());

CREATE POLICY "Admins can view all reports"
  ON content_reports FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE INDEX idx_content_reports_status ON content_reports(status);
CREATE INDEX idx_content_reports_created ON content_reports(created_at DESC);

-- ============================================================================
-- FUNCTIONS & TRIGGERS
-- ============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to relevant tables
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_practitioners_updated_at BEFORE UPDATE ON practitioners
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_practices_updated_at BEFORE UPDATE ON practices
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_niccybox_modules_updated_at BEFORE UPDATE ON niccybox_modules
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON subscriptions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to update practitioner search vector
CREATE OR REPLACE FUNCTION update_practitioner_search_vector()
RETURNS TRIGGER AS $$
BEGIN
  NEW.search_vector := 
    setweight(to_tsvector('english', coalesce(NEW.legal_name, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(NEW.professional_title, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(NEW.bio, '')), 'C');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_practitioners_search_vector 
  BEFORE INSERT OR UPDATE OF legal_name, professional_title, bio
  ON practitioners
  FOR EACH ROW EXECUTE FUNCTION update_practitioner_search_vector();

-- ============================================================================
-- SEED DATA
-- ============================================================================

-- Insert common specialties
INSERT INTO specialties (name, category, description) VALUES
  ('Botox', 'Injectables', 'Botulinum toxin injections for wrinkle reduction'),
  ('Dermal Fillers', 'Injectables', 'Hyaluronic acid and other fillers for volume restoration'),
  ('Laser Hair Removal', 'Laser Treatments', 'Permanent hair reduction using laser technology'),
  ('Laser Skin Resurfacing', 'Laser Treatments', 'Skin rejuvenation and texture improvement'),
  ('Chemical Peels', 'Skin Treatments', 'Exfoliation treatment for skin renewal'),
  ('Microneedling', 'Skin Treatments', 'Collagen induction therapy'),
  ('PRP Therapy', 'Skin Treatments', 'Platelet-rich plasma for skin rejuvenation'),
  ('HydraFacial', 'Facials', 'Medical-grade facial treatment'),
  ('Body Contouring', 'Body Treatments', 'Non-surgical body sculpting'),
  ('CoolSculpting', 'Body Treatments', 'Cryolipolysis fat reduction'),
  ('PDO Threads', 'Advanced Treatments', 'Thread lift for skin tightening'),
  ('Kybella', 'Injectables', 'Double chin reduction treatment')
ON CONFLICT (name) DO NOTHING;