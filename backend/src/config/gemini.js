import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Models configuration
export const models = {
  PRO: 'gemini-1.5-pro',
  FLASH: 'gemini-1.5-flash',
  VISION: 'gemini-1.5-pro-vision',
};

// Get model instance
export const getModel = (modelName = models.FLASH) => {
  return genAI.getGenerativeModel({ model: modelName });
};

// Interview AI Configuration
export const interviewConfig = {
  temperature: 0.7,
  topK: 40,
  topP: 0.95,
  maxOutputTokens: 2048,
};

// Code analysis configuration
export const codeAnalysisConfig = {
  temperature: 0.3,
  topK: 20,
  topP: 0.9,
  maxOutputTokens: 1024,
};

// Resume analysis configuration
export const resumeAnalysisConfig = {
  temperature: 0.5,
  topK: 30,
  topP: 0.9,
  maxOutputTokens: 2048,
};

export default genAI;
