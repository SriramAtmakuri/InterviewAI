import { executeCode, validateSyntax, getSupportedLanguages } from '../services/codeExecutionService.js';
import { analyzeCode } from '../services/geminiService.js';
import { saveCodeSubmission } from '../models/interviewModel.js';

/**
 * Execute code
 */
export const runCode = async (req, res) => {
  try {
    const { code, language, testCases } = req.body;

    if (!code || !language) {
      return res.status(400).json({
        success: false,
        error: 'Code and language are required',
      });
    }

    const result = await executeCode(code, language, testCases);

    res.json({
      success: true,
      result,
    });
  } catch (error) {
    console.error('Error executing code:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

/**
 * Submit code for interview
 */
export const submitCode = async (req, res) => {
  try {
    const { interviewId } = req.params;
    const { code, language, problem } = req.body;

    if (!code || !language || !problem) {
      return res.status(400).json({
        success: false,
        error: 'Code, language, and problem are required',
      });
    }

    // Execute code
    const executionResult = await executeCode(code, language);

    // Analyze code with AI
    const analysis = await analyzeCode(code, problem, language);

    // Save submission
    const submission = await saveCodeSubmission(interviewId, {
      code,
      language,
      problem,
      executionResult,
      analysis,
    });

    res.json({
      success: true,
      submissionId: submission.submissionId,
      executionResult,
      analysis,
    });
  } catch (error) {
    console.error('Error submitting code:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

/**
 * Validate code syntax
 */
export const checkSyntax = async (req, res) => {
  try {
    const { code, language } = req.body;

    if (!code || !language) {
      return res.status(400).json({
        success: false,
        error: 'Code and language are required',
      });
    }

    const result = await validateSyntax(code, language);

    res.json({
      success: true,
      result,
    });
  } catch (error) {
    console.error('Error validating syntax:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

/**
 * Get supported programming languages
 */
export const getLanguages = async (req, res) => {
  try {
    const languages = getSupportedLanguages();

    res.json({
      success: true,
      languages,
    });
  } catch (error) {
    console.error('Error getting languages:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

/**
 * Analyze code without execution
 */
export const analyzeCodeOnly = async (req, res) => {
  try {
    const { code, problem, language } = req.body;

    if (!code || !problem || !language) {
      return res.status(400).json({
        success: false,
        error: 'Code, problem, and language are required',
      });
    }

    const analysis = await analyzeCode(code, problem, language);

    res.json({
      success: true,
      analysis,
    });
  } catch (error) {
    console.error('Error analyzing code:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
