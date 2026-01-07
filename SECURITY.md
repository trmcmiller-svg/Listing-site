# Security Best Practices

## Overview

This document outlines security best practices, potential vulnerabilities, and mitigation strategies for the Just Gorge platform. Security is paramount when handling sensitive healthcare and personal data.

## Security Principles

### 1. Defense in Depth
Multiple layers of security controls to protect data and systems.

### 2. Least Privilege
Users and systems have minimum permissions necessary.

### 3. Secure by Default
Security features enabled and enforced by default.

### 4. Zero Trust
Never trust, always verify. Authenticate and authorize every request.

## Authentication & Authorization

### Authentication Security

**Current Implementation:**
- Supabase Auth with email/password
- JWT-based session management
- Secure cookie storage
- Automatic token refresh

**Best Practices:**

1. **Strong Password Requirements:**
   ```typescript
   // Enforce in signup flows
   const passwordRequirements = {
     minLength: 12,
     requireUppercase: true,
     requireLowercase: true,
     requireNumbers: true,
     requireSpecial: true
   };
   ```

2. **Session Management:**
   - Sessions expire after inactivity
   - Automatic logout on token expiration
   - Secure session storage
   - No session data in localStorage for sensitive info

3. **Multi-Factor Authentication (Future):**
   - Consider implementing 2FA for admins
   - SMS or authenticator app support
   - Backup codes for recovery

### Authorization Security (RLS)

**Row Level Security Policies:**

All tables MUST have RLS enabled:
```sql
ALTER TABLE table_name ENABLE ROW LEVEL SECURITY;
```

**Policy Examples:**

1. **User can only read own data:**
   ```sql
   CREATE POLICY "Users can read own profile"
     ON profiles FOR SELECT
     TO authenticated
     USING (auth.uid() = id);
   ```

2. **Admin-only access:**
   ```sql
   CREATE POLICY "Admins can view all data"
     ON sensitive_table FOR SELECT
     TO authenticated
     USING (
       EXISTS (
         SELECT 1 FROM profiles
         WHERE profiles.id = auth.uid()
         AND profiles.role = 'admin'
       )
     );
   ```

3. **Ownership-based access:**
   ```sql
   CREATE POLICY "Users can update own records"
     ON user_table FOR UPDATE
     TO authenticated
     USING (user_id = auth.uid())
     WITH CHECK (user_id = auth.uid());
   ```

**RLS Best Practices:**
- ✅ Enable RLS on ALL tables
- ✅ Test policies thoroughly
- ✅ Use RESTRICTIVE policies for sensitive data
- ✅ Avoid USING (true) - defeats RLS purpose
- ✅ Check ownership/membership in policies
- ❌ Never disable RLS in production

## Data Protection

### Sensitive Data Handling

**PHI (Protected Health Information):**
- Medical conditions
- Treatment history
- Health records
- Prescriptions

**PII (Personally Identifiable Information):**
- Full names
- Email addresses
- Phone numbers
- Physical addresses
- Date of birth

**Professional Credentials:**
- License numbers
- DEA numbers
- NPI numbers
- Medical certifications

**Protection Measures:**

1. **Encryption at Rest:**
   - Supabase encrypts data at rest by default
   - Use pgcrypto for additional column-level encryption if needed

2. **Encryption in Transit:**
   - All communications over HTTPS/TLS
   - WSS for WebSocket connections
   - No unencrypted API calls

3. **Data Minimization:**
   - Collect only necessary data
   - Purge old data regularly
   - Anonymize analytics data

4. **Access Logging:**
   ```sql
   -- Log sensitive data access
   CREATE TABLE access_logs (
     id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
     user_id uuid NOT NULL,
     resource_type text NOT NULL,
     resource_id uuid NOT NULL,
     action text NOT NULL,
     ip_address inet,
     created_at timestamptz DEFAULT now()
   );
   ```

### Patient Privacy

**Trust Event Anonymization:**
```sql
-- Patient IDs are hashed in trust_events
patient_id_hash: SHA256(patient_id + salt)
```

**Benefits:**
- Tracks engagement without exposing patient identity
- Enables trust score calculation
- Maintains patient privacy
- Prevents patient identification

## Input Validation

### SQL Injection Prevention

**Supabase Client Protection:**
- Parameterized queries by default
- No raw SQL from user input
- RLS prevents unauthorized access

**Example - SAFE:**
```typescript
// ✅ Safe - parameterized
const { data } = await supabase
  .from('practitioners')
  .select('*')
  .eq('legal_name', userInput);
```

**Example - UNSAFE:**
```typescript
// ❌ Unsafe - never do this
const { data } = await supabase.rpc('raw_sql', {
  query: `SELECT * FROM practitioners WHERE name = '${userInput}'`
});
```

### XSS Prevention

**React Built-in Protection:**
- React escapes values by default
- JSX prevents injection attacks

**Additional Protections:**

1. **Sanitize User Content:**
   ```typescript
   import DOMPurify from 'dompurify';

   const sanitized = DOMPurify.sanitize(userInput);
   ```

2. **Content Security Policy:**
   ```html
   <meta http-equiv="Content-Security-Policy"
         content="default-src 'self';
                  script-src 'self';
                  style-src 'self' 'unsafe-inline';">
   ```

3. **Avoid dangerouslySetInnerHTML:**
   ```typescript
   // ❌ Dangerous
   <div dangerouslySetInnerHTML={{__html: userInput}} />

   // ✅ Safe
   <div>{userInput}</div>
   ```

### CSRF Protection

**Supabase Protection:**
- JWT tokens prevent CSRF
- SameSite cookie attributes
- Origin checking on API

**Additional Measures:**
- Verify origin headers
- Use CSRF tokens for sensitive operations
- Implement double-submit cookies

## API Security

### Rate Limiting

**Implementation:**
```sql
-- Message rate limiting function
CREATE OR REPLACE FUNCTION check_message_rate_limit(
  p_sender_id uuid
)
RETURNS boolean AS $$
DECLARE
  v_count integer;
BEGIN
  SELECT COUNT(*) INTO v_count
  FROM messages
  WHERE sender_id = p_sender_id
  AND created_at > now() - interval '1 minute';

  RETURN v_count < 10; -- Max 10 messages per minute
END;
$$ LANGUAGE plpgsql;
```

**Rate Limit Guidelines:**
- Authentication: 5 attempts per 15 minutes
- API requests: 100 per minute per user
- Messages: 10 per minute
- Search: 30 per minute
- File uploads: 5 per hour

### API Key Security

**Environment Variables:**
```env
# ✅ Correct - prefixed with VITE_
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...

# ❌ Never include service role key
# SUPABASE_SERVICE_ROLE_KEY=... (backend only!)
```

**Key Management:**
- Never commit keys to Git
- Rotate keys regularly
- Use different keys per environment
- Service role key only in Edge Functions
- Anon key safe for frontend (RLS protects)

## File Upload Security

**If implementing file uploads:**

1. **Validate File Types:**
   ```typescript
   const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'application/pdf'];

   if (!ALLOWED_TYPES.includes(file.type)) {
     throw new Error('Invalid file type');
   }
   ```

2. **Limit File Sizes:**
   ```typescript
   const MAX_SIZE = 10 * 1024 * 1024; // 10MB

   if (file.size > MAX_SIZE) {
     throw new Error('File too large');
   }
   ```

3. **Scan for Malware:**
   - Use antivirus scanning service
   - Quarantine suspicious files
   - Never execute uploaded files

4. **Secure Storage:**
   - Store in Supabase Storage
   - Use RLS policies
   - Generate signed URLs for access
   - Set expiration on URLs

## Edge Function Security

**Secure Edge Function:**
```typescript
import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

Deno.serve(async (req: Request) => {
  // Handle OPTIONS
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    // Verify authentication
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response('Unauthorized', { status: 401 });
    }

    // Use service role key securely
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    // Validate JWT
    const { data: { user }, error } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (error || !user) {
      return new Response('Unauthorized', { status: 401 });
    }

    // Process request...

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
});
```

**Edge Function Best Practices:**
- Always validate authentication
- Use service role key only when necessary
- Implement proper error handling
- Log security events
- Set CORS headers correctly
- Never expose secrets in responses

## Audit Logging

### What to Log

**Security Events:**
- Authentication attempts (success/failure)
- Authorization failures
- Data access (sensitive tables)
- Configuration changes
- Admin actions

**Example:**
```typescript
async function logSecurityEvent(
  userId: string,
  eventType: string,
  details: Record<string, any>
) {
  await supabase.from('security_logs').insert({
    user_id: userId,
    event_type: eventType,
    details,
    ip_address: req.headers.get('x-forwarded-for'),
    user_agent: req.headers.get('user-agent'),
  });
}
```

### Log Retention

- Security logs: 1 year minimum
- Access logs: 90 days
- Audit logs: 7 years (compliance)
- Error logs: 30 days

## Vulnerability Management

### Dependency Security

1. **Regular Updates:**
   ```bash
   # Check for vulnerabilities
   npm audit

   # Fix vulnerabilities
   npm audit fix

   # Update dependencies
   npm update
   ```

2. **Automated Scanning:**
   - Enable Dependabot
   - Use Snyk or similar
   - Review security advisories

3. **Lock File Management:**
   - Commit package-lock.json
   - Review changes in PRs
   - Test after updates

### Security Testing

**Pre-Deployment:**
1. Run automated security scans
2. Test authentication flows
3. Verify RLS policies
4. Check for exposed secrets
5. Test input validation

**Regular Audits:**
- Quarterly security reviews
- Penetration testing
- Code reviews
- Dependency audits

## Incident Response

### Security Incident Plan

1. **Detection:**
   - Monitor logs for anomalies
   - Set up alerts for suspicious activity
   - User reports

2. **Containment:**
   - Isolate affected systems
   - Revoke compromised credentials
   - Block malicious IPs

3. **Investigation:**
   - Analyze logs
   - Determine scope
   - Identify root cause

4. **Recovery:**
   - Patch vulnerabilities
   - Restore from backups if needed
   - Reset compromised credentials

5. **Post-Incident:**
   - Document findings
   - Update security measures
   - Notify affected users (if required)

### Emergency Contacts

Maintain list of:
- Security team
- Database administrators
- Hosting platform support
- Legal counsel
- PR/Communications team

## Compliance

### HIPAA Compliance (if applicable)

**Requirements:**
- Encrypted data at rest and in transit
- Access controls (RLS)
- Audit logging
- User authentication
- Business Associate Agreements (BAA)

**Note:** Supabase offers HIPAA-compliant hosting on enterprise plans.

### GDPR Compliance

**Requirements:**
- User consent for data collection
- Right to access data
- Right to deletion
- Data portability
- Privacy policy

**Implementation:**
```typescript
// Data deletion
async function deleteUserData(userId: string) {
  // Delete in order (foreign keys)
  await supabase.from('messages').delete().eq('sender_id', userId);
  await supabase.from('trust_events').delete().eq('patient_id_hash', hash(userId));
  await supabase.from('practitioners').delete().eq('user_id', userId);
  await supabase.from('profiles').delete().eq('id', userId);
  await supabase.auth.admin.deleteUser(userId);
}
```

## Security Checklist

### Development
- [ ] Use environment variables for secrets
- [ ] Never commit sensitive data
- [ ] Use HTTPS in development
- [ ] Validate all user input
- [ ] Use parameterized queries

### Pre-Deployment
- [ ] RLS enabled on all tables
- [ ] Test authentication flows
- [ ] Run security audit
- [ ] Check for exposed secrets
- [ ] Update dependencies
- [ ] Configure CORS correctly

### Production
- [ ] HTTPS enforced
- [ ] Rate limiting enabled
- [ ] Monitoring configured
- [ ] Backups automated
- [ ] Logging enabled
- [ ] Security headers set

## Resources

- **OWASP Top 10:** https://owasp.org/www-project-top-ten/
- **Supabase Security:** https://supabase.com/docs/guides/auth/row-level-security
- **HIPAA Guidelines:** https://www.hhs.gov/hipaa
- **GDPR Requirements:** https://gdpr.eu

## Reporting Security Issues

If you discover a security vulnerability:

1. **DO NOT** open a public GitHub issue
2. Email security@justgorge.com (if configured)
3. Include detailed description
4. Provide steps to reproduce
5. Allow time for fix before disclosure

## Conclusion

Security is an ongoing process, not a one-time implementation. Regular audits, updates, and monitoring are essential to maintaining a secure platform.

Stay informed about security best practices and emerging threats. Always prioritize user data protection and privacy.
