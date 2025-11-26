import express from 'express';
import { getProfile, updateProfile, getStats } from '../controllers/userController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(verifyToken);

// Get user profile
router.get('/profile', getProfile);

// Update user profile
router.put('/profile', updateProfile);

// Get user statistics
router.get('/stats', getStats);

export default router;
