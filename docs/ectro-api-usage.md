# Ectro API Usage Guide

The Ectro API provides prompt optimization services using Google's Gemini AI. This guide covers how to use the API effectively.

## API Endpoint

```
POST /api/ectro
```

## Request Format

### Headers
```
Content-Type: application/json
```

### Request Body
```json
{
  "userPrompt": "string",     // Required: Your original prompt (1-4000 characters)
  "targetAI": "string",       // Required: Target AI platform
  "promptStyle": "string"     // Required: Optimization style
}
```

### Parameters

#### userPrompt
- **Type**: String
- **Required**: Yes
- **Length**: 1-4000 characters
- **Description**: The original prompt you want to optimize

#### targetAI
- **Type**: String (enum)
- **Required**: Yes
- **Allowed values**: `"Gemini"`, `"ChatGPT"`, `"Claude"`, `"Midjourney"`
- **Description**: The AI platform you plan to use the optimized prompt with

#### promptStyle
- **Type**: String (enum)
- **Required**: Yes
- **Allowed values**: `"Basic"`, `"Detail"`
- **Description**: 
  - `"Basic"`: Quick optimization with essential improvements
  - `"Detail"`: Comprehensive optimization with detailed explanations

## Response Format

### Success Response (200)
```json
{
  "optimizedPrompt": "string",  // The enhanced version of your prompt
  "explanation": "string"       // Detailed explanation of improvements made
}
```

### Error Response (4xx/5xx)
```json
{
  "error": "string",           // Error message
  "details": "string"          // Additional details (development only)
}
```

## Usage Examples

### Example 1: Basic ChatGPT Optimization

**Request:**
```bash
curl -X POST http://localhost:3000/api/ectro \
  -H "Content-Type: application/json" \
  -d '{
    "userPrompt": "Write a blog post about AI",
    "targetAI": "ChatGPT",
    "promptStyle": "Basic"
  }'
```

**Response:**
```json
{
  "optimizedPrompt": "Create a comprehensive blog post about artificial intelligence that includes: 1) An engaging introduction explaining what AI is in simple terms, 2) Current applications of AI in everyday life with specific examples, 3) Benefits and potential concerns about AI development, 4) Future implications and trends in AI technology, and 5) A conclusion that encourages readers to stay informed about AI developments. Write in a conversational tone suitable for a general audience, aim for 800-1200 words, and include relevant statistics or recent developments where appropriate.",
  "explanation": "I transformed your basic request into a structured, detailed prompt that will produce much better results. The optimized version includes: specific content requirements (5 clear sections), target audience definition (general audience), tone specification (conversational), word count guidance (800-1200 words), and quality indicators (statistics, recent developments). This gives ChatGPT clear direction and will result in a more comprehensive, well-organized blog post."
}
```

### Example 2: Detailed Midjourney Optimization

**Request:**
```bash
curl -X POST http://localhost:3000/api/ectro \
  -H "Content-Type: application/json" \
  -d '{
    "userPrompt": "A beautiful landscape",
    "targetAI": "Midjourney",
    "promptStyle": "Detail"
  }'
```

**Response:**
```json
{
  "optimizedPrompt": "A breathtaking mountain landscape at golden hour, featuring snow-capped peaks reflecting warm sunlight, a pristine alpine lake in the foreground with crystal-clear reflections, scattered wildflowers in vibrant colors along the shoreline, dramatic clouds with soft lighting, shot with a wide-angle lens, professional landscape photography style, high resolution, ultra-detailed, cinematic composition --ar 16:9 --v 6 --style raw",
  "explanation": "I've transformed your simple landscape request into a detailed Midjourney prompt that will generate stunning results. Key improvements include: 1) Specific scene elements (mountain peaks, alpine lake, wildflowers), 2) Lighting specification (golden hour for warm, dramatic lighting), 3) Technical photography terms (wide-angle lens, professional style), 4) Quality modifiers (high resolution, ultra-detailed), 5) Midjourney-specific parameters (--ar 16:9 for aspect ratio, --v 6 for latest model, --style raw for photorealistic results). This level of detail ensures Midjourney understands exactly what kind of landscape you want and will produce much more compelling, professional-looking images."
}
```

### Example 3: Claude Detail Mode

**Request:**
```javascript
const response = await fetch('/api/ectro', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    userPrompt: "Help me learn JavaScript",
    targetAI: "Claude",
    promptStyle: "Detail"
  })
});

const result = await response.json();
console.log(result);
```

## Error Handling

### Common Error Responses

#### 400 - Bad Request
```json
{
  "error": "Validation failed",
  "details": "userPrompt is required and must be between 1 and 4000 characters"
}
```

#### 429 - Rate Limited
```json
{
  "error": "Rate limit exceeded",
  "details": "Too many requests. Please try again later."
}
```

#### 500 - Internal Server Error
```json
{
  "error": "Internal server error",
  "details": "An unexpected error occurred while processing your request"
}
```

#### 502 - Service Unavailable
```json
{
  "error": "Service temporarily unavailable",
  "details": "The AI service is currently unavailable. Please try again later."
}
```

## Best Practices

### 1. Choose the Right Target AI
- **Gemini**: Best for analytical and reasoning tasks
- **ChatGPT**: Excellent for conversational and creative content
- **Claude**: Great for detailed analysis and structured responses
- **Midjourney**: Specialized for image generation prompts

### 2. Select Appropriate Style
- **Basic**: Use when you need quick improvements and have time constraints
- **Detail**: Use when you want comprehensive optimization and learning opportunities

### 3. Input Quality Tips
- Be specific about your goals in the original prompt
- Include context about your intended use case
- Mention any constraints or requirements you have

### 4. Error Handling in Your Code
```javascript
try {
  const response = await fetch('/api/ectro', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(requestData)
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'API request failed');
  }
  
  const result = await response.json();
  return result;
} catch (error) {
  console.error('Ectro API error:', error.message);
  // Handle error appropriately in your application
}
```

## Rate Limits and Performance

- The API processes requests sequentially to ensure quality
- Typical response time: 2-10 seconds depending on complexity
- No explicit rate limiting is currently implemented, but please use responsibly
- For high-volume usage, consider implementing client-side rate limiting

## Integration Examples

### React Component
```jsx
import { useState } from 'react';

function PromptOptimizer() {
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const optimizePrompt = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/ectro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userPrompt: prompt,
          targetAI: 'ChatGPT',
          promptStyle: 'Detail'
        })
      });
      
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <textarea 
        value={prompt} 
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Enter your prompt..."
      />
      <button onClick={optimizePrompt} disabled={loading}>
        {loading ? 'Optimizing...' : 'Optimize Prompt'}
      </button>
      {result && (
        <div>
          <h3>Optimized Prompt:</h3>
          <p>{result.optimizedPrompt}</p>
          <h3>Explanation:</h3>
          <p>{result.explanation}</p>
        </div>
      )}
    </div>
  );
}
```

## Testing the API

You can test the API using the provided test files:

```bash
# Run all Ectro API tests
npm run test -- src/test/ectro-api.test.js

# Run integration tests
npm run test -- src/test/ectro-integration.test.js
```