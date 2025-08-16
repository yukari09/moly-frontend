import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Gemini AI client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Get a Gemini model instance
 * @param {string} modelName - The model name (default: 'gemini-2.0-flash-exp')
 * @returns {Object} Gemini model instance
 */
export function getGeminiModel(modelName = 'gemini-2.0-flash-exp') {
  return genAI.getGenerativeModel({ model: modelName });
}

/**
 * Generate content using Gemini AI
 * @param {string} prompt - The prompt to send to Gemini
 * @param {string} modelName - The model name (optional)
 * @returns {Promise<string>} Generated text response
 */
export async function generateContent(prompt, modelName = 'gemini-2.0-flash-exp') {
  try {
    const model = getGeminiModel(modelName);
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Gemini API Error:', error);
    throw new Error(`Failed to generate content: ${error.message}`);
  }
}

/**
 * Generate content with custom generation config
 * @param {string} prompt - The prompt to send to Gemini
 * @param {Object} config - Generation configuration
 * @param {string} modelName - The model name (optional)
 * @returns {Promise<string>} Generated text response
 */
export async function generateContentWithConfig(prompt, config = {}, modelName = 'gemini-2.0-flash-exp') {
  try {
    const model = genAI.getGenerativeModel({ 
      model: modelName,
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 2048,
        topP: 0.8,
        topK: 40,
        ...config
      }
    });
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Gemini API Error:', error);
    throw new Error(`Failed to generate content: ${error.message}`);
  }
}

/**
 * Check if Gemini API is properly configured
 * @returns {boolean} True if API key is available
 */
export function isGeminiConfigured() {
  return !!process.env.GEMINI_API_KEY;
}

export default {
  getGeminiModel,
  generateContent,
  generateContentWithConfig,
  isGeminiConfigured
};