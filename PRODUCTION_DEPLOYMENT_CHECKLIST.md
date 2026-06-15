# Production Deployment Checklist for Chatify

## Environment Configuration
- [ ] Set `NODE_ENV=production` in backend/.env
- [ ] Use strong, unique values for all secrets:
  - `JWT_SECRET` (minimum 32 characters)
  - `JWT_REFRESH_SECRET` (minimum 32 characters, different from JWT_SECRET)
  - `RESEND_API_KEY`
  - `CLOUDINARY_API_KEY` and `CLOUDINARY_API_SECRET`
  - `ARCJET_KEY`
  - `MONGO_URI` (with proper authentication)
- [ ] Set appropriate `CLIENT_URL` to your production frontend URL (not localhost)
- [ ] Never commit .env file to version control (verified .gitignore includes it)
- [ ] Use .env.example as template for environment setup

## Security Configurations
- [ ] Password policy: Minimum length set to 8 characters
- [ ] Password hashing: Bcrypt salt rounds set to 12
- [ ] Authentication:
  - Access token expiry: 15 minutes
  - Refresh token expiry: 7 days with rotation
  - HttpOnly, Secure, SameSite flags set on cookies
  - Refresh token endpoint implemented with rotation
- [ ] Rate limiting:
  - General API rate limiting via Arcjet (100 requests/minute)
  - Specific auth endpoint rate limiting (5 requests/15 minutes)
- [ ] Bot protection: Arcjet set to LIVE mode in production
- [ ] Security headers implemented:
  - X-Content-Type-Options: nosniff
  - X-Frame-Options: DENY
  - X-XSS-Protection: 1; mode=block
  - Referrer-Policy: strict-origin-when-cross-origin
  - Strict-Transport-Security: max-age=31536000; includeSubDomains; preload (production only)
  - Content-Security-Policy: appropriately configured
- [ ] CORS configuration:
  - Only allows necessary origins in production
  - Development origins (localhost) excluded in production
  - Credentials properly handled

## Dependencies & Build
- [ ] All dependencies updated to latest secure versions
- [ ] Frontend built for production: `cd frontend && npm run build`
- [ ] Production build files placed in frontend/dist/
- [ ] Backend serves static frontend files in production mode
- [ ] No development dependencies deployed to production

## Database
- [ ] MongoDB connection string uses proper authentication
- [ ] Consider adding indexes for performance:
  - User.email (unique)
  - Message.senderId and Message.receiverId
  - Message.createdAt for sorting
- [ ] Backup strategy configured for MongoDB
- [ ] Connection limits and timeouts configured appropriately

## Monitoring & Logging
- [ ] Error logging implemented (errors logged server-side, generic messages to client)
- [ ] Consider setting up application monitoring (e.g., Sentry, LogRocket)
- [ ] Ensure Arcjet logging is properly configured for security events
- [ ] Monitor authentication success/failure rates
- [ ] Set up alerts for unusual activity patterns

## Performance
- [ ] Image uploads validated for type and size before Cloudinary processing
- [ ] Static asset caching configured (if using CDN)
- [ ] Database query performance monitored
- [ ] Consider implementing pagination for large message lists
- [ ] Memory usage monitored (especially for socket.io connections)

## Testing Before Deployment
- [ ] All environment variables tested in production-like setting
- [ ] Authentication flow tested (login, logout, refresh)
- [ ] Protected routes verified to require authentication
- [ ] Rate limiting tested on auth endpoints
- [ ] File upload functionality tested
- [ ] Real-time messaging tested with multiple clients
- [ ] Email verification (welcome emails) tested
- [ ] Error scenarios tested (invalid credentials, missing fields, etc.)

## Deployment Process
- [ ] Backup current deployment before updating
- [ ] Deploy backend changes first
- [ ] Migrate database if schema changes (none in current updates)
- [ ] Deploy frontend build
- [ ] Verify health checks pass
- [ ] Monitor application logs for errors post-deployment
- [ ] Test critical user flows after deployment

## Documentation
- [ ] Ensure README.MD is updated with production deployment instructions
- [ ] Security considerations documented
- [ ] Environment variable requirements clearly specified
- [ ] Contacts for emergency situations documented

## Post-Deployment Verification
- [ ] Verify application loads correctly via HTTPS
- [ ] Test user registration and login flows
- [ ] Test real-time messaging functionality
- [ ] Verify security headers are present in responses
- [ ] Check that error messages don't leak sensitive information
- [ ] Confirm .env file is not accessible via web requests
- [ ] Monitor logs for any security warnings from Arcjet

## Maintenance
- [ ] Regular security updates for dependencies
- [ ] Periodic review of access logs and security events
- [ ] Backup verification schedule established
- [ ] Incident response plan documented and tested