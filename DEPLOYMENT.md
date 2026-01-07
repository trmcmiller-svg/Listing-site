# Deployment Guide

## Overview

This guide covers deploying the Just Gorge platform to production environments. The platform consists of a React frontend and Supabase backend.

## Prerequisites

Before deployment, ensure you have:

- Production Supabase project
- Hosting platform account (Vercel, Netlify, or similar)
- Domain name (optional)
- SSL certificate (usually automatic with hosting platforms)

## Pre-Deployment Checklist

### 1. Code Review
- [ ] All features tested locally
- [ ] No console errors or warnings
- [ ] TypeScript compilation successful
- [ ] Production build successful
- [ ] All tests passing

### 2. Database
- [ ] All migrations applied
- [ ] RLS policies enabled on all tables
- [ ] Sample data removed (if any)
- [ ] Indexes created for performance
- [ ] Backup strategy in place

### 3. Environment Variables
- [ ] Production credentials configured
- [ ] No development keys in production
- [ ] API keys secured
- [ ] Environment-specific settings verified

### 4. Security
- [ ] CORS configured correctly
- [ ] Rate limiting enabled
- [ ] SQL injection protection verified
- [ ] XSS protection enabled
- [ ] Authentication flows tested

## Deployment Steps

### Step 1: Set Up Production Supabase Project

1. **Create Production Project:**
   - Go to [Supabase Dashboard](https://app.supabase.com)
   - Click "New Project"
   - Choose strong database password
   - Select region closest to users
   - Wait for project initialization

2. **Apply Database Migrations:**
   - Navigate to SQL Editor in Supabase Dashboard
   - Run each migration file in order:
     1. `20260107165635_create_core_schema.sql`
     2. `20260107171953_enhance_verification_system.sql`
     3. `20260107172649_trust_engine_badge_computation.sql`
     4. `20260107183518_add_messaging_rate_limiting.sql`
     5. `20260107184745_enhance_search_system.sql`
     6. `20260107190108_create_admin_tools.sql`

3. **Verify Database:**
   - Check all tables created
   - Verify RLS policies enabled
   - Test sample queries
   - Verify indexes created

4. **Deploy Edge Functions:**
   ```bash
   # Using Supabase CLI (if available)
   supabase functions deploy compute-badges
   ```

   Or use the MCP Supabase deploy tools as configured in your environment.

5. **Configure Auth Settings:**
   - Go to Authentication > Settings
   - Set Site URL to your production domain
   - Configure redirect URLs
   - Set JWT expiration
   - Enable email confirmations (optional)

### Step 2: Configure Production Environment

1. **Create Production .env:**
   ```env
   VITE_SUPABASE_URL=https://your-project-ref.supabase.co
   VITE_SUPABASE_ANON_KEY=your-production-anon-key
   VITE_API_URL=https://your-domain.com
   ```

2. **Get Production Credentials:**
   - Supabase Dashboard > Settings > API
   - Copy Project URL
   - Copy anon/public key
   - **NEVER commit these to Git**

### Step 3: Build for Production

1. **Install Dependencies:**
   ```bash
   npm ci --production=false
   ```

2. **Run Production Build:**
   ```bash
   npm run build
   ```

3. **Test Production Build Locally:**
   ```bash
   npm run preview
   ```

4. **Verify Build Output:**
   - Check dist/ directory created
   - Verify no errors in console
   - Test key user flows
   - Check bundle sizes

### Step 4: Deploy to Hosting Platform

#### Option A: Vercel

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Deploy:**
   ```bash
   vercel --prod
   ```

3. **Configure Environment Variables:**
   - Go to Vercel Dashboard > Project > Settings > Environment Variables
   - Add VITE_SUPABASE_URL
   - Add VITE_SUPABASE_ANON_KEY
   - Redeploy if needed

4. **Configure Domain:**
   - Settings > Domains
   - Add custom domain
   - Configure DNS records

#### Option B: Netlify

1. **Install Netlify CLI:**
   ```bash
   npm install -g netlify-cli
   ```

2. **Deploy:**
   ```bash
   netlify deploy --prod
   ```

3. **Configure Environment Variables:**
   - Site settings > Build & deploy > Environment
   - Add variables
   - Redeploy

4. **Configure Domain:**
   - Domain settings
   - Add custom domain
   - Configure DNS

#### Option C: Manual Deployment

1. **Build Project:**
   ```bash
   npm run build
   ```

2. **Upload dist/ folder:**
   - Upload to your web server
   - Configure web server (nginx, Apache)
   - Ensure SPA routing works

3. **Sample nginx Configuration:**
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       root /var/www/justgorge/dist;
       index index.html;

       location / {
           try_files $uri $uri/ /index.html;
       }

       location /api {
           proxy_pass https://your-project.supabase.co;
       }
   }
   ```

### Step 5: Post-Deployment Verification

1. **Functional Testing:**
   - [ ] Homepage loads correctly
   - [ ] User registration works
   - [ ] Login works
   - [ ] Patient dashboard accessible
   - [ ] Practitioner dashboard accessible
   - [ ] Admin dashboard accessible
   - [ ] Search functionality works
   - [ ] Messaging works
   - [ ] Consult requests work

2. **Security Testing:**
   - [ ] HTTPS enabled
   - [ ] Auth redirects work
   - [ ] Protected routes secured
   - [ ] RLS policies enforced
   - [ ] CORS configured correctly

3. **Performance Testing:**
   - [ ] Page load times acceptable
   - [ ] Images optimized
   - [ ] Bundle sizes reasonable
   - [ ] Database queries fast
   - [ ] No memory leaks

4. **Monitoring Setup:**
   - [ ] Error tracking configured
   - [ ] Analytics enabled
   - [ ] Uptime monitoring
   - [ ] Database monitoring

## Environment-Specific Configuration

### Development
```env
VITE_SUPABASE_URL=https://dev-project.supabase.co
VITE_SUPABASE_ANON_KEY=dev-anon-key
VITE_ENABLE_DEBUG=true
```

### Staging
```env
VITE_SUPABASE_URL=https://staging-project.supabase.co
VITE_SUPABASE_ANON_KEY=staging-anon-key
VITE_ENABLE_DEBUG=false
```

### Production
```env
VITE_SUPABASE_URL=https://prod-project.supabase.co
VITE_SUPABASE_ANON_KEY=prod-anon-key
VITE_ENABLE_DEBUG=false
```

## Rollback Procedure

If issues arise post-deployment:

1. **Immediate Rollback:**
   ```bash
   # Vercel
   vercel rollback

   # Netlify
   netlify rollback
   ```

2. **Database Rollback:**
   - Restore from backup
   - Revert migrations if needed
   - Test thoroughly before going live again

3. **Code Rollback:**
   - Revert to previous Git commit
   - Rebuild and redeploy
   - Verify functionality

## Monitoring & Maintenance

### Application Monitoring

**Recommended Tools:**
- **Sentry** for error tracking
- **LogRocket** for session replay
- **Google Analytics** for usage tracking
- **Uptime Robot** for availability monitoring

### Database Monitoring

**Supabase Dashboard:**
- Database > Performance
- Monitor query performance
- Check connection pooling
- Review slow queries

### Logs

**Access Logs:**
- Supabase Dashboard > Logs
- Edge Function logs
- Database logs
- Auth logs

### Backups

**Supabase Backups:**
- Automatic daily backups (Pro plan)
- Point-in-time recovery
- Manual backup triggers
- Download backup copies

### Performance Optimization

1. **Frontend:**
   - Enable gzip/brotli compression
   - Use CDN for static assets
   - Implement lazy loading
   - Optimize images

2. **Database:**
   - Monitor slow queries
   - Add missing indexes
   - Optimize RLS policies
   - Use connection pooling

3. **Caching:**
   - Cache static assets
   - Use browser caching
   - Implement API caching
   - Use Supabase cache headers

## Scaling Considerations

### When to Scale

Monitor these metrics:
- Response times > 3 seconds
- Database CPU > 70%
- Connection pool exhausted
- Error rate > 1%

### Scaling Options

**Supabase:**
- Upgrade to Pro/Team plan
- Increase compute resources
- Enable connection pooler
- Use read replicas

**Frontend:**
- Use CDN
- Enable edge caching
- Optimize bundle size
- Lazy load components

## Troubleshooting

### Common Deployment Issues

#### 1. Build Fails

**Symptoms:** npm run build fails

**Solutions:**
- Check TypeScript errors
- Verify all dependencies installed
- Clear node_modules and reinstall
- Check environment variables

#### 2. White Screen After Deployment

**Symptoms:** Blank page in production

**Solutions:**
- Check browser console
- Verify base URL configuration
- Check asset paths
- Verify environment variables

#### 3. Authentication Not Working

**Symptoms:** Cannot sign in/up

**Solutions:**
- Verify Supabase credentials
- Check Site URL in Supabase settings
- Verify redirect URLs
- Check CORS configuration

#### 4. Database Connection Errors

**Symptoms:** Cannot fetch data

**Solutions:**
- Verify Supabase project active
- Check RLS policies
- Verify network connectivity
- Check API credentials

#### 5. 404 on Page Refresh

**Symptoms:** Direct URLs return 404

**Solutions:**
- Configure SPA routing on server
- Add rewrite rules
- Verify index.html fallback

## Security Checklist

Before going live:

- [ ] HTTPS enabled
- [ ] Environment variables secured
- [ ] RLS enabled on all tables
- [ ] Rate limiting configured
- [ ] CORS properly configured
- [ ] Authentication flows tested
- [ ] SQL injection protection verified
- [ ] XSS protection enabled
- [ ] Sensitive data encrypted
- [ ] API keys rotated
- [ ] Security headers configured
- [ ] Content Security Policy set

## Maintenance Schedule

### Daily
- Monitor error logs
- Check uptime status
- Review critical alerts

### Weekly
- Review performance metrics
- Check database size
- Review user feedback
- Update dependencies

### Monthly
- Security audit
- Backup verification
- Performance optimization
- Dependency updates

### Quarterly
- Comprehensive security review
- Disaster recovery test
- Load testing
- Feature planning

## Support & Resources

- **Supabase Docs:** https://supabase.com/docs
- **Vite Docs:** https://vitejs.dev
- **React Docs:** https://react.dev
- **Platform Docs:** [PLATFORM_DOCUMENTATION.md](./PLATFORM_DOCUMENTATION.md)
- **Security Guide:** [SECURITY.md](./SECURITY.md)

## Emergency Contacts

Maintain an emergency contact list:
- DevOps lead
- Database administrator
- Security team
- Hosting platform support
- On-call engineer

## Conclusion

Successful deployment requires careful planning, testing, and monitoring. Always test thoroughly in staging before deploying to production, and have a rollback plan ready.

For questions or issues, refer to the platform documentation or contact the development team.
