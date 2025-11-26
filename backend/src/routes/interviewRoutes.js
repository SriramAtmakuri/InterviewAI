import express from 'express';
import {
  startInterview,
  sendMessage,
  endInterview,
  getInterviewDetails,
  getHistory,
} from '../controllers/interviewController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// All interview routes require authentication
router.use(verifyToken);

// Start new interview
router.post('/start', startInterview);

// Send message in interview
router.post('/:interviewId/message', sendMessage);

// End interview and get feedback
router.post('/:interviewId/end', endInterview);

// Get interview details
router.get('/:interviewId', getInterviewDetails);

// Get user's interview history
router.get('/', getHistory);

export default router;
