import { createUser, getUser, updateUser, getUserStats } from '../models/userModel.js';

/**
 * Get or create user profile
 */
export const getProfile = async (req, res) => {
  try {
    const userId = req.user.uid;

    let user = await getUser(userId);

    // If user doesn't exist, create one
    if (!user) {
      await createUser(userId, {
        email: req.user.email,
        emailVerified: req.user.emailVerified,
      });

      user = await getUser(userId);
    }

    res.json({
      success: true,
      user,
    });
  } catch (error) {
    console.error('Error getting profile:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

/**
 * Update user profile
 */
export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.uid;
    const updates = req.body;

    // Don't allow updating certain fields
    delete updates.createdAt;
    delete updates.email;

    await updateUser(userId, updates);

    const user = await getUser(userId);

    res.json({
      success: true,
      user,
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

/**
 * Get user statistics
 */
export const getStats = async (req, res) => {
  try {
    const userId = req.user.uid;

    const stats = await getUserStats(userId);

    res.json({
      success: true,
      stats,
    });
  } catch (error) {
    console.error('Error getting stats:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
