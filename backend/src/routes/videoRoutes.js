import express from 'express';
import multer from 'multer';
import {
  uploadVideo,
  uploadChunk,
  finalizeRecording,
  getRecordings,
  deleteVideo,
} from '../controllers/videoController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Configure multer for video upload
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: parseInt(process.env.MAX_VIDEO_SIZE_MB || '100') * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['video/webm', 'video/mp4', 'video/quicktime'];

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only WebM, MP4, and MOV are allowed'));
    }
  },
});

// All routes require authentication
router.use(verifyToken);

// Upload complete video
router.post('/upload', upload.single('video'), uploadVideo);

// Upload video chunk
router.post('/chunk', upload.single('chunk'), uploadChunk);

// Finalize recording (merge chunks)
router.post('/finalize', finalizeRecording);

// Get recordings for an interview
router.get('/interview/:interviewId', getRecordings);

// Delete video recording
router.delete('/:recordingId', deleteVideo);

export default router;
