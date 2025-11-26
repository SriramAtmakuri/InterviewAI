// Gemini API configuration
// Get your free API key from: https://makersuite.google.com/app/apikey

export const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';
export const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

export const isGeminiConfigured = () => {
  return GEMINI_API_KEY.length > 0;
};
