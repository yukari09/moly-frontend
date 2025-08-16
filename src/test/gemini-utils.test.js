import { describe, it, expect } from 'vitest';
import { generateContent, generateContentWithConfig, isGeminiConfigured } from '../lib/gemini.js';

describe('Gemini Utility Functions', () => {
  it('should check if Gemini is configured', () => {
    expect(isGeminiConfigured()).toBe(true);
  });

  it('should generate content using the utility function', async () => {
    const prompt = 'Say "Hello from Gemini utility!"';
    const response = await generateContent(prompt);
    
    expect(response).toBeDefined();
    expect(typeof response).toBe('string');
    expect(response.length).toBeGreaterThan(0);
    
    console.log('Utility Response:', response);
  }, 30000);

  it('should generate content with custom config', async () => {
    const prompt = 'Write a very short sentence about cats.';
    const config = {
      temperature: 0.3,
      maxOutputTokens: 50
    };
    
    const response = await generateContentWithConfig(prompt, config);
    
    expect(response).toBeDefined();
    expect(typeof response).toBe('string');
    expect(response.length).toBeGreaterThan(0);
    
    console.log('Custom Config Response:', response);
  }, 30000);
});