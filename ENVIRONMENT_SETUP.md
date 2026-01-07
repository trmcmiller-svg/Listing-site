# Environment Setup Guide

## Prerequisites

Before setting up the Just Gorge platform, ensure you have:

- **Node.js** 18.x or higher
- **npm** 9.x or higher
- **Supabase Account** (for database and authentication)
- **Git** for version control

## Environment Variables

The application requires the following environment variables. Create a `.env` file in the project root:

```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Optional: Development Configuration
VITE_API_URL=http://localhost:3000
VITE_ENABLE_DEBUG=false
```

### Getting Supabase Credentials

1. Log in to [Supabase Dashboard](https://app.supabase.com)
2. Select your project or create a new one
3. Go to **Settings** > **API**
4. Copy your **Project URL** (VITE_SUPABASE_URL)
5. Copy your **anon/public key** (VITE_SUPABASE_ANON_KEY)

## Local Development Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env
# Edit .env with your Supabase credentials
```

### 3. Run Database Migrations

All migrations are located in `/supabase/migrations/`. They are applied automatically when you set up your Supabase project.

To apply migrations manually:

1. Go to Supabase Dashboard > SQL Editor
2. Copy and paste each migration file in chronological order
3. Execute the SQL

### 4. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### 5. Build for Production

```bash
npm run build
```

The production build will be in the `dist/` directory.

## Database Setup

### Initial Schema

The platform uses the following migrations (apply in order):

1. `20260107165635_create_core_schema.sql` - Core tables
2. `20260107171953_enhance_verification_system.sql` - Verification system
3. `20260107172649_trust_engine_badge_computation.sql` - Trust engine
4. `20260107183518_add_messaging_rate_limiting.sql` - Messaging
5. `20260107184745_enhance_search_system.sql` - Search
6. `20260107190108_create_admin_tools.sql` - Admin tools

### Seed Data (Optional)

For development, you may want to seed the database with test data:

```sql
-- Create admin user
INSERT INTO profiles (id, email, role, full_name)
VALUES ('admin-user-id', 'admin@justgorge.com', 'admin', 'Admin User');

-- Create test practitioner
-- See seeding scripts in /supabase/seed.sql
```

## Edge Functions

If you're using Supabase Edge Functions, they are located in `/supabase/functions/`.

### Deploy Edge Functions

Edge functions are deployed using the MCP Supabase tools. The platform includes:

- `compute-badges` - Badge computation engine

## Troubleshooting

### Common Issues

#### 1. Environment Variables Not Loading

**Problem:** Vite environment variables not accessible

**Solution:** Ensure variables are prefixed with `VITE_` and restart dev server

```bash
# Kill dev server and restart
npm run dev
```

#### 2. Database Connection Errors

**Problem:** Cannot connect to Supabase

**Solution:**
- Verify credentials in `.env`
- Check Supabase project is active
- Ensure your IP is not blocked in Supabase settings

#### 3. Migration Errors

**Problem:** Migration fails to apply

**Solution:**
- Check migration order
- Verify RLS policies don't conflict
- Ensure proper database permissions

#### 4. Build Errors

**Problem:** TypeScript or build errors

**Solution:**
```bash
# Clear cache and rebuild
rm -rf node_modules dist
npm install
npm run build
```

### Debug Mode

Enable detailed logging:

```env
VITE_ENABLE_DEBUG=true
```

This will output:
- Database query logs
- Authentication events
- API call details

## Development Workflow

### Recommended Process

1. **Create Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make Changes**
   - Update components/pages
   - Add necessary types
   - Update database if needed

3. **Test Locally**
   ```bash
   npm run dev
   ```

4. **Build for Production**
   ```bash
   npm run build
   ```

5. **Commit Changes**
   ```bash
   git add .
   git commit -m "Description of changes"
   ```

## Next Steps

- Review [PLATFORM_DOCUMENTATION.md](./PLATFORM_DOCUMENTATION.md) for architecture details
- See [DEPLOYMENT.md](./DEPLOYMENT.md) for deployment instructions
- Read [SECURITY.md](./SECURITY.md) for security best practices

## Support

For issues or questions:
- Check existing documentation
- Review Supabase logs
- Check browser console for errors
- Review network tab for failed requests
