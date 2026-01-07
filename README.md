# Just Gorge - Healthcare Marketplace Platform

A comprehensive healthcare marketplace connecting patients with verified aesthetic medicine practitioners. Built with React, TypeScript, and Supabase.

## Overview

Just Gorge is a trust-focused platform that enables patients to discover, evaluate, and connect with verified aesthetic medicine practitioners. The platform emphasizes safety, transparency, and quality through comprehensive verification systems, trust scoring, and robust content moderation.

## Key Features

### For Patients
- 🔍 **Advanced Search** - Find practitioners by specialty, location, and credentials
- ✅ **Verified Practitioners** - Only credentialed professionals with verified licenses
- 💬 **Direct Messaging** - Communicate securely with practitioners
- 📋 **Consult Requests** - Submit consultation requests directly
- 🏆 **Trust Badges** - Visual indicators of practitioner quality and reliability
- ⭐ **Trust Scores** - Data-driven ratings based on engagement and outcomes

### For Practitioners
- 👤 **Professional Profiles** - Showcase credentials, experience, and expertise
- 📜 **Credential Verification** - Submit licenses and certifications for verification
- 💼 **Patient Leads** - Receive consultation requests from interested patients
- 💬 **Patient Communication** - Message directly with prospective patients
- 📈 **Trust Building** - Build trust score through positive patient interactions
- 🎯 **Specialization** - Highlight specific treatments and procedures

### For Administrators
- ✅ **Verification Queue** - Review and approve practitioner credentials
- 🛡️ **Content Moderation** - Review and resolve user reports
- 🏆 **Badge Management** - Award and revoke trust badges
- 📊 **Platform Analytics** - Real-time metrics and insights
- 🔔 **Admin Notifications** - Priority alerts for important events
- 📝 **Audit Logs** - Complete history of all administrative actions

## Technology Stack

### Frontend
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tooling
- **React Router** - Navigation
- **Tailwind CSS** - Styling
- **Lucide React** - Icons

### Backend
- **Supabase** - PostgreSQL database
- **Supabase Auth** - Authentication
- **Row Level Security** - Authorization
- **Edge Functions** - Serverless compute
- **Real-time** - WebSocket subscriptions

## Quick Start

### Prerequisites
- Node.js 18.x or higher
- npm 9.x or higher
- Supabase account

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd just-gorge
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment:**
   ```bash
   cp .env.example .env
   # Edit .env with your Supabase credentials
   ```

4. **Start development server:**
   ```bash
   npm run dev
   ```

5. **Open your browser:**
   ```
   http://localhost:5173
   ```

### Environment Variables

Create a `.env` file with:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Get these from your [Supabase Dashboard](https://app.supabase.com) → Settings → API

## Database Setup

### Apply Migrations

Apply migrations in order from `/supabase/migrations/`:

1. `20260107165635_create_core_schema.sql`
2. `20260107171953_enhance_verification_system.sql`
3. `20260107172649_trust_engine_badge_computation.sql`
4. `20260107183518_add_messaging_rate_limiting.sql`
5. `20260107184745_enhance_search_system.sql`
6. `20260107190108_create_admin_tools.sql`

Copy each file's contents into Supabase Dashboard → SQL Editor and execute.

## Project Structure

```
/src
  /components      # Reusable UI components
  /pages          # Route pages
  /sections       # Page sections
  /contexts       # React contexts (Auth)
  /hooks          # Custom hooks
  /services       # API service layers
  /lib            # Utilities and config
  /utils          # Helper functions
/supabase
  /migrations     # Database migrations
  /functions      # Edge functions
```

## Key Components

### Authentication
- `AuthContext.tsx` - Authentication state management
- `ProtectedRoute.tsx` - Route protection based on roles
- Sign up/sign in flows for patients and practitioners

### User Features
- `SearchPage.tsx` - Practitioner search and discovery
- `ProviderProfilePage.tsx` - Detailed practitioner profiles
- `MessagingPageNew.tsx` - Real-time messaging interface
- `PatientDashboardPage.tsx` - Patient management dashboard
- `ProviderDashboardPage.tsx` - Practitioner management dashboard

### Admin Tools
- `VerificationQueue.tsx` - Credential verification workflow
- `ContentModeration.tsx` - Content moderation system
- `BadgeAuditView.tsx` - Badge management and audit trail
- `PlatformAnalytics.tsx` - Real-time platform metrics
- `AdminNotifications.tsx` - Admin notification system

## Development

### Available Scripts

```bash
# Development server
npm run dev

# Production build
npm run build

# Preview production build
npm run preview
```

### Code Quality

- TypeScript for type safety
- ESLint for code linting
- Consistent naming conventions
- Component-based architecture
- Service layer separation

## Testing

### Manual Testing Checklist

- [ ] Patient registration and login
- [ ] Practitioner registration and login
- [ ] Admin login
- [ ] Search functionality
- [ ] Messaging system
- [ ] Consult requests
- [ ] Verification queue
- [ ] Content moderation
- [ ] Badge management
- [ ] Platform analytics

## Deployment

### Production Build

```bash
npm run build
```

Output will be in `dist/` directory.

### Hosting Options

**Recommended:**
- Vercel
- Netlify
- Cloudflare Pages

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

## Security

### Built-in Security Features

- **Row Level Security (RLS)** - Database-level access control
- **Authentication** - Supabase Auth with JWT tokens
- **Authorization** - Role-based access (patient, practitioner, admin)
- **Input Validation** - React's built-in XSS protection
- **SQL Injection Prevention** - Parameterized queries
- **Error Boundaries** - Graceful error handling
- **HTTPS** - Encrypted communication

See [SECURITY.md](./SECURITY.md) for comprehensive security documentation.

## Documentation

### Available Documentation

- **[ENVIRONMENT_SETUP.md](./ENVIRONMENT_SETUP.md)** - Setup and configuration guide
- **[PLATFORM_DOCUMENTATION.md](./PLATFORM_DOCUMENTATION.md)** - Complete platform documentation
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Deployment procedures
- **[SECURITY.md](./SECURITY.md)** - Security best practices

### Sprint Documentation

Detailed implementation documentation for each development sprint:

- **[PLATFORM_PLAN.md](./PLATFORM_PLAN.md)** - Overall platform plan
- **[IMPLEMENTATION_STATUS.md](./IMPLEMENTATION_STATUS.md)** - Implementation tracking
- **[SPRINT5_MESSAGING.md](./SPRINT5_MESSAGING.md)** - Messaging system
- **[SPRINT6_SEARCH.md](./SPRINT6_SEARCH.md)** - Search and discovery
- **[SPRINT7_ADMIN_TOOLS.md](./SPRINT7_ADMIN_TOOLS.md)** - Admin tooling
- **[SPRINT8_INTEGRATION_TESTING.md](./SPRINT8_INTEGRATION_TESTING.md)** - Testing and integration

## Database Schema

### Core Tables

- **profiles** - User accounts (all roles)
- **practitioners** - Practitioner-specific data
- **practitioner_licenses** - Professional licenses
- **specialties** - Treatment specialties
- **practitioner_specialties** - Practitioner-specialty relationships
- **trust_events** - Trust score calculation events
- **trust_badges** - Earned trust badges
- **messages** - Direct messaging
- **consult_requests** - Initial consultation requests
- **verification_queue** - Practitioner verification workflow

### Admin Tables

- **content_reports** - User-submitted reports
- **platform_analytics** - Aggregated metrics
- **admin_notifications** - Admin alert system
- **badge_audit_log** - Badge change history
- **verification_audit_log** - Verification history

## User Roles

### Patient
- Browse and search practitioners
- View practitioner profiles
- Send consult requests
- Direct messaging
- Save favorites

### Practitioner
- Professional profile management
- Credential submission
- Receive consult requests
- Patient messaging
- Trust score building

### Admin
- Verification review
- Content moderation
- Badge management
- Platform analytics
- System notifications

## Trust & Safety

### Verification Process
1. Practitioner submits credentials
2. Admin reviews documentation
3. License verification
4. Status update (verified/rejected/needs_review)
5. Badge awarded if approved

### Trust Score System
- Real-time computation
- Weighted event scoring
- Based on patient engagement
- Displayed on profiles
- Influences search ranking

### Content Moderation
- User report submission
- Priority-based review
- Action tracking
- Resolution workflows
- Audit logging

## Support

### Getting Help

1. Check documentation files
2. Review Supabase logs
3. Check browser console
4. Review network requests
5. Contact development team

### Common Issues

See [ENVIRONMENT_SETUP.md](./ENVIRONMENT_SETUP.md#troubleshooting) for common issues and solutions.

## Contributing

### Development Workflow

1. Create feature branch
2. Make changes
3. Test locally
4. Build for production
5. Submit for review

### Code Standards

- Use TypeScript
- Follow existing patterns
- Add proper error handling
- Write clear comments
- Test thoroughly

## License

[Add your license here]

## Acknowledgments

Built with:
- React
- TypeScript
- Supabase
- Vite
- Tailwind CSS
- Lucide React

## Contact

[Add contact information here]

---

**Status:** Production Ready ✅

**Version:** 1.0.0

**Last Updated:** January 2026
