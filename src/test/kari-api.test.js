import { describe, it, expect } from 'vitest';

describe('Kari API Integration', () => {
  it('should optimize a prompt using the Kari API', async () => {
    const testRequest = {
      prompt: 'Write a story about a cat',
      platform: 'chatgpt',
      generatorType: 'writing',
      mode: 'BASIC',
      locale: 'en'
    };

    const response = await fetch('http://localhost:3000/api/kari/optimize', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testRequest),
    });

    expect(response.ok).toBe(true);
    
    const data = await response.json();
    
    expect(data.success).toBe(true);
    expect(data.data).toBeDefined();
    expect(data.data.optimizedPrompt).toBeDefined();
    expect(data.data.keyImprovements).toBeDefined();
    expect(data.data.techniquesApplied).toBeDefined();
    expect(data.data.processingTime).toBeDefined();
    
    console.log('Kari API Response:', JSON.stringify(data, null, 2));
  }, 60000); // 60 second timeout for API call

  it('should handle missing required fields', async () => {
    const testRequest = {
      prompt: 'Write a story about a cat',
      // Missing platform and generatorType
    };

    const response = await fetch('http://localhost:3000/api/kari/optimize', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testRequest),
    });

    expect(response.status).toBe(400);
    
    const data = await response.json();
    expect(data.success).toBe(false);
    expect(data.error).toBe('Missing required fields');
  });
});