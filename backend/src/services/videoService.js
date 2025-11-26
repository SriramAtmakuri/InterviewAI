import { storage } from '../config/firebase.js';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import { writeFile, unlink } from 'fs/promises';
import ffmpeg from 'fluent-ffmpeg';

/**
 * Upload video recording to Firebase Storage
 */
export const uploadVideoRecording = async (file, userId, interviewId) => {
  try {
    const bucket = storage.bucket();
    const fileName = `interviews/${userId}/${interviewId}/${uuidv4()}${path.extname(file.originalname)}`;

    const fileUpload = bucket.file(fileName);

    // Create a write stream
    const stream = fileUpload.createWriteStream({
      metadata: {
        contentType: file.mimetype,
        metadata: {
          userId,
          interviewId,
          uploadedAt: new Date().toISOString(),
        },
      },
    });

    // Upload the file
    await new Promise((resolve, reject) => {
      stream.on('error', reject);
      stream.on('finish', resolve);
      stream.end(file.buffer);
    });

    // Make the file publicly accessible (optional - adjust based on your needs)
    // await fileUpload.makePublic();

    // Get signed URL (valid for 7 days)
    const [url] = await fileUpload.getSignedUrl({
      action: 'read',
      expires: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return {
      success: true,
      url,
      fileName,
      size: file.size,
    };
  } catch (error) {
    console.error('Error uploading video:', error);
    throw new Error('Failed to upload video recording');
  }
};

/**
 * Upload video chunk for streaming
 */
export const uploadVideoChunk = async (chunk, userId, interviewId, chunkIndex) => {
  try {
    const bucket = storage.bucket();
    const fileName = `interviews/${userId}/${interviewId}/chunks/chunk_${chunkIndex}.webm`;

    const fileUpload = bucket.file(fileName);

    await fileUpload.save(chunk, {
      metadata: {
        contentType: 'video/webm',
      },
    });

    return {
      success: true,
      chunkIndex,
      fileName,
    };
  } catch (error) {
    console.error('Error uploading video chunk:', error);
    throw new Error('Failed to upload video chunk');
  }
};

/**
 * Merge video chunks into single file
 */
export const mergeVideoChunks = async (userId, interviewId, totalChunks) => {
  try {
    const bucket = storage.bucket();
    const outputFileName = `interviews/${userId}/${interviewId}/recording.webm`;

    // Download all chunks
    const chunks = [];
    for (let i = 0; i < totalChunks; i++) {
      const chunkFile = bucket.file(
        `interviews/${userId}/${interviewId}/chunks/chunk_${i}.webm`
      );
      const [exists] = await chunkFile.exists();

      if (exists) {
        const [buffer] = await chunkFile.download();
        chunks.push(buffer);
      }
    }

    // Merge chunks
    const mergedBuffer = Buffer.concat(chunks);

    // Upload merged file
    const outputFile = bucket.file(outputFileName);
    await outputFile.save(mergedBuffer, {
      metadata: {
        contentType: 'video/webm',
        metadata: {
          userId,
          interviewId,
          mergedAt: new Date().toISOString(),
        },
      },
    });

    // Delete chunks
    for (let i = 0; i < totalChunks; i++) {
      const chunkFile = bucket.file(
        `interviews/${userId}/${interviewId}/chunks/chunk_${i}.webm`
      );
      await chunkFile.delete().catch(() => {});
    }

    // Get signed URL
    const [url] = await outputFile.getSignedUrl({
      action: 'read',
      expires: Date.now() + 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    return {
      success: true,
      url,
      fileName: outputFileName,
    };
  } catch (error) {
    console.error('Error merging video chunks:', error);
    throw new Error('Failed to merge video chunks');
  }
};

/**
 * Generate video thumbnail
 */
export const generateThumbnail = async (videoUrl, userId, interviewId) => {
  try {
    const bucket = storage.bucket();
    const tempVideoPath = `/tmp/${uuidv4()}.webm`;
    const tempThumbnailPath = `/tmp/${uuidv4()}.jpg`;

    // Download video
    const videoFile = bucket.file(
      `interviews/${userId}/${interviewId}/recording.webm`
    );
    await videoFile.download({ destination: tempVideoPath });

    // Generate thumbnail
    await new Promise((resolve, reject) => {
      ffmpeg(tempVideoPath)
        .screenshots({
          timestamps: ['00:00:05'],
          filename: path.basename(tempThumbnailPath),
          folder: path.dirname(tempThumbnailPath),
          size: '320x240',
        })
        .on('end', resolve)
        .on('error', reject);
    });

    // Upload thumbnail
    const thumbnailFileName = `interviews/${userId}/${interviewId}/thumbnail.jpg`;
    await bucket.upload(tempThumbnailPath, {
      destination: thumbnailFileName,
      metadata: {
        contentType: 'image/jpeg',
      },
    });

    // Cleanup temp files
    await unlink(tempVideoPath).catch(() => {});
    await unlink(tempThumbnailPath).catch(() => {});

    // Get signed URL
    const thumbnailFile = bucket.file(thumbnailFileName);
    const [url] = await thumbnailFile.getSignedUrl({
      action: 'read',
      expires: Date.now() + 30 * 24 * 60 * 60 * 1000,
    });

    return {
      success: true,
      url,
      fileName: thumbnailFileName,
    };
  } catch (error) {
    console.error('Error generating thumbnail:', error);
    throw new Error('Failed to generate thumbnail');
  }
};

/**
 * Delete video recording
 */
export const deleteVideoRecording = async (fileName) => {
  try {
    const bucket = storage.bucket();
    const file = bucket.file(fileName);

    await file.delete();

    return {
      success: true,
      message: 'Video deleted successfully',
    };
  } catch (error) {
    console.error('Error deleting video:', error);
    throw new Error('Failed to delete video');
  }
};

/**
 * Get video metadata
 */
export const getVideoMetadata = async (fileName) => {
  try {
    const bucket = storage.bucket();
    const file = bucket.file(fileName);

    const [metadata] = await file.getMetadata();

    return {
      success: true,
      metadata: {
        size: metadata.size,
        contentType: metadata.contentType,
        created: metadata.timeCreated,
        updated: metadata.updated,
      },
    };
  } catch (error) {
    console.error('Error getting video metadata:', error);
    throw new Error('Failed to get video metadata');
  }
};

/**
 * List all recordings for an interview
 */
export const listInterviewRecordings = async (userId, interviewId) => {
  try {
    const bucket = storage.bucket();
    const prefix = `interviews/${userId}/${interviewId}/`;

    const [files] = await bucket.getFiles({ prefix });

    const recordings = await Promise.all(
      files
        .filter((file) => !file.name.includes('chunks/'))
        .map(async (file) => {
          const [url] = await file.getSignedUrl({
            action: 'read',
            expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
          });

          const [metadata] = await file.getMetadata();

          return {
            fileName: file.name,
            url,
            size: metadata.size,
            created: metadata.timeCreated,
          };
        })
    );

    return {
      success: true,
      recordings,
    };
  } catch (error) {
    console.error('Error listing recordings:', error);
    throw new Error('Failed to list recordings');
  }
};
