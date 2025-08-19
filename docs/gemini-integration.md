# Gemini AI Integration

This document describes the Gemini AI integration setup for the Ectro API.

## Overview

The Gemini AI integration provides the core AI functionality for the Ectro prompt optimization service. It uses Google's Gemini Pro model to analyze and enhance user prompts.

## Configuration

### Environment Variables

The integration requires the following environment variable:

```bash
GEMINI_API_KEY=your_gemini_api_key_here
```

### Getting a Gemini API Key

1. Visit the [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Add the key to your environment variables

## Usage

### Basic Usage

```javascript
import geminiClient from '@/lib/gemini';

// Test connection
const isConnected = await geminiClient.testConnection();

// Generate content
const response = await geminiClient.generateContent('Your prompt here');
```

### Convenience Functions

```javascript
import { getGeminiModel, testGeminiConnection, generateContent } from '@/lib/gemini';

// Get the model instance
const model = getGeminiModel();

// Test connection
const isConnected = await testGeminiConnection();

// Generate content
const response = await generateContent('Your prompt here');
```

## Testing

### Running Tests

```bash
# Run Gemini client tests
npm test -- src/test/gemini.test.js --run

# Run API integration tests
npm test -- src/test/ectro-api.test.js --run
```

### Manual Testing

You can test the Gemini integration manually using the test utility:

```javascript
import { runGeminiConnectionTest, testGeminiGeneration } from '@/lib/gemini-test';

// Test connection
await runGeminiConnectionTest();

// Test content generation
await testGeminiGeneration();
```

## API Integration

The Gemini client is integrated into the Ectro API route at `/api/ectro`. The route:

1. Validates that Gemini is properly configured
2. Logs request information
3. Uses Gemini for prompt optimization (to be implemented in subsequent tasks)
4. Returns structured responses with error handling

## Error Handling

The integration includes comprehensive error handling:

- **Configuration Errors**: Missing API key
- **Connection Errors**: Network issues, API unavailability
- **Generation Errors**: Content generation failures
- **Rate Limiting**: API quota exceeded

All errors are logged appropriately and user-friendly messages are returned to clients.

## Logging

The integration uses the project's logger utility with different log levels:

- **Debug**: Detailed information (development only)
- **Info**: General information (development only)
- **Warn**: Warning messages (development only)
- **Error**: Error messages (all environments)

## Security

- API keys are stored in environment variables
- No sensitive information is logged
- Error messages don't expose internal details in production

## Next Steps

This integration provides the foundation for the Ectro API. Subsequent tasks will:

1. Implement input validation
2. Create the Ectro system prompt
3. Add response parsing and formatting
4. Implement comprehensive error handling
5. Add monitoring and logging enhancements