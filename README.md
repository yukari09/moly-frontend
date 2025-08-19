# Ectro API - AI Prompt Optimization Service

This is a [Next.js](https://nextjs.org) application that provides the Ectro API, an advanced prompt optimization specialist that transforms vague or basic prompts into precision-crafted prompts using the proven 4D Methodology (Deconstruct, Diagnose, Develop, Deliver).

## What is Ectro?

Ectro is an AI-powered prompt engineering service that takes your basic ideas and transforms them into professional, platform-optimized prompts that unlock AI's full potential. Whether you have a simple request or a complex task, Ectro analyzes your input and creates detailed, effective prompts tailored for your target AI platform.

## Features

- **4D Methodology**: Systematic prompt optimization using Deconstruct, Diagnose, Develop, and Deliver phases
- **Multi-Platform Optimization**: Specialized optimization for Gemini, ChatGPT, Claude, and Midjourney
- **Two Optimization Modes**: 
  - **Basic**: Essential improvements with concise optimizations
  - **Detail**: Comprehensive optimization with advanced techniques and detailed explanations
- **Platform-Specific Intelligence**: Understands the unique strengths and requirements of each AI platform
- **Professional Results**: Transforms simple ideas into sophisticated, results-driven prompts
- **Comprehensive Error Handling**: User-friendly error messages and robust error handling
- **Configuration Validation**: Automatic validation of environment setup
- **Extensive Testing**: Full test coverage with unit and integration tests

## Quick Start

### 1. Environment Setup

Create a `.env.local` file in the root directory:

```bash
GEMINI_API_KEY=your_gemini_api_key_here
NODE_ENV=development
```

Get your Gemini API key from [Google AI Studio](https://makersuite.google.com/app/apikey).

### 2. Install Dependencies

```bash
npm install
```

### 3. Validate Configuration

```bash
npm run validate-startup
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## API Usage

### Endpoint
```
POST /api/ectro
```

### Request Example
```bash
curl -X POST http://localhost:3000/api/ectro \
  -H "Content-Type: application/json" \
  -d '{
    "userPrompt": "Write a blog post about AI",
    "targetAI": "ChatGPT",
    "promptStyle": "Detail"
  }'
```

### Response Example
```json
{
  "optimizedPrompt": "Create a comprehensive blog post about artificial intelligence that includes: 1) An engaging introduction explaining what AI is in simple terms...",
  "explanation": "I transformed your basic request into a structured, detailed prompt that will produce much better results..."
}
```

## Documentation

- [Environment Configuration](docs/environment-configuration.md) - Complete environment setup guide
- [API Usage Guide](docs/ectro-api-usage.md) - Detailed API documentation with examples
- [Deployment Checklist](docs/deployment-checklist.md) - Step-by-step deployment guide

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run test` - Run tests
- `npm run test:run` - Run tests once
- `npm run validate-startup` - Validate environment configuration
- `npm run lint` - Run ESLint

## Testing

Run all tests:
```bash
npm run test
```

Run specific test suites:
```bash
npm run test -- src/test/ectro-api.test.js
npm run test -- src/test/config-validator.test.js
npm run test -- src/test/startup-validator.test.js
```

## Configuration Validation

The application includes comprehensive configuration validation:

- **Startup Validation**: Automatically validates environment on first API request
- **Manual Validation**: Run `npm run validate-startup` to check configuration
- **Error Messages**: Clear, actionable error messages for configuration issues

## Deployment

See the [Deployment Checklist](docs/deployment-checklist.md) for detailed deployment instructions for various platforms including Vercel, Netlify, and Docker.

### Quick Deployment to Vercel

1. Set environment variables in Vercel dashboard:
   - `GEMINI_API_KEY`: Your production Gemini API key
   - `NODE_ENV`: `production`

2. Deploy:
```bash
vercel --prod
```

## Architecture

- **Next.js 15.4.5**: React framework with API routes
- **Google Gemini AI**: AI service for prompt optimization
- **Vitest**: Testing framework
- **Comprehensive Error Handling**: Categorized error handling with user-friendly messages
- **Configuration Management**: Environment validation and startup checks

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Run `npm run test` to ensure all tests pass
6. Run `npm run validate-startup` to check configuration
7. Submit a pull request

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!
