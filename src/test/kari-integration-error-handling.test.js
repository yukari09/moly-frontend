import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from '@/app/api/kari/optimize/route';
import { NextRequest } from 'next/server';

describe('Kari API Integration Error Handling', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should handle all validation scenarios correctly', async () => {
    // Test empty prompt
    const emptyPromptRequest = new NextRequest('http://localhost:3000/api/kari/optimize', {
      method: 'POST',
      body: JSON.stringify({
        prompt: '',
        platform: 'chatgpt',
        generatorType: 'writing',
        mode: 'BASIC',
        locale: 'en'
      })
    });

    const emptyResponse = await POST(emptyPromptRequest);
    const emptyData = await emptyResponse.json();
    
    expect(emptyResponse.status).toBe(400);
    expect(emptyData.success).toBe(false);
    expect(emptyData.error).toContain('Prompt is required');

    // Test short prompt
    const shortPromptRequest = new NextRequest('http://localhost:3000/api/kari/optimize', {
      method: 'POST',
      body: JSON.stringify({
        prompt: 'short',
        platform: 'chatgpt',
        generatorType: 'writing',
        mode: 'BASIC',
        locale: 'en'
      })
    });

    const shortResponse = await POST(shortPromptRequest);
    const shortData = await shortResponse.json();
    
    expect(shortResponse.status).toBe(400);
    expect(shortData.success).toBe(false);
    expect(shortData.error).toContain('at least 10 characters');

    // Test long prompt
    const longPrompt = 'a'.repeat(2001);
    const longPromptRequest = new NextRequest('http://localhost:3000/api/kari/optimize', {
      method: 'POST',
      body: JSON.stringify({
        prompt: longPrompt,
        platform: 'chatgpt',
        generatorType: 'writing',
        mode: 'BASIC',
        locale: 'en'
      })
    });

    const longResponse = await POST(longPromptRequest);
    const longData = await longResponse.json();
    
    expect(longResponse.status).toBe(400);
    expect(longData.success).toBe(false);
    expect(longData.error).toContain('less than 2000 characters');

    // Test invalid platform
    const invalidPlatformRequest = new NextRequest('http://localhost:3000/api/kari/optimize', {
      method: 'POST',
      body: JSON.stringify({
        prompt: 'This is a valid prompt for testing',
        platform: 'invalid-platform',
        generatorType: 'writing',
        mode: 'BASIC',
        locale: 'en'
      })
    });

    const invalidPlatformResponse = await POST(invalidPlatformRequest);
    const invalidPlatformData = await invalidPlatformResponse.json();
    
    expect(invalidPlatformResponse.status).toBe(400);
    expect(invalidPlatformData.success).toBe(false);
    expect(invalidPlatformData.error).toContain('Invalid platform');

    // Test invalid generator type
    const invalidGeneratorRequest = new NextRequest('http://localhost:3000/api/kari/optimize', {
      method: 'POST',
      body: JSON.stringify({
        prompt: 'This is a valid prompt for testing',
        platform: 'chatgpt',
        generatorType: 'invalid-type',
        mode: 'BASIC',
        locale: 'en'
      })
    });

    const invalidGeneratorResponse = await POST(invalidGeneratorRequest);
    const invalidGeneratorData = await invalidGeneratorResponse.json();
    
    expect(invalidGeneratorResponse.status).toBe(400);
    expect(invalidGeneratorData.success).toBe(false);
    expect(invalidGeneratorData.error).toContain('Invalid generator type');

    // Test invalid mode
    const invalidModeRequest = new NextRequest('http://localhost:3000/api/kari/optimize', {
      method: 'POST',
      body: JSON.stringify({
        prompt: 'This is a valid prompt for testing',
        platform: 'chatgpt',
        generatorType: 'writing',
        mode: 'INVALID',
        locale: 'en'
      })
    });

    const invalidModeResponse = await POST(invalidModeRequest);
    const invalidModeData = await invalidModeResponse.json();
    
    expect(invalidModeResponse.status).toBe(400);
    expect(invalidModeData.success).toBe(false);
    expect(invalidModeData.error).toContain('Invalid mode');
  });

  it('should handle malformed JSON', async () => {
    const malformedRequest = new NextRequest('http://localhost:3000/api/kari/optimize', {
      method: 'POST',
      body: 'invalid json'
    });

    const response = await POST(malformedRequest);
    const data = await response.json();
    
    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error).toContain('Invalid JSON');
  });

  it('should validate all required fields', async () => {
    const missingFieldsRequest = new NextRequest('http://localhost:3000/api/kari/optimize', {
      method: 'POST',
      body: JSON.stringify({
        prompt: 'This is a valid prompt for testing'
        // Missing platform and generatorType
      })
    });

    const response = await POST(missingFieldsRequest);
    const data = await response.json();
    
    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error).toContain('Platform and generator type are required');
  });
});