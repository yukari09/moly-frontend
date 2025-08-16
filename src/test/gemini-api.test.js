import { GoogleGenerativeAI } from '@google/generative-ai';
import { describe, it, expect, beforeAll } from 'vitest';

describe('Gemini AI SDK Integration', () => {
  let genAI;
  let model;

  beforeAll(() => {
    // Check if API key is available
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY environment variable is not set');
    }

    // Initialize the Gemini AI client
    genAI = new GoogleGenerativeAI(apiKey);
    model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
  });

  it('should initialize GoogleGenerativeAI client successfully', () => {
    expect(genAI).toBeDefined();
    expect(model).toBeDefined();
  });

  it('should make a successful API call to Gemini', async () => {
    const prompt = 'Hello, this is a test. Please respond with "API connection successful".';
    
    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      expect(text).toBeDefined();
      expect(typeof text).toBe('string');
      expect(text.length).toBeGreaterThan(0);
      
      console.log('Gemini API Response:', text);
    } catch (error) {
      console.error('Gemini API Error:', error);
      throw error;
    }
  }, 30000); // 30 second timeout for API call

  it('should handle prompt optimization request', async () => {
    const testPrompt = 'Write a story about a cat';
    const optimizationRequest = `Please optimize this prompt for better AI responses: "${testPrompt}"`;
    
    try {
      const result = await model.generateContent(optimizationRequest);
      const response = await result.response;
      const text = response.text();
      
      expect(text).toBeDefined();
      expect(typeof text).toBe('string');
      expect(text.length).toBeGreaterThan(testPrompt.length);
      
      console.log('Prompt Optimization Response:', text);
    } catch (error) {
      console.error('Prompt Optimization Error:', error);
      throw error;
    }
  }, 30000);
});