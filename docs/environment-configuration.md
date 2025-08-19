# Environment Configuration

This document describes the environment variables required for the Ectro API implementation and the overall application.

## Required Environment Variables

### GEMINI_API_KEY
- **Description**: Google Gemini AI API key for prompt optimization
- **Required**: Yes
- **Type**: String
- **Example**: `AIzaSyDYeJ5AliBRtG0rzyaSOkyH1UQ4Oj8yABA`
- **Where to get**: [Google AI Studio](https://makersuite.google.com/app/apikey)
- **Usage**: Used by the Ectro API to communicate with Google's Gemini AI service

### NODE_ENV
- **Description**: Node.js environment mode
- **Required**: Yes
- **Type**: String
- **Allowed values**: `development`, `production`, `test`
- **Default**: `development`
- **Usage**: Controls error message verbosity and logging levels

## Environment Files

### .env.local (Development)
```bash
GEMINI_API_KEY=your_actual_gemini_api_key_here
NODE_ENV=development
```

### .env.test (Testing)
```bash
NODE_ENV=test
GEMINI_API_KEY=test-api-key-for-testing
```

### .env.production (Production)
```bash
GEMINI_API_KEY=your_production_gemini_api_key_here
NODE_ENV=production
```

## Configuration Validation

The application validates environment variables on startup:

1. **GEMINI_API_KEY**: Must be present and non-empty
2. **NODE_ENV**: Must be one of: `development`, `production`, `test`

## Error Messages

If required environment variables are missing, you'll see these error messages:

- `GEMINI_API_KEY environment variable is required` - The Gemini API key is missing
- `Invalid NODE_ENV value` - NODE_ENV is not set to a valid value
- `Gemini client is not configured` - API key validation failed

## Security Notes

- Never commit actual API keys to version control
- Use different API keys for development, testing, and production
- Store production keys securely in your deployment platform's environment variable system
- The application logs will never expose API key values

## Troubleshooting

### Common Issues

1. **"GEMINI_API_KEY environment variable is required"**
   - Ensure the API key is set in your environment file
   - Check that the environment file is being loaded correctly
   - Verify the API key is not empty or just whitespace

2. **"Failed to initialize Gemini AI client"**
   - Verify your API key is valid and active
   - Check your internet connection
   - Ensure you have proper permissions for the Gemini API

3. **"Gemini API connection test failed"**
   - Your API key might be invalid or expired
   - Check if you've exceeded your API quota
   - Verify the Gemini API service is available

### Testing Configuration

You can test your configuration by running:

```bash
npm run test -- src/test/gemini.test.js
```

This will validate that your Gemini API key is working correctly.