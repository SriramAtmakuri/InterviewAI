import { db, collections } from '../config/firebase.js';

/**
 * Create new interview session
 */
export const createInterview = async (userId, interviewData) => {
  try {
    const interviewRef = await db.collection(collections.INTERVIEWS).add({
      userId,
      ...interviewData,
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    return {
      success: true,
      interviewId: interviewRef.id,
    };
  } catch (error) {
    console.error('Error creating interview:', error);
    throw new Error('Failed to create interview');
  }
};

/**
 * Get interview by ID
 */
export const getInterview = async (interviewId) => {
  try {
    const interviewDoc = await db
      .collection(collections.INTERVIEWS)
      .doc(interviewId)
      .get();

    if (!interviewDoc.exists) {
      return null;
    }

    return {
      id: interviewDoc.id,
      ...interviewDoc.data(),
    };
  } catch (error) {
    console.error('Error getting interview:', error);
    throw new Error('Failed to get interview');
  }
};

/**
 * Get all interviews for a user
 */
export const getUserInterviews = async (userId, limit = 50) => {
  try {
    const snapshot = await db
      .collection(collections.INTERVIEWS)
      .where('userId', '==', userId)
      .orderBy('createdAt', 'desc')
      .limit(limit)
      .get();

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error('Error getting user interviews:', error);
    throw new Error('Failed to get user interviews');
  }
};

/**
 * Update interview
 */
export const updateInterview = async (interviewId, updates) => {
  try {
    await db
      .collection(collections.INTERVIEWS)
      .doc(interviewId)
      .update({
        ...updates,
        updatedAt: new Date().toISOString(),
      });

    return {
      success: true,
      interviewId,
    };
  } catch (error) {
    console.error('Error updating interview:', error);
    throw new Error('Failed to update interview');
  }
};

/**
 * Add message to interview
 */
export const addMessage = async (interviewId, message) => {
  try {
    const interviewRef = db.collection(collections.INTERVIEWS).doc(interviewId);

    await interviewRef.update({
      messages: db.FieldValue.arrayUnion({
        ...message,
        timestamp: new Date().toISOString(),
      }),
      updatedAt: new Date().toISOString(),
    });

    return {
      success: true,
      interviewId,
    };
  } catch (error) {
    console.error('Error adding message:', error);
    throw new Error('Failed to add message');
  }
};

/**
 * Complete interview
 */
export const completeInterview = async (interviewId, endData) => {
  try {
    await db
      .collection(collections.INTERVIEWS)
      .doc(interviewId)
      .update({
        status: 'completed',
        endTime: new Date().toISOString(),
        ...endData,
        updatedAt: new Date().toISOString(),
      });

    return {
      success: true,
      interviewId,
    };
  } catch (error) {
    console.error('Error completing interview:', error);
    throw new Error('Failed to complete interview');
  }
};

/**
 * Save interview feedback
 */
export const saveFeedback = async (interviewId, feedbackData) => {
  try {
    const feedbackRef = await db.collection(collections.FEEDBACK).add({
      interviewId,
      ...feedbackData,
      createdAt: new Date().toISOString(),
    });

    // Update interview with feedback reference
    await db
      .collection(collections.INTERVIEWS)
      .doc(interviewId)
      .update({
        feedbackId: feedbackRef.id,
        updatedAt: new Date().toISOString(),
      });

    return {
      success: true,
      feedbackId: feedbackRef.id,
    };
  } catch (error) {
    console.error('Error saving feedback:', error);
    throw new Error('Failed to save feedback');
  }
};

/**
 * Get interview feedback
 */
export const getFeedback = async (interviewId) => {
  try {
    const snapshot = await db
      .collection(collections.FEEDBACK)
      .where('interviewId', '==', interviewId)
      .limit(1)
      .get();

    if (snapshot.empty) {
      return null;
    }

    const doc = snapshot.docs[0];
    return {
      id: doc.id,
      ...doc.data(),
    };
  } catch (error) {
    console.error('Error getting feedback:', error);
    throw new Error('Failed to get feedback');
  }
};

/**
 * Save code submission
 */
export const saveCodeSubmission = async (interviewId, codeData) => {
  try {
    const codeRef = await db.collection(collections.CODE_SUBMISSIONS).add({
      interviewId,
      ...codeData,
      submittedAt: new Date().toISOString(),
    });

    return {
      success: true,
      submissionId: codeRef.id,
    };
  } catch (error) {
    console.error('Error saving code submission:', error);
    throw new Error('Failed to save code submission');
  }
};

/**
 * Get code submissions for interview
 */
export const getCodeSubmissions = async (interviewId) => {
  try {
    const snapshot = await db
      .collection(collections.CODE_SUBMISSIONS)
      .where('interviewId', '==', interviewId)
      .orderBy('submittedAt', 'asc')
      .get();

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error('Error getting code submissions:', error);
    throw new Error('Failed to get code submissions');
  }
};
