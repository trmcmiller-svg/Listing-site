# Just Gorge Platform Documentation

## Table of Contents

1. [Platform Overview](#platform-overview)
2. [Architecture](#architecture)
3. [User Roles](#user-roles)
4. [Core Features](#core-features)
5. [Database Schema](#database-schema)
6. [API & Services](#api--services)
7. [Authentication & Authorization](#authentication--authorization)
8. [Trust & Safety](#trust--safety)
9. [Admin Tools](#admin-tools)
10. [Frontend Components](#frontend-components)

## Platform Overview

Just Gorge is a healthcare marketplace connecting patients with verified aesthetic medicine practitioners. The platform emphasizes trust, safety, and quality through comprehensive verification, trust scoring, and content moderation.

### Key Value Propositions

**For Patients:**
- Find verified, trustworthy aesthetic practitioners
- Direct messaging with providers
- Transparent practitioner profiles with credentials
- Trust badges for quality assurance

**For Practitioners:**
- Professional profile and credentialing
- Patient lead generation
- Direct patient communication
- Trust score building

**For Admins:**
- Comprehensive moderation tools
- Badge and verification management
- Platform analytics
- Real-time notifications

## Architecture

### Technology Stack

**Frontend:**
- React 18 with TypeScript
- React Router for navigation
- Tailwind CSS for styling
- Lucide React for icons
- Vite for build tooling

**Backend:**
- Supabase (PostgreSQL database)
- Supabase Auth for authentication
- Row Level Security (RLS) for data protection
- Supabase Edge Functions for serverless compute

**Infrastructure:**
- Supabase Cloud for database and auth
- Edge Functions for compute
- Real-time subscriptions for messaging

### Project Structure

```
/src
  /components         # Reusable UI components
  /pages             # Route pages
  /sections          # Page sections
  /contexts          # React contexts (Auth)
  /hooks             # Custom React hooks
  /services          # API service layers
  /lib               # Utilities and configurations
  /utils             # Helper functions
/supabase
  /migrations        # Database migrations
  /functions         # Edge functions
```

## User Roles

### 1. Patient
- Browse and search practitioners
- View practitioner profiles
- Send consult requests
- Direct messaging with practitioners
- Save favorite practitioners

### 2. Practitioner
- Create and manage professional profile
- Submit credentials for verification
- Receive and respond to consult requests
- Message with patients
- Build trust score through engagement

### 3. Admin
- Review verification submissions
- Moderate content and reports
- Manage badges and trust scores
- View platform analytics
- Receive priority notifications

## Core Features

### 1. User Management

**Registration & Authentication:**
- Email/password authentication
- Separate flows for patients and practitioners
- Profile creation and management
- Role-based access control

**Profiles:**
- Patient profiles (basic information)
- Practitioner profiles (detailed credentials)
- Avatar and photo management
- Specialty and service offerings

### 2. Practitioner Verification

**Verification Queue:**
- Practitioners submit credentials
- Admins review documentation
- License verification
- Status tracking (pending, verified, rejected, needs_review)
- Audit trail of all changes

**Required Information:**
- Legal name and professional title
- Practitioner type (MD, DO, NP, PA, RN, etc.)
- Years of experience
- Education history
- Professional licenses (with documents)

### 3. Trust Engine

**Trust Score Calculation:**
- Based on platform engagement
- Weighted trust events
- Continuous computation
- Displayed on practitioner profiles

**Trust Events:**
- Profile views
- Consult requests
- Messages exchanged
- Follow-ups completed
- Patient retention

**Trust Badges:**
- Verified Identity
- Verified Practice
- Continuity of Care
- Established Practitioner
- Automated computation
- Manual override capability

### 4. Search & Discovery

**Advanced Search:**
- Full-text search across practitioners
- Filter by specialty, type, location
- Sort by trust score, experience, availability
- Real-time results

**Search Features:**
- Autocomplete suggestions
- Recently searched tracking
- Popular searches
- Search result cards with key info

### 5. Messaging System

**Direct Messaging:**
- Real-time WebSocket connections
- Thread-based conversations
- Message status (sent, delivered, read)
- Typing indicators
- Unread counts

**Message Features:**
- Consult request initiation
- Rate limiting for spam prevention
- Message search within threads
- Thread archiving

### 6. Consult Requests

**Request Flow:**
- Patient initiates consultation request
- Practitioner receives notification
- Practitioner can accept/decline
- Converts to message thread if accepted

**Request Information:**
- Treatment interest
- Patient message and notes
- Practitioner response
- Status tracking

### 7. Admin Tools

**Content Moderation:**
- User report submission
- Priority-based review queue
- Action tracking
- Resolution workflows

**Badge Audit:**
- Complete badge change history
- Manual badge award/revoke
- Automated vs manual tracking
- Reason logging

**Platform Analytics:**
- Real-time metrics dashboard
- User growth tracking
- Engagement statistics
- Conversion rates

**Admin Notifications:**
- Real-time alert system
- Priority levels (low, medium, high, urgent)
- Deep linking to relevant content
- Notification bell with unread count

## Database Schema

### Core Tables

#### profiles
User account information
- Role-based access (patient, practitioner, admin)
- Basic user info

#### practitioners
Practitioner-specific data
- Professional credentials
- Verification status
- Trust score
- Search indexing

#### practitioner_licenses
Professional licenses
- License number and type
- Issuing state
- Expiration tracking
- Document storage

#### specialties
Treatment specialties
- Category grouping
- Active/inactive status

#### trust_events
Trust score calculation data
- Event type and weight
- Patient ID hashing for privacy
- Metadata storage

#### trust_badges
Earned trust badges
- Badge type
- Active/revoked status
- Computation metadata

#### messages
Direct messaging
- Thread-based organization
- Read/unread tracking
- Metadata support

#### consult_requests
Initial consultations
- Treatment interest
- Status workflow
- Response handling

### Admin Tables

#### content_reports
User-submitted reports
- Report type and reason
- Status workflow
- Admin notes and actions

#### platform_analytics
Aggregated metrics
- Date-based tracking
- Metric types
- Incremental updates

#### admin_notifications
Admin alert system
- Priority levels
- Read/unread status
- Deep linking

#### badge_audit_log
Badge change history
- Complete audit trail
- Before/after states
- Automated vs manual

#### verification_audit_log
Verification status changes
- Admin tracking
- Document review notes
- Status transitions

## API & Services

### Auth Service (`AuthContext`)
- User authentication
- Session management
- Profile loading
- Sign up/sign in/sign out

### Search Service (`searchService.ts`)
- Practitioner search
- Filter application
- Result sorting
- Popular searches

### Messaging Service (`messagingService.ts`)
- Thread management
- Message sending/receiving
- Read receipts
- Typing indicators

### Admin Service (`adminService.ts`)
- Content report management
- Platform metrics
- Badge auditing
- Notification management

### Consult Service (`consultRequestService.ts`)
- Request submission
- Status updates
- Practitioner responses

## Authentication & Authorization

### Authentication Flow

1. User signs up with email/password
2. Supabase creates auth user
3. Profile created in profiles table
4. Role assigned (patient/practitioner/admin)
5. Additional tables populated based on role

### Authorization (RLS)

All tables use Row Level Security:

**Patients can:**
- Read own profile
- Read public practitioner data
- Send messages and consult requests

**Practitioners can:**
- Read own profile and practitioner data
- Update own practitioner profile
- Read and send messages
- Accept/decline consult requests

**Admins can:**
- Read all data
- Update verification statuses
- Manage badges
- Moderate content

### Protected Routes

Routes protected by role:
- `/patient-dashboard` - Patients only
- `/provider-dashboard` - Practitioners only
- `/admin-dashboard` - Admins only
- `/messages` - Authenticated users

## Trust & Safety

### Verification Process

1. Practitioner submits credentials
2. Admin reviews in verification queue
3. License documents checked
4. Status updated (verified/rejected/needs_review)
5. Practitioner notified
6. Verification badge awarded if approved

### Trust Score System

**Calculation:**
- Real-time computation via database functions
- Weighted event scoring
- Decay over time for inactivity
- Displayed as numeric score (0-100)

**Trust Events:**
- Profile view: +1 point
- Consult request: +5 points
- Consult completed: +10 points
- Message thread active: +3 points

### Content Moderation

**Report Types:**
- Spam
- Inappropriate content
- Harassment
- Fraud/fake credentials
- Other

**Moderation Workflow:**
1. User submits report
2. Admin notified (priority-based)
3. Admin reviews report
4. Admin takes action
5. Report resolved/dismissed
6. Action tracked in audit log

## Admin Tools

### Verification Queue
- Pending applications list
- Search and filter capabilities
- Detailed credential review
- Approve/reject/needs review actions
- Audit logging

### Content Moderation
- Report queue
- Priority-based sorting
- Detailed report view
- Action tracking
- Resolution workflows

### Badge Audit
- Complete badge history
- Search by practitioner
- Filter by action type
- Manual badge management
- Automated tracking

### Platform Analytics
- User metrics
- Growth statistics
- Engagement tracking
- Visual dashboards

### Admin Notifications
- Real-time alerts
- Priority levels
- Deep linking
- Notification bell
- Auto-refresh

## Frontend Components

### Layout Components

**Header/Navigation:**
- Logo and branding
- Navigation links
- Search bar
- User menu
- Sign in/up buttons

**Footer:**
- Company info
- Quick links
- Social media
- Copyright

### Auth Components

**SignIn/SignUp:**
- Email/password forms
- Role selection
- Error handling
- Loading states

**ProtectedRoute:**
- Auth checking
- Role verification
- Redirect logic

### User Components

**PatientDashboard:**
- Saved practitioners
- Recent searches
- Message threads
- Consult requests

**ProviderDashboard:**
- Profile management
- Verification status
- Incoming consult requests
- Trust score display

### Messaging Components

**ThreadList:**
- Conversation list
- Unread counts
- Last message preview
- Timestamps

**MessageThread:**
- Message display
- Send message form
- Typing indicators
- Read receipts

### Search Components

**SearchFilters:**
- Specialty selection
- Type filters
- Sort options
- Clear filters

**SearchResultCard:**
- Practitioner info
- Trust badges
- Quick actions
- Profile link

### Admin Components

**VerificationQueue:**
- Applicant list
- Search/filter
- Detail view
- Action buttons

**ContentModeration:**
- Report list
- Priority indicators
- Detail view
- Action workflows

**BadgeAuditView:**
- Audit history
- Search/filter
- Manual actions

**PlatformAnalytics:**
- Metric cards
- Visual indicators
- Real-time data

**AdminNotifications:**
- Notification feed
- Bell with count
- Priority display
- Deep links

## Best Practices

### Component Development
- Keep components focused and small
- Use TypeScript for type safety
- Extract reusable logic to hooks
- Handle loading and error states
- Use ErrorBoundary for error handling

### Database Access
- Always use RLS policies
- Limit query results
- Use proper indexes
- Avoid N+1 queries
- Use select with specific columns

### Security
- Never expose sensitive data
- Validate all user input
- Use proper CORS headers
- Implement rate limiting
- Log security events

### Performance
- Lazy load heavy components
- Optimize images
- Use proper caching
- Minimize bundle size
- Use database indexes

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

## Security

See [SECURITY.md](./SECURITY.md) for security best practices and guidelines.

## Support

For technical support or questions:
- Review this documentation
- Check migration files for database schema
- Review component source code
- Check Supabase logs for errors
