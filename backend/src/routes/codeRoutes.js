import express from 'express';
import {
  runCode,
  submitCode,
  checkSyntax,
  getLanguages,
  analyzeCodeOnly,
} from '../controllers/codeController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Get supported languages (public)
router.get('/languages', getLanguages);

// All other routes require authentication
router.use(verifyToken);

// Execute code
router.post('/execute', runCode);

// Submit code for interview
router.post('/submit/:interviewId', submitCode);

// Validate syntax
router.post('/validate', checkSyntax);

// Analyze code with AI
router.post('/analyze', analyzeCodeOnly);

export default router;
