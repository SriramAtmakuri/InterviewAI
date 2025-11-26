import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import dotenv from 'dotenv';

dotenv.config();

import interviewRoutes from './routes/interviewRoutes.js';
import codeRoutes from './routes/codeRoutes.js';
import resumeRoutes from './routes/resumeRoutes.js';
import videoRoutes from './routes/videoRoutes.js';
import userRoutes from './routes/userRoutes.js';

import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import {
  apiLimiter,
  codeExecutionLimiter,
  videoUploadLimiter,
  aiLimiter,
} from './middleware/rateLimiter.js';

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet()); // Security headers
app.use(compression()); // Compress responses
app.use(morgan('combined')); // Logging

// CORS configuration
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'InterviewAI Backend is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  });
});

// API Routes with rate limiting
app.use('/api/interviews', aiLimiter, interviewRoutes);
app.use('/api/code', codeExecutionLimiter, codeRoutes);
app.use('/api/resume', aiLimiter, resumeRoutes);
app.use('/api/video', videoUploadLimiter, videoRoutes);
app.use('/api/user', apiLimiter, userRoutes);

// 404 handler
app.use(notFoundHandler);

// Error handler (must be last)
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log('🚀 InterviewAI Backend Server');
  console.log('================================');
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`✅ Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`✅ CORS enabled for: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
  console.log('================================');
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Promise Rejection:', err);
  // Don't exit in production
  if (process.env.NODE_ENV !== 'production') {
    process.exit(1);
  }
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err);
  process.exit(1);
});

export default app;
