import rateLimit from 'express-rate-limit';

// General API rate limiter
export const apiLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'), // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    error: 'Too many requests, please try again later',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Strict rate limiter for code execution
export const codeExecutionLimiter = rateLimit({
  windowMs: 60000, // 1 minute
  max: 10, // 10 requests per minute
  message: {
    success: false,
    error: 'Too many code execution requests, please slow down',
  },
});

// Strict rate limiter for video uploads
export const videoUploadLimiter = rateLimit({
  windowMs: 3600000, // 1 hour
  max: 5, // 5 video uploads per hour
  message: {
    success: false,
    error: 'Too many video uploads, please try again later',
  },
});

// AI request limiter
export const aiLimiter = rateLimit({
  windowMs: 60000, // 1 minute
  max: 30, // 30 AI requests per minute
  message: {
    success: false,
    error: 'Too many AI requests, please slow down',
  },
});
