import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from '@/app/api/kari/optimize/route';
import { NextRequest } from 'next/server';

// Mock the Gemini API
vi.mock('@/lib/gemini', () => ({
  generateContentWithConfig: vi.fn()
}));

describe('Kari API Error Handling', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return 400 for missing prompt', async () => {
    const request = new NextRequest('http://localhost:3000/api/kari/optimize', {
      method: 'POST',
      body: JSON.stringify({
        platform: 'chatgpt',
        generatorType: 'writing',
        mode: 'BASIC',
        locale: 'en'
      })
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error).toContain('Prompt is required');
  });

  it('should return 400 for prompt too short', async () => {
    const request = new NextRequest('http://localhost:3000/api/kari/optimize', {
      method: 'POST',
      body: JSON.stringify({
        prompt: 'short',
        platform: 'chatgpt',
        generatorType: 'writing',
        mode: 'BASIC',
        locale: 'en'
      })
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error).toContain('at least 10 characters');
  });

  it('should return 400 for prompt too long', async () => {
    const longPrompt = 'a'.repeat(2001);
    const request = new NextRequest('http://localhost:3000/api/kari/optimize', {
      method: 'POST',
      body: JSON.stringify({
        prompt: longPrompt,
        platform: 'chatgpt',
        generatorType: 'writing',
        mode: 'BASIC',
        locale: 'en'
      })
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error).toContain('less than 2000 characters');
  });

  it('should return 400 for invalid platform', async () => {
    const request = new NextRequest('http://localhost:3000/api/kari/optimize', {
      method: 'POST',
      body: JSON.stringify({
        prompt: 'This is a valid prompt for testing',
        platform: 'invalid-platform',
        generatorType: 'writing',
        mode: 'BASIC',
        locale: 'en'
      })
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error).toContain('Invalid platform');
  });

  it('should return 400 for invalid JSON', async () => {
    const request = new NextRequest('http://localhost:3000/api/kari/optimize', {
      method: 'POST',
      body: 'invalid json'
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error).toContain('Invalid JSON');
  });
});