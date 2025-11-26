import express from 'express';
import multer from 'multer';
import {
  uploadAndParseResume,
  analyzeResume,
  generateQuestions,
  getSkills,
  getSuggestions,
  benchmark,
  getUserResumes,
} from '../controllers/resumeController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Configure multer for file upload
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword',
      'text/plain',
    ];

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF, DOCX, and TXT are allowed'));
    }
  },
});

// All routes require authentication
router.use(verifyToken);

// Upload and parse resume
router.post('/upload', upload.single('resume'), uploadAndParseResume);

// Analyze resume against job description
router.post('/analyze', analyzeResume);

// Generate interview questions from resume
router.post('/questions', generateQuestions);

// Extract skills from resume
router.post('/skills', getSkills);

// Get resume improvement suggestions
router.post('/suggestions', getSuggestions);

// Benchmark resume
router.post('/benchmark', benchmark);

// Get user's uploaded resumes
router.get('/', getUserResumes);

export default router;
