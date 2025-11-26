import {
  parseResume,
  uploadResume,
  analyzeResumeAgainstJD,
  generateQuestionsFromResume,
  extractSkills,
  getResumeSuggestions,
  benchmarkResume,
} from '../services/resumeService.js';
import { db, collections } from '../config/firebase.js';

/**
 * Upload and parse resume
 */
export const uploadAndParseResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No file uploaded',
      });
    }

    const userId = req.user.uid;

    // Parse resume
    const parseResult = await parseResume(req.file);

    // Upload to Firebase Storage
    const uploadResult = await uploadResume(req.file, userId);

    // Save to Firestore
    await db.collection(collections.RESUMES).add({
      userId,
      fileName: req.file.originalname,
      url: uploadResult.url,
      text: parseResult.text,
      uploadedAt: new Date().toISOString(),
    });

    res.json({
      success: true,
      text: parseResult.text,
      url: uploadResult.url,
    });
  } catch (error) {
    console.error('Error uploading resume:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

/**
 * Analyze resume against job description
 */
export const analyzeResume = async (req, res) => {
  try {
    const { resumeText, jobDescription } = req.body;

    if (!resumeText || !jobDescription) {
      return res.status(400).json({
        success: false,
        error: 'Resume text and job description are required',
      });
    }

    const result = await analyzeResumeAgainstJD(resumeText, jobDescription);

    res.json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error('Error analyzing resume:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

/**
 * Generate interview questions from resume
 */
export const generateQuestions = async (req, res) => {
  try {
    const { resumeText, jobDescription } = req.body;

    if (!resumeText || !jobDescription) {
      return res.status(400).json({
        success: false,
        error: 'Resume text and job description are required',
      });
    }

    const result = await generateQuestionsFromResume(resumeText, jobDescription);

    res.json(result);
  } catch (error) {
    console.error('Error generating questions:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

/**
 * Extract skills from resume
 */
export const getSkills = async (req, res) => {
  try {
    const { resumeText } = req.body;

    if (!resumeText) {
      return res.status(400).json({
        success: false,
        error: 'Resume text is required',
      });
    }

    const result = await extractSkills(resumeText);

    res.json(result);
  } catch (error) {
    console.error('Error extracting skills:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

/**
 * Get resume improvement suggestions
 */
export const getSuggestions = async (req, res) => {
  try {
    const { resumeText } = req.body;

    if (!resumeText) {
      return res.status(400).json({
        success: false,
        error: 'Resume text is required',
      });
    }

    const result = await getResumeSuggestions(resumeText);

    res.json(result);
  } catch (error) {
    console.error('Error getting suggestions:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

/**
 * Benchmark resume
 */
export const benchmark = async (req, res) => {
  try {
    const { resumeText, targetRole } = req.body;

    if (!resumeText || !targetRole) {
      return res.status(400).json({
        success: false,
        error: 'Resume text and target role are required',
      });
    }

    const result = await benchmarkResume(resumeText, targetRole);

    res.json(result);
  } catch (error) {
    console.error('Error benchmarking resume:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

/**
 * Get user's uploaded resumes
 */
export const getUserResumes = async (req, res) => {
  try {
    const userId = req.user.uid;

    const snapshot = await db
      .collection(collections.RESUMES)
      .where('userId', '==', userId)
      .orderBy('uploadedAt', 'desc')
      .limit(10)
      .get();

    const resumes = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.json({
      success: true,
      resumes,
    });
  } catch (error) {
    console.error('Error getting resumes:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
