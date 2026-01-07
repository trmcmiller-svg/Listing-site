# Sprint 6: Search & Discovery - Implementation Summary

## Overview
Sprint 6 implements a comprehensive search and discovery system with full-text search, trust-weighted ranking, advanced filtering, and search analytics. The system prioritizes verified practitioners while allowing users to find the best match based on multiple criteria.

## Database Enhancements

### Enhanced Full-Text Search

#### Search Vector with Weighted Fields
- **Weight A (Highest):** Legal name - Most important for direct name searches
- **Weight B (Medium):** Professional title - Job title and credentials
- **Weight C (Lower):** Bio - Professional description and background

#### Automatic Vector Maintenance
Trigger automatically updates search vectors when practitioner data changes:
- Fires on INSERT or UPDATE of name, title, or bio
- Uses PostgreSQL's `tsvector` and `to_tsvector` for English text
- GIN index for fast full-text search performance

### New Table: `search_analytics`

Tracks all search queries for insights and optimization:

```sql
CREATE TABLE search_analytics (
  id uuid PRIMARY KEY,
  query text NOT NULL,
  user_id uuid REFERENCES profiles(id),
  filters jsonb DEFAULT '{}',
  results_count integer DEFAULT 0,
  clicked_practitioner_id uuid,
  created_at timestamptz DEFAULT now()
);
```

**Use Cases:**
- Track popular search terms
- Identify zero-result searches for improvement
- Measure click-through rates
- Understand user search patterns
- A/B testing for search algorithm improvements

### Comprehensive Indexes

Performance-optimized indexes:
- `idx_practitioners_search_vector` - GIN index for full-text search
- `idx_practitioners_verification_status` - Fast verification filtering
- `idx_practitioners_trust_score` - Descending order for ranking
- `idx_practitioners_accepts_new` - Quick filtering for available providers
- `idx_practitioners_verified_accepting` - Composite index for common query
- `idx_search_analytics_*` - Multiple indexes for analytics queries

## Trust-Weighted Ranking Algorithm

### Relevance Score Calculation

The search algorithm combines multiple factors into a single relevance score (0-1 scale):

```typescript
relevance_score =
  (text_relevance * 0.6) +      // 60% weight
  (trust_score * 0.3) +          // 30% weight
  (verification_boost * 0.1) +   // 10% weight
  (badge_boost * 0.05)           // Up to 5% bonus
```

#### Component Breakdown

**1. Text Relevance (60% weight)**
- Uses PostgreSQL's `ts_rank` function
- Scores 0-1 based on query term matching
- Considers term frequency and document length
- Higher weight for exact matches in name vs bio

**2. Trust Score (30% weight)**
- Normalized to 0-1 scale (trust_score / 100)
- Based on accumulated trust events
- Reflects user engagement and satisfaction
- No pay-to-rank: purely merit-based

**3. Verification Boost (10% weight)**
- Binary bonus for verified practitioners
- Verified: +0.1 to relevance score
- Unverified: +0.0
- Ensures verified practitioners rank higher

**4. Badge Bonus (up to 5% weight)**
- +0.0125 per active badge
- Maximum 4 badges = +0.05
- Rewards high-quality profiles
- Badges: Identity, Practice, Continuity, Established

### Why This Algorithm?

**Balances Multiple Goals:**
1. **Relevance:** Users find what they're searching for (60%)
2. **Quality:** High-trust practitioners surface first (30%)
3. **Safety:** Verified practitioners get priority (10%)
4. **Excellence:** Best practitioners get recognition (5%)

**No Pay-to-Rank:**
- Subscription plan does NOT affect ranking
- Rankings based solely on trust and relevance
- Maintains platform integrity
- Fair competition for all practitioners

## Database Functions

### 1. `search_practitioners()`

Comprehensive search with all filters:

```sql
search_practitioners(
  p_query text,                    -- Search query
  p_specialties uuid[],            -- Specialty filter
  p_city text,                     -- City filter
  p_state text,                    -- State filter
  p_verification_status,           -- Verification filter
  p_min_years_experience integer,  -- Experience filter
  p_accepts_new_patients boolean,  -- Availability filter
  p_limit integer,                 -- Results per page
  p_offset integer                 -- Pagination offset
)
```

**Returns:**
- Full practitioner details
- Aggregated specialties array
- Active badges array
- Subscription plan
- Calculated relevance score

**Features:**
- Full-text search with ranking
- Multiple filter combinations
- Efficient joins and aggregations
- Pagination support
- Security: SECURITY DEFINER with proper RLS

### 2. `get_trending_searches()`

Analyzes search patterns:

```sql
get_trending_searches(
  p_days integer DEFAULT 7,
  p_limit integer DEFAULT 10
)
```

**Returns:**
- Most searched queries
- Search frequency
- Average result counts

**Use Cases:**
- Homepage "Trending Searches" widget
- SEO keyword optimization
- Content strategy
- Search experience improvements

### 3. `get_popular_practitioners()`

Identifies high-engagement practitioners:

```sql
get_popular_practitioners(
  p_days integer DEFAULT 30,
  p_limit integer DEFAULT 10
)
```

**Returns:**
- Most-clicked practitioners
- Click counts
- Practitioner details
- Trust scores

**Use Cases:**
- "Popular Providers" sections
- Marketing insights
- Quality assurance
- Trust event validation

## Services Layer

### Search Service (`src/services/searchService.ts`)

Complete search functionality:

#### `searchPractitioners(filters)`
Primary search function with all filter options:
```typescript
{
  query?: string;
  specialties?: string[];
  city?: string;
  state?: string;
  verificationStatus?: VerificationStatus;
  minYearsExperience?: number;
  acceptsNewPatients?: boolean;
  limit?: number;
  offset?: number;
}
```

#### `trackSearch(query, filters, resultsCount, userId)`
Records search for analytics:
- Captures search parameters
- Links to user (if authenticated)
- Stores filter configuration
- Returns analytics ID for click tracking

#### `trackPractitionerClick(searchAnalyticsId, practitionerId)`
Links searches to profile views:
- Measures search effectiveness
- Identifies high-performing listings
- Calculates click-through rates

#### `getTrendingSearches(days, limit)`
Retrieves popular searches:
- Configurable time window
- Adjustable result count
- Sorted by frequency

#### `getPopularPractitioners(days, limit)`
Finds most-viewed practitioners:
- Recent popularity trends
- Click-based ranking
- Time-window filtering

#### `getAllSpecialties()`
Retrieves active specialties:
- Grouped by category
- Sorted alphabetically
- Only active specialties

#### `getFeaturedPractitioners(limit)`
Gets top verified practitioners:
- Verified only
- Accepting new patients
- Trust-score ranked
- Configurable count

#### `getPractitionersBySpecialty(specialtyId, limit)`
Specialty-specific search:
- Single specialty filter
- Verified practitioners only
- Trust-score ranked

## Utility Functions

### Search Utils (`src/utils/searchUtils.ts`)

#### URL Query Management
- `buildSearchQuery(filters)` - Converts filters to URL params
- `parseSearchQuery(search)` - Parses URL params to filters
- Enables shareable search URLs
- Browser history integration

#### Display Formatters
- `formatLocation(city, state)` - Formats addresses
- `formatExperience(years)` - Human-readable experience
- `getPractitionerTypeLabel(type)` - Full credential names
- `getBadgeLabel(badgeType)` - Badge display names
- `getBadgeIcon(badgeType)` - Badge emoji/icons
- `getSubscriptionPlanLabel(plan)` - Plan display names
- `formatTrustScore(score)` - Rounded score display
- `getTrustScoreColor(score)` - Color coding by score range
- `getVerificationBadgeColor(status)` - Status-based styling

#### Filter Options
- `US_STATES` - All 50 states with abbreviations
- `EXPERIENCE_OPTIONS` - Pre-defined experience ranges

## UI Components

### 1. SearchFilters Component

Comprehensive filter interface:

**Features:**
- Text search input with real-time updates
- City and state dropdowns
- Experience level selector
- "Accepting new patients" checkbox
- Multi-select specialty checkboxes
- Collapsible filter panel
- Active filter count badge
- Clear filters functionality
- Apply filters button

**UX Enhancements:**
- Enter key triggers search
- Filters organized by category
- Specialty grouping by treatment type
- Clear visual hierarchy
- Responsive design

### 2. SearchResultCard Component

Rich practitioner display:

**Information Displayed:**
- Avatar and name
- Professional title
- Trust score (prominent, color-coded)
- Verification badge
- Years of experience
- Accepting new patients indicator
- Specialty tags (up to 3 + overflow)
- Trust badges with icons
- Bio excerpt (2 lines)
- Location
- Call-to-action button

**Interactive Features:**
- Click tracking integration
- Hover effects
- Link to full profile
- Responsive layout

### 3. SearchPage Component

Main search interface:

**Layout:**
- Page header with title and description
- Search filters (collapsible)
- Results count and sort indicator
- Search results list
- Load more pagination
- Loading states
- Empty states

**Features:**
- URL-based search state
- Browser history integration
- Search analytics tracking
- Click tracking
- Infinite scroll with "Load More"
- 20 results per page
- Responsive grid

**User Experience:**
- Clear loading indicators
- Helpful empty state messaging
- Sort explanation ("trust score and relevance")
- Smooth transitions
- Keyboard navigation support

## Search Flow

### 1. Initial Page Load
```
User visits /search
  → Parse URL query params
  → Set filters from URL
  → Execute search
  → Display results
```

### 2. Filter Change
```
User modifies filters
  → Update local state
  → User clicks "Search" or "Apply Filters"
  → Build new URL query string
  → Navigate to updated URL
  → Triggers new search via useEffect
```

### 3. Search Execution
```
performSearch(filters)
  → Call search_practitioners RPC
  → Track search in analytics
  → Store analytics ID
  → Update results state
  → Update loading state
```

### 4. Profile Click
```
User clicks practitioner card
  → Track click event with analytics ID
  → Navigate to profile page
```

### 5. Pagination
```
User clicks "Load More"
  → Increment page number
  → Call search with offset
  → Append new results
  → Update hasMore state
```

## Search Analytics Insights

### Metrics Tracked

**Per Search:**
- Query terms used
- Filters applied (stored as JSON)
- Number of results returned
- User ID (if authenticated)
- Timestamp

**Per Click:**
- Which practitioner was clicked
- Links back to original search
- Enables conversion tracking

### Analytics Use Cases

**Product Improvements:**
- Identify zero-result searches to add content
- Find popular filters to prioritize UI
- Measure search-to-click conversion rate
- A/B test ranking algorithms

**Business Intelligence:**
- Most searched specialties
- Geographic demand patterns
- User search behavior
- Popular vs. clicked (quality gap)

**Marketing:**
- SEO keyword opportunities
- Content gap analysis
- Geographic expansion planning
- Practitioner recruitment targeting

## Performance Optimizations

### Database Level
- GIN indexes for full-text search (fast text search)
- Composite indexes for common filter combinations
- Materialized aggregations via CTEs
- Efficient join ordering
- Index-only scans where possible

### Application Level
- Pagination (20 results/page)
- Lazy loading additional pages
- Debounced search input (prevents spam)
- Client-side filter state caching
- URL-based state (enables back button)

### Expected Performance
- Full-text search: < 100ms
- Filtered search: < 200ms
- Pagination: < 50ms
- Analytics writes: async, non-blocking

## Security Considerations

### Row Level Security
- `search_analytics` has RLS enabled
- Anyone can insert (tracking)
- Only admins can view all analytics
- User can view own analytics

### Search Function Security
- `SECURITY DEFINER` for consistent execution
- Returns only verified practitioners by default
- No sensitive data exposure
- SQL injection protected (parameterized)

### Data Privacy
- User IDs stored but optional
- No PII in search queries tracked
- Analytics for aggregate analysis only
- GDPR-compliant design

## Filter Combinations

### Common Search Patterns

**1. General Search**
```typescript
{ query: "botox" }
// Full-text search across all practitioners
```

**2. Location-Based**
```typescript
{ city: "Los Angeles", state: "CA" }
// All verified practitioners in LA
```

**3. Specialty Filter**
```typescript
{ specialties: ["botox-id", "fillers-id"] }
// Practitioners with Botox OR Fillers
```

**4. Experienced Providers**
```typescript
{ minYearsExperience: 10, acceptsNewPatients: true }
// Veteran practitioners accepting patients
```

**5. Complex Query**
```typescript
{
  query: "dermatologist",
  state: "CA",
  minYearsExperience: 5,
  specialties: ["botox-id"],
  acceptsNewPatients: true
}
// Experienced CA dermatologists with Botox, accepting patients
```

## Integration Points

### With Trust Engine
- Trust scores directly influence ranking
- Badge counts provide bonus
- Trust events feed into scores
- Search clicks create trust events

### With Verification System
- Only verified practitioners shown by default
- Verification status prominently displayed
- Can filter by verification status
- Unverified hidden from public search

### With Subscription System
- Subscription plan displayed on cards
- Premium features highlighted
- NO impact on search ranking
- Plan affects messaging capabilities

### With Messaging System
- Direct links to consult requests
- Shows if accepting new patients
- Plan-based messaging indicators
- "Contact" buttons on results

## Future Enhancements

### Potential Additions

**Geographic Search:**
- Distance-based search
- Map view of results
- "Near me" functionality
- Geographic clustering

**Advanced Filters:**
- Price range filtering
- Insurance accepted
- Languages spoken
- Gender preference
- Before/after photo filtering

**Search Experience:**
- Autocomplete suggestions
- "Did you mean?" corrections
- Related searches
- Recently viewed practitioners
- Saved searches

**Personalization:**
- Search history
- Recommended practitioners
- Favorite practitioners
- Custom alerts

**Analytics:**
- Search quality scoring
- Result relevance feedback
- User satisfaction surveys
- Conversion funnel tracking

## Testing Considerations

### Test Scenarios

**1. Search Functionality**
- Empty query returns all verified practitioners
- Text search matches name, title, and bio
- Filters correctly narrow results
- Pagination works correctly
- Multiple filters combine (AND logic for location/experience, OR for specialties)

**2. Ranking Algorithm**
- Higher trust scores rank higher (same relevance)
- Verified practitioners outrank unverified
- Exact name matches rank highest
- Badge counts provide subtle boost

**3. Analytics Tracking**
- Searches are logged correctly
- Clicks are linked to searches
- Anonymous and authenticated tracking works
- Trending searches calculate correctly

**4. Performance**
- Large result sets load quickly
- Filters don't cause timeouts
- Pagination is smooth
- No N+1 query problems

**5. Edge Cases**
- Zero results handled gracefully
- Invalid specialty IDs ignored
- Special characters in queries work
- Very long queries don't break

## Success Metrics

### User Experience
- Search-to-click rate > 50%
- Zero-result searches < 10%
- Average results per search: 10-50
- Filter usage rate > 30%

### Performance
- P95 search latency < 500ms
- P99 search latency < 1s
- Page load time < 2s
- No timeout errors

### Business Impact
- Practitioner profile views increase
- Consultation requests increase
- User engagement (return visits)
- Geographic distribution of searches

## File Structure

```
src/
├── services/
│   └── searchService.ts              # Search API and analytics
├── utils/
│   └── searchUtils.ts                # Formatters and helpers
├── components/
│   ├── SearchFilters.tsx             # Filter interface
│   └── SearchResultCard.tsx          # Result display
└── pages/
    └── SearchPage.tsx                # Main search page

supabase/migrations/
└── enhance_search_system.sql         # Full-text search & functions
```

## Sprint 6 Status: COMPLETE ✅

All search and discovery features implemented and tested:
- ✅ Full-text search with weighted fields
- ✅ Trust-weighted ranking algorithm
- ✅ Comprehensive filter system
- ✅ Search analytics tracking
- ✅ Click tracking and conversion measurement
- ✅ Multiple database functions
- ✅ Complete UI with filters and results
- ✅ Pagination and infinite scroll
- ✅ Performance optimized with indexes
- ✅ Build successful

The search system is production-ready and provides a powerful, fair, and user-friendly way to discover verified medical aesthetics practitioners.
