import {
  uploadVideoRecording,
  uploadVideoChunk,
  mergeVideoChunks,
  generateThumbnail,
  deleteVideoRecording,
  listInterviewRecordings,
} from '../services/videoService.js';
import { db, collections } from '../config/firebase.js';

/**
 * Upload complete video recording
 */
export const uploadVideo = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No video file uploaded',
      });
    }

    const { interviewId } = req.body;
    const userId = req.user.uid;

    if (!interviewId) {
      return res.status(400).json({
        success: false,
        error: 'Interview ID is required',
      });
    }

    // Check file size
    const maxSize = (process.env.MAX_VIDEO_SIZE_MB || 100) * 1024 * 1024;
    if (req.file.size > maxSize) {
      return res.status(400).json({
        success: false,
        error: `Video size exceeds maximum limit of ${process.env.MAX_VIDEO_SIZE_MB || 100}MB`,
      });
    }

    // Upload video
    const result = await uploadVideoRecording(req.file, userId, interviewId);

    // Save video record to Firestore
    await db.collection(collections.VIDEO_RECORDINGS).add({
      userId,
      interviewId,
      url: result.url,
      fileName: result.fileName,
      size: result.size,
      uploadedAt: new Date().toISOString(),
    });

    res.json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error('Error uploading video:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

/**
 * Upload video chunk for streaming
 */
export const uploadChunk = async (req, res) => {
  try {
    const { interviewId, chunkIndex } = req.body;
    const userId = req.user.uid;

    if (!req.file || !interviewId || chunkIndex === undefined) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
      });
    }

    const result = await uploadVideoChunk(
      req.file.buffer,
      userId,
      interviewId,
      parseInt(chunkIndex)
    );

    res.json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error('Error uploading chunk:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

/**
 * Finalize video recording (merge chunks)
 */
export const finalizeRecording = async (req, res) => {
  try {
    const { interviewId, totalChunks } = req.body;
    const userId = req.user.uid;

    if (!interviewId || !totalChunks) {
      return res.status(400).json({
        success: false,
        error: 'Interview ID and total chunks are required',
      });
    }

    // Merge chunks
    const result = await mergeVideoChunks(userId, interviewId, parseInt(totalChunks));

    // Generate thumbnail (optional)
    try {
      const thumbnail = await generateThumbnail(result.url, userId, interviewId);
      result.thumbnailUrl = thumbnail.url;
    } catch (thumbError) {
      console.error('Error generating thumbnail:', thumbError);
      // Continue without thumbnail
    }

    // Save video record to Firestore
    await db.collection(collections.VIDEO_RECORDINGS).add({
      userId,
      interviewId,
      url: result.url,
      fileName: result.fileName,
      thumbnailUrl: result.thumbnailUrl || null,
      uploadedAt: new Date().toISOString(),
    });

    res.json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error('Error finalizing recording:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

/**
 * Get video recordings for an interview
 */
export const getRecordings = async (req, res) => {
  try {
    const { interviewId } = req.params;
    const userId = req.user.uid;

    const result = await listInterviewRecordings(userId, interviewId);

    res.json(result);
  } catch (error) {
    console.error('Error getting recordings:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

/**
 * Delete video recording
 */
export const deleteVideo = async (req, res) => {
  try {
    const { recordingId } = req.params;
    const userId = req.user.uid;

    // Get recording from Firestore
    const recordingDoc = await db
      .collection(collections.VIDEO_RECORDINGS)
      .doc(recordingId)
      .get();

    if (!recordingDoc.exists) {
      return res.status(404).json({
        success: false,
        error: 'Recording not found',
      });
    }

    const recording = recordingDoc.data();

    if (recording.userId !== userId) {
      return res.status(403).json({
        success: false,
        error: 'Unauthorized',
      });
    }

    // Delete from storage
    await deleteVideoRecording(recording.fileName);

    // Delete thumbnail if exists
    if (recording.thumbnailUrl) {
      await deleteVideoRecording(recording.thumbnailFileName).catch(() => {});
    }

    // Delete from Firestore
    await recordingDoc.ref.delete();

    res.json({
      success: true,
      message: 'Recording deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting video:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
