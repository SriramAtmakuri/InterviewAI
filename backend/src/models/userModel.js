import { db, collections } from '../config/firebase.js';

/**
 * Create or update user profile
 */
export const createUser = async (userId, userData) => {
  try {
    const userRef = db.collection(collections.USERS).doc(userId);

    await userRef.set(
      {
        ...userData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );

    return {
      success: true,
      userId,
    };
  } catch (error) {
    console.error('Error creating user:', error);
    throw new Error('Failed to create user');
  }
};

/**
 * Get user profile
 */
export const getUser = async (userId) => {
  try {
    const userDoc = await db.collection(collections.USERS).doc(userId).get();

    if (!userDoc.exists) {
      return null;
    }

    return {
      id: userDoc.id,
      ...userDoc.data(),
    };
  } catch (error) {
    console.error('Error getting user:', error);
    throw new Error('Failed to get user');
  }
};

/**
 * Update user profile
 */
export const updateUser = async (userId, updates) => {
  try {
    const userRef = db.collection(collections.USERS).doc(userId);

    await userRef.update({
      ...updates,
      updatedAt: new Date().toISOString(),
    });

    return {
      success: true,
      userId,
    };
  } catch (error) {
    console.error('Error updating user:', error);
    throw new Error('Failed to update user');
  }
};

/**
 * Get user statistics
 */
export const getUserStats = async (userId) => {
  try {
    // Get total interviews
    const interviewsSnapshot = await db
      .collection(collections.INTERVIEWS)
      .where('userId', '==', userId)
      .get();

    const interviews = interviewsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Calculate statistics
    const totalInterviews = interviews.length;
    const completedInterviews = interviews.filter(
      (i) => i.status === 'completed'
    ).length;

    // Calculate average scores
    const feedbackDocs = await Promise.all(
      interviews.map((interview) =>
        db
          .collection(collections.FEEDBACK)
          .where('interviewId', '==', interview.id)
          .get()
      )
    );

    const allFeedback = feedbackDocs.flatMap((snapshot) =>
      snapshot.docs.map((doc) => doc.data())
    );

    const avgOverallScore =
      allFeedback.length > 0
        ? allFeedback.reduce((sum, f) => sum + (f.overallScore || 0), 0) /
          allFeedback.length
        : 0;

    const avgTechnicalScore =
      allFeedback.length > 0
        ? allFeedback.reduce((sum, f) => sum + (f.technicalScore || 0), 0) /
          allFeedback.length
        : 0;

    // Calculate total practice time
    const totalTime = interviews.reduce((sum, interview) => {
      if (interview.startTime && interview.endTime) {
        const start = new Date(interview.startTime);
        const end = new Date(interview.endTime);
        return sum + (end - start) / (1000 * 60); // Convert to minutes
      }
      return sum;
    }, 0);

    return {
      totalInterviews,
      completedInterviews,
      avgOverallScore: Math.round(avgOverallScore),
      avgTechnicalScore: Math.round(avgTechnicalScore),
      totalPracticeTimeMinutes: Math.round(totalTime),
      totalPracticeTimeHours: Math.round(totalTime / 60),
    };
  } catch (error) {
    console.error('Error getting user stats:', error);
    throw new Error('Failed to get user statistics');
  }
};
