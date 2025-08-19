# Deployment Checklist for Ectro API

This checklist ensures proper environment setup and configuration for deploying the Ectro API in different environments.

## Pre-Deployment Checklist

### 1. Environment Variables Setup

#### Required Environment Variables
- [ ] **GEMINI_API_KEY**: Valid Google Gemini AI API key
  - Development: Set in `.env.local`
  - Production: Set in deployment platform environment variables
  - Test: Set in `.env.test` (use test key)

- [ ] **NODE_ENV**: Environment mode
  - Development: `development`
  - Production: `production`
  - Test: `test`

#### Verification Commands
```bash
# Check if environment variables are set
echo "GEMINI_API_KEY: ${GEMINI_API_KEY:+SET}" 
echo "NODE_ENV: $NODE_ENV"

# Run configuration validation
npm run validate-startup
```

### 2. API Key Configuration

#### Google Gemini API Key Setup
- [ ] Create Google Cloud Project (if not exists)
- [ ] Enable Gemini AI API in Google Cloud Console
- [ ] Generate API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
- [ ] Test API key with a simple request
- [ ] Set appropriate usage quotas and billing limits

#### Security Checklist
- [ ] API key is not committed to version control
- [ ] Different API keys for development, staging, and production
- [ ] API key has appropriate permissions (Gemini AI only)
- [ ] API key usage is monitored and has rate limits

### 3. Application Configuration

#### Dependencies
- [ ] All npm dependencies are installed: `npm install`
- [ ] Node.js version matches requirements (check `.tool-versions`)
- [ ] Next.js version is compatible (15.4.5+)

#### Build Process
- [ ] Application builds successfully: `npm run build`
- [ ] No TypeScript/JavaScript errors
- [ ] All imports resolve correctly
- [ ] Build artifacts are generated in `.next` directory

### 4. Testing and Validation

#### Unit Tests
- [ ] All tests pass: `npm run test`
- [ ] Configuration validation tests pass
- [ ] Gemini API integration tests pass
- [ ] Error handling tests pass

#### Integration Tests
- [ ] API endpoint responds correctly: `npm run test -- src/test/ectro-integration.test.js`
- [ ] End-to-end request/response flow works
- [ ] Error scenarios are handled properly

#### Manual Testing
- [ ] Test API with valid request:
```bash
curl -X POST http://localhost:3000/api/ectro \
  -H "Content-Type: application/json" \
  -d '{"userPrompt":"test","targetAI":"ChatGPT","promptStyle":"Basic"}'
```
- [ ] Test API with invalid request (should return 400)
- [ ] Test API without API key (should return 500)

## Platform-Specific Deployment

### Vercel Deployment

#### Pre-deployment
- [ ] Vercel CLI installed: `npm i -g vercel`
- [ ] Project connected to Vercel: `vercel link`
- [ ] Environment variables set in Vercel dashboard

#### Environment Variables in Vercel
```bash
# Set via Vercel CLI
vercel env add GEMINI_API_KEY production
vercel env add NODE_ENV production

# Or via Vercel Dashboard:
# 1. Go to Project Settings > Environment Variables
# 2. Add GEMINI_API_KEY with your production API key
# 3. Add NODE_ENV with value "production"
```

#### Deployment Steps
- [ ] Deploy to preview: `vercel`
- [ ] Test preview deployment
- [ ] Deploy to production: `vercel --prod`
- [ ] Verify production deployment

### Netlify Deployment

#### Environment Variables in Netlify
- [ ] Go to Site Settings > Environment Variables
- [ ] Add `GEMINI_API_KEY` with production API key
- [ ] Add `NODE_ENV` with value `production`

#### Build Settings
- [ ] Build command: `npm run build`
- [ ] Publish directory: `.next`
- [ ] Node.js version: Check `.tool-versions` file

### Docker Deployment

#### Dockerfile Requirements
```dockerfile
# Environment variables
ENV NODE_ENV=production
ENV GEMINI_API_KEY=your_api_key_here

# Or use docker-compose.yml with env_file
```

#### Docker Compose
```yaml
version: '3.8'
services:
  ectro-api:
    build: .
    environment:
      - NODE_ENV=production
      - GEMINI_API_KEY=${GEMINI_API_KEY}
    env_file:
      - .env.production
```

### AWS/Cloud Deployment

#### Environment Variables
- [ ] Set in AWS Lambda environment variables (for serverless)
- [ ] Set in ECS task definition (for containers)
- [ ] Set in Elastic Beanstalk configuration (for traditional deployment)
- [ ] Use AWS Secrets Manager for sensitive values (recommended)

## Post-Deployment Verification

### 1. Health Checks
- [ ] API endpoint is accessible
- [ ] Configuration validation passes
- [ ] Gemini API connection works
- [ ] Error handling works correctly

### 2. Monitoring Setup
- [ ] Application logs are being collected
- [ ] Error tracking is configured (Sentry, etc.)
- [ ] Performance monitoring is active
- [ ] API usage metrics are tracked

### 3. Security Verification
- [ ] API keys are not exposed in client-side code
- [ ] HTTPS is enforced in production
- [ ] CORS is properly configured
- [ ] Rate limiting is in place (if applicable)

## Troubleshooting Common Issues

### Configuration Issues
```bash
# Problem: "GEMINI_API_KEY environment variable is required"
# Solution: Verify environment variable is set
echo $GEMINI_API_KEY

# Problem: "Failed to initialize Gemini AI client"
# Solution: Check API key validity
npm run test -- src/test/gemini.test.js
```

### Build Issues
```bash
# Problem: Build fails with import errors
# Solution: Check all imports and dependencies
npm run build 2>&1 | grep -i error

# Problem: Runtime errors in production
# Solution: Check production logs and environment variables
```

### API Issues
```bash
# Problem: API returns 500 errors
# Solution: Check configuration validation
node -e "
import('./src/lib/startup-validator.js').then(m => 
  m.validateStartup().then(r => console.log(m.generateStartupReport()))
)"
```

## Rollback Plan

### If Deployment Fails
1. [ ] Revert to previous deployment
2. [ ] Check environment variable changes
3. [ ] Verify API key validity
4. [ ] Run local tests to identify issues
5. [ ] Fix issues and redeploy

### Emergency Contacts
- [ ] Document who to contact for API key issues
- [ ] Document who to contact for deployment platform issues
- [ ] Document escalation procedures

## Validation Commands

### Pre-deployment Validation
```bash
# Run all tests
npm run test

# Validate configuration
npm run validate-startup

# Build application
npm run build

# Test API locally
npm run dev &
sleep 5
curl -X POST http://localhost:3000/api/ectro \
  -H "Content-Type: application/json" \
  -d '{"userPrompt":"test","targetAI":"ChatGPT","promptStyle":"Basic"}'
```

### Post-deployment Validation
```bash
# Test production API
curl -X POST https://your-domain.com/api/ectro \
  -H "Content-Type: application/json" \
  -d '{"userPrompt":"test","targetAI":"ChatGPT","promptStyle":"Basic"}'

# Check application logs
# (Platform-specific commands)
```

## Sign-off Checklist

- [ ] **Developer**: All code changes tested locally
- [ ] **QA**: All test scenarios pass
- [ ] **DevOps**: Environment variables configured correctly
- [ ] **Security**: API keys and secrets properly managed
- [ ] **Product**: API functionality verified in production

---

**Deployment Date**: ___________  
**Deployed By**: ___________  
**Environment**: ___________  
**Version/Commit**: ___________