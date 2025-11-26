import {
  createInterview,
  getInterview,
  getUserInterviews,
  updateInterview,
  addMessage,
  completeInterview,
  saveFeedback,
  getFeedback,
  saveCodeSubmission,
  getCodeSubmissions,
} from '../models/interviewModel.js';
import {
  generateInterviewQuestion,
  analyzeAnswer,
  generateInterviewFeedback,
} from '../services/geminiService.js';

/**
 * Start new interview
 */
export const startInterview = async (req, res) => {
  try {
    const { jobTitle, company, type, difficulty, jobDescription } = req.body;
    const userId = req.user.uid;

    if (!jobTitle || !company || !type || !difficulty) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
      });
    }

    // Create interview in database
    const result = await createInterview(userId, {
      jobTitle,
      company,
      type,
      difficulty,
      jobDescription,
      startTime: new Date().toISOString(),
      messages: [],
    });

    // Generate first question
    const firstQuestion = await generateInterviewQuestion({
      jobTitle,
      company,
      type,
      difficulty,
      jobDescription,
    });

    // Add first question to messages
    await addMessage(result.interviewId, {
      role: 'ai',
      content: firstQuestion,
    });

    res.status(201).json({
      success: true,
      interviewId: result.interviewId,
      firstQuestion,
    });
  } catch (error) {
    console.error('Error starting interview:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

/**
 * Send message in interview
 */
export const sendMessage = async (req, res) => {
  try {
    const { interviewId } = req.params;
    const { message } = req.body;
    const userId = req.user.uid;

    if (!message) {
      return res.status(400).json({
        success: false,
        error: 'Message is required',
      });
    }

    // Get interview
    const interview = await getInterview(interviewId);

    if (!interview) {
      return res.status(404).json({
        success: false,
        error: 'Interview not found',
      });
    }

    if (interview.userId !== userId) {
      return res.status(403).json({
        success: false,
        error: 'Unauthorized',
      });
    }

    // Add user message
    await addMessage(interviewId, {
      role: 'user',
      content: message,
    });

    // Get conversation history
    const conversationHistory = interview.messages || [];

    // Analyze answer if there was a previous question
    let analysis = null;
    if (conversationHistory.length > 0) {
      const lastAiMessage = [...conversationHistory]
        .reverse()
        .find((m) => m.role === 'ai');

      if (lastAiMessage) {
        analysis = await analyzeAnswer(lastAiMessage.content, message, {
          jobTitle: interview.jobTitle,
          type: interview.type,
          difficulty: interview.difficulty,
        });
      }
    }

    // Generate next question
    const nextQuestion = await generateInterviewQuestion({
      jobTitle: interview.jobTitle,
      company: interview.company,
      type: interview.type,
      difficulty: interview.difficulty,
      jobDescription: interview.jobDescription,
      conversationHistory: [...conversationHistory, { role: 'user', content: message }],
      userAnswer: message,
    });

    // Add AI response
    await addMessage(interviewId, {
      role: 'ai',
      content: nextQuestion,
    });

    res.json({
      success: true,
      nextQuestion,
      analysis,
    });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

/**
 * End interview and generate feedback
 */
export const endInterview = async (req, res) => {
  try {
    const { interviewId } = req.params;
    const userId = req.user.uid;

    // Get interview
    const interview = await getInterview(interviewId);

    if (!interview) {
      return res.status(404).json({
        success: false,
        error: 'Interview not found',
      });
    }

    if (interview.userId !== userId) {
      return res.status(403).json({
        success: false,
        error: 'Unauthorized',
      });
    }

    if (interview.status === 'completed') {
      return res.status(400).json({
        success: false,
        error: 'Interview already completed',
      });
    }

    // Calculate duration
    const startTime = new Date(interview.startTime);
    const endTime = new Date();
    const duration = Math.floor((endTime - startTime) / (1000 * 60)); // minutes

    // Get code submissions if any
    const codeSubmissions = await getCodeSubmissions(interviewId);

    // Generate comprehensive feedback
    const feedback = await generateInterviewFeedback({
      jobTitle: interview.jobTitle,
      company: interview.company,
      type: interview.type,
      difficulty: interview.difficulty,
      duration,
      messages: interview.messages || [],
      codeSubmissions,
    });

    // Save feedback
    await saveFeedback(interviewId, feedback);

    // Complete interview
    await completeInterview(interviewId, {
      duration,
    });

    res.json({
      success: true,
      feedback,
    });
  } catch (error) {
    console.error('Error ending interview:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

/**
 * Get interview details
 */
export const getInterviewDetails = async (req, res) => {
  try {
    const { interviewId } = req.params;
    const userId = req.user.uid;

    const interview = await getInterview(interviewId);

    if (!interview) {
      return res.status(404).json({
        success: false,
        error: 'Interview not found',
      });
    }

    if (interview.userId !== userId) {
      return res.status(403).json({
        success: false,
        error: 'Unauthorized',
      });
    }

    // Get feedback if available
    const feedback = await getFeedback(interviewId);

    res.json({
      success: true,
      interview: {
        ...interview,
        feedback,
      },
    });
  } catch (error) {
    console.error('Error getting interview details:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

/**
 * Get user's interview history
 */
export const getHistory = async (req, res) => {
  try {
    const userId = req.user.uid;
    const { limit = 50 } = req.query;

    const interviews = await getUserInterviews(userId, parseInt(limit));

    // Get feedback for each interview
    const interviewsWithFeedback = await Promise.all(
      interviews.map(async (interview) => {
        const feedback = await getFeedback(interview.id);
        return {
          ...interview,
          feedback,
        };
      })
    );

    res.json({
      success: true,
      interviews: interviewsWithFeedback,
    });
  } catch (error) {
    console.error('Error getting history:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
