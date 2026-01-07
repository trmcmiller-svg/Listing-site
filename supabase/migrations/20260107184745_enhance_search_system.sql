/*
  # Enhanced Search System with Trust-Weighted Ranking

  ## Overview
  This migration enhances the search system with full-text search,
  location-based filtering, and trust-weighted ranking.

  ## New Features
  
  ### Full-Text Search Enhancement
  - Improved search vector on practitioners table
  - Weights: legal_name (A), professional_title (B), bio (C)
  - Automatic vector updates on data changes
  
  ### Location Search
  - Geographic search capabilities
  - City and state filtering
  - Distance-based search ready
  
  ### Trust-Weighted Ranking
  - Combines text relevance with trust score
  - Verification status boost
  - Badge count consideration

  ## New Tables
  
  ### `search_analytics`
  Tracks search queries for analytics and improvement
  - `id` (uuid, primary key)
  - `query` (text) - Search query
  - `user_id` (uuid, nullable) - User who searched
  - `filters` (jsonb) - Applied filters
  - `results_count` (integer) - Number of results
  - `clicked_practitioner_id` (uuid, nullable) - If user clicked a result
  - `created_at` (timestamptz)

  ## Functions
  
  ### `search_practitioners()`
  Comprehensive search function with:
  - Full-text search with ranking
  - Trust score weighting
  - Specialty filtering
  - Location filtering
  - Verification status filtering
  - Pagination support

  ### `update_practitioner_search_vector()`
  Automatically maintains search vectors

  ## Indexes
  - GIN index on search_vector for fast text search
  - Indexes on location fields
  - Composite indexes for common filter combinations

  ## Security
  - RLS enabled on search_analytics
  - Public read access to verified practitioners
  - Analytics only viewable by admins
*/

-- Drop existing search vector trigger if exists
DROP TRIGGER IF EXISTS update_practitioners_search_vector ON practitioners;
DROP FUNCTION IF EXISTS update_practitioner_search_vector();

-- Enhanced search vector function
CREATE OR REPLACE FUNCTION update_practitioner_search_vector() RETURNS TRIGGER AS $$
BEGIN
  NEW.search_vector := 
    setweight(to_tsvector('english', COALESCE(NEW.legal_name, '')), 'A') ||
    setweight(to_tsvector('english', COALESCE(NEW.professional_title, '')), 'B') ||
    setweight(to_tsvector('english', COALESCE(NEW.bio, '')), 'C');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Recreate trigger
CREATE TRIGGER update_practitioners_search_vector
  BEFORE INSERT OR UPDATE OF legal_name, professional_title, bio
  ON practitioners
  FOR EACH ROW
  EXECUTE FUNCTION update_practitioner_search_vector();

-- Update existing search vectors
UPDATE practitioners
SET search_vector = 
  setweight(to_tsvector('english', COALESCE(legal_name, '')), 'A') ||
  setweight(to_tsvector('english', COALESCE(professional_title, '')), 'B') ||
  setweight(to_tsvector('english', COALESCE(bio, '')), 'C')
WHERE search_vector IS NULL OR search_vector = to_tsvector('english', '');

-- Create search analytics table
CREATE TABLE IF NOT EXISTS search_analytics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  query text NOT NULL,
  user_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  filters jsonb DEFAULT '{}'::jsonb,
  results_count integer DEFAULT 0,
  clicked_practitioner_id uuid REFERENCES practitioners(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on search_analytics
ALTER TABLE search_analytics ENABLE ROW LEVEL SECURITY;

-- RLS Policies for search_analytics
CREATE POLICY "Anyone can insert search analytics"
  ON search_analytics FOR INSERT
  TO authenticated, anon
  WITH CHECK (true);

CREATE POLICY "Admins can view all search analytics"
  ON search_analytics FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
        AND profiles.role = 'admin'
    )
  );

-- Comprehensive search function with trust-weighted ranking
CREATE OR REPLACE FUNCTION search_practitioners(
  p_query text DEFAULT NULL,
  p_specialties uuid[] DEFAULT NULL,
  p_city text DEFAULT NULL,
  p_state text DEFAULT NULL,
  p_verification_status verification_status DEFAULT NULL,
  p_min_years_experience integer DEFAULT NULL,
  p_accepts_new_patients boolean DEFAULT NULL,
  p_limit integer DEFAULT 20,
  p_offset integer DEFAULT 0
) RETURNS TABLE(
  id uuid,
  user_id uuid,
  legal_name text,
  professional_title text,
  practitioner_type practitioner_type,
  bio text,
  years_experience integer,
  accepts_new_patients boolean,
  verification_status verification_status,
  trust_score numeric,
  avatar_url text,
  practice_city text,
  practice_state text,
  specialties jsonb,
  badges jsonb,
  subscription_plan subscription_plan,
  relevance_score numeric
) AS $$
BEGIN
  RETURN QUERY
  WITH practitioner_specialties_agg AS (
    SELECT 
      ps.practitioner_id,
      jsonb_agg(
        jsonb_build_object(
          'id', s.id,
          'name', s.name,
          'category', s.category,
          'years_experience', ps.years_experience
        )
      ) AS specialties
    FROM practitioner_specialties ps
    JOIN specialties s ON s.id = ps.specialty_id
    WHERE s.is_active = true
    GROUP BY ps.practitioner_id
  ),
  practitioner_badges_agg AS (
    SELECT 
      tb.practitioner_id,
      jsonb_agg(
        jsonb_build_object(
          'type', tb.badge_type,
          'is_active', tb.is_active,
          'earned_at', tb.earned_at
        )
      ) FILTER (WHERE tb.is_active = true) AS badges,
      COUNT(*) FILTER (WHERE tb.is_active = true) AS badge_count
    FROM trust_badges tb
    GROUP BY tb.practitioner_id
  ),
  practitioner_practices AS (
    SELECT DISTINCT ON (pr.user_id)
      pr.user_id,
      p.city,
      p.state
    FROM practitioners pr
    LEFT JOIN practices p ON p.id IS NOT NULL
    ORDER BY pr.user_id, p.created_at DESC
  )
  SELECT 
    pr.id,
    pr.user_id,
    pr.legal_name,
    pr.professional_title,
    pr.practitioner_type,
    pr.bio,
    pr.years_experience,
    pr.accepts_new_patients,
    pr.verification_status,
    pr.trust_score,
    prof.avatar_url,
    pp.city AS practice_city,
    pp.state AS practice_state,
    COALESCE(psa.specialties, '[]'::jsonb) AS specialties,
    COALESCE(pba.badges, '[]'::jsonb) AS badges,
    COALESCE(sub.plan_type, 'free'::subscription_plan) AS subscription_plan,
    -- Trust-weighted relevance score
    (
      CASE 
        WHEN p_query IS NOT NULL AND p_query != '' THEN
          -- Text search relevance (0-1) * 0.6
          (ts_rank(pr.search_vector, plainto_tsquery('english', p_query)) * 0.6)
        ELSE 0.3
      END
      +
      -- Trust score (normalized to 0-1) * 0.3
      (LEAST(COALESCE(pr.trust_score, 0) / 100, 1) * 0.3)
      +
      -- Verification boost * 0.1
      (CASE WHEN pr.verification_status = 'verified' THEN 0.1 ELSE 0 END)
      +
      -- Badge count boost (up to 0.05)
      (LEAST(COALESCE(pba.badge_count, 0) * 0.0125, 0.05))
    ) AS relevance_score
  FROM practitioners pr
  JOIN profiles prof ON prof.id = pr.user_id
  LEFT JOIN practitioner_specialties_agg psa ON psa.practitioner_id = pr.id
  LEFT JOIN practitioner_badges_agg pba ON pba.practitioner_id = pr.id
  LEFT JOIN practitioner_practices pp ON pp.user_id = pr.user_id
  LEFT JOIN subscriptions sub ON sub.practitioner_id = pr.id
  WHERE
    -- Verification filter (default to verified only)
    (p_verification_status IS NULL AND pr.verification_status = 'verified'
     OR p_verification_status IS NOT NULL AND pr.verification_status = p_verification_status)
    -- Text search filter
    AND (p_query IS NULL OR p_query = '' 
         OR pr.search_vector @@ plainto_tsquery('english', p_query))
    -- Specialty filter
    AND (p_specialties IS NULL 
         OR EXISTS (
           SELECT 1 FROM practitioner_specialties ps2
           WHERE ps2.practitioner_id = pr.id
             AND ps2.specialty_id = ANY(p_specialties)
         ))
    -- Location filters
    AND (p_city IS NULL OR pp.city ILIKE '%' || p_city || '%')
    AND (p_state IS NULL OR pp.state ILIKE '%' || p_state || '%')
    -- Experience filter
    AND (p_min_years_experience IS NULL 
         OR pr.years_experience >= p_min_years_experience)
    -- Accepts new patients filter
    AND (p_accepts_new_patients IS NULL 
         OR pr.accepts_new_patients = p_accepts_new_patients)
  ORDER BY relevance_score DESC
  LIMIT p_limit
  OFFSET p_offset;
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- Function to get trending searches
CREATE OR REPLACE FUNCTION get_trending_searches(
  p_days integer DEFAULT 7,
  p_limit integer DEFAULT 10
) RETURNS TABLE(
  query text,
  search_count bigint,
  avg_results integer
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    sa.query,
    COUNT(*) AS search_count,
    AVG(sa.results_count)::integer AS avg_results
  FROM search_analytics sa
  WHERE sa.created_at >= now() - (p_days || ' days')::interval
    AND sa.query IS NOT NULL
    AND sa.query != ''
  GROUP BY sa.query
  ORDER BY search_count DESC
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- Function to get popular practitioners (by search clicks)
CREATE OR REPLACE FUNCTION get_popular_practitioners(
  p_days integer DEFAULT 30,
  p_limit integer DEFAULT 10
) RETURNS TABLE(
  practitioner_id uuid,
  click_count bigint,
  legal_name text,
  professional_title text,
  trust_score numeric
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    sa.clicked_practitioner_id AS practitioner_id,
    COUNT(*) AS click_count,
    pr.legal_name,
    pr.professional_title,
    pr.trust_score
  FROM search_analytics sa
  JOIN practitioners pr ON pr.id = sa.clicked_practitioner_id
  WHERE sa.clicked_practitioner_id IS NOT NULL
    AND sa.created_at >= now() - (p_days || ' days')::interval
  GROUP BY sa.clicked_practitioner_id, pr.legal_name, pr.professional_title, pr.trust_score
  ORDER BY click_count DESC
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- Create indexes for search performance
CREATE INDEX IF NOT EXISTS idx_practitioners_search_vector 
  ON practitioners USING gin(search_vector);

CREATE INDEX IF NOT EXISTS idx_practitioners_verification_status 
  ON practitioners(verification_status);

CREATE INDEX IF NOT EXISTS idx_practitioners_trust_score 
  ON practitioners(trust_score DESC);

CREATE INDEX IF NOT EXISTS idx_practitioners_accepts_new 
  ON practitioners(accepts_new_patients) 
  WHERE accepts_new_patients = true;

CREATE INDEX IF NOT EXISTS idx_search_analytics_created 
  ON search_analytics(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_search_analytics_query 
  ON search_analytics(query);

CREATE INDEX IF NOT EXISTS idx_search_analytics_clicked 
  ON search_analytics(clicked_practitioner_id) 
  WHERE clicked_practitioner_id IS NOT NULL;

-- Composite index for common filter combinations
CREATE INDEX IF NOT EXISTS idx_practitioners_verified_accepting 
  ON practitioners(verification_status, accepts_new_patients)
  WHERE verification_status = 'verified' AND accepts_new_patients = true;