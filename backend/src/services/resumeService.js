import pdf from 'pdf-parse';
import mammoth from 'mammoth';
import { analyzeResume, parseJobDescription } from './geminiService.js';
import { storage } from '../config/firebase.js';
import { v4 as uuidv4 } from 'uuid';

/**
 * Extract text from PDF
 */
const extractTextFromPdf = async (buffer) => {
  try {
    const data = await pdf(buffer);
    return data.text;
  } catch (error) {
    throw new Error('Failed to extract text from PDF');
  }
};

/**
 * Extract text from DOCX
 */
const extractTextFromDocx = async (buffer) => {
  try {
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
  } catch (error) {
    throw new Error('Failed to extract text from DOCX');
  }
};

/**
 * Upload resume to Firebase Storage
 */
export const uploadResume = async (file, userId) => {
  try {
    const bucket = storage.bucket();
    const fileName = `resumes/${userId}/${uuidv4()}${file.originalname}`;

    const fileUpload = bucket.file(fileName);

    await fileUpload.save(file.buffer, {
      metadata: {
        contentType: file.mimetype,
        metadata: {
          userId,
          uploadedAt: new Date().toISOString(),
          originalName: file.originalname,
        },
      },
    });

    const [url] = await fileUpload.getSignedUrl({
      action: 'read',
      expires: Date.now() + 365 * 24 * 60 * 60 * 1000, // 1 year
    });

    return {
      success: true,
      url,
      fileName,
    };
  } catch (error) {
    console.error('Error uploading resume:', error);
    throw new Error('Failed to upload resume');
  }
};

/**
 * Parse resume and extract text
 */
export const parseResume = async (file) => {
  try {
    let text = '';

    if (file.mimetype === 'application/pdf') {
      text = await extractTextFromPdf(file.buffer);
    } else if (
      file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      file.mimetype === 'application/msword'
    ) {
      text = await extractTextFromDocx(file.buffer);
    } else if (file.mimetype === 'text/plain') {
      text = file.buffer.toString('utf-8');
    } else {
      throw new Error('Unsupported file format. Please upload PDF, DOCX, or TXT');
    }

    return {
      success: true,
      text,
    };
  } catch (error) {
    console.error('Error parsing resume:', error);
    throw error;
  }
};

/**
 * Analyze resume against job description
 */
export const analyzeResumeAgainstJD = async (resumeText, jobDescriptionText) => {
  try {
    // Parse job description first
    const parsedJD = await parseJobDescription(jobDescriptionText);

    // Analyze resume against JD
    const analysis = await analyzeResume(resumeText, jobDescriptionText);

    return {
      success: true,
      analysis,
      parsedJD,
    };
  } catch (error) {
    console.error('Error analyzing resume:', error);
    throw new Error('Failed to analyze resume');
  }
};

/**
 * Generate interview questions from resume
 */
export const generateQuestionsFromResume = async (resumeText, jobDescription) => {
  try {
    const analysis = await analyzeResume(resumeText, jobDescription);

    // Extract suggested questions from analysis
    const questions = analysis.suggestedInterviewQuestions || [];

    // Add questions based on missing skills
    const missingSkillsQuestions = (analysis.missingSkills || []).map(
      (skill) => `How would you approach learning ${skill} given your current background?`
    );

    // Add questions based on matched skills for deeper assessment
    const matchedSkillsQuestions = (analysis.matchedSkills || [])
      .slice(0, 3)
      .map(
        (skill) => `Can you describe a specific project where you used ${skill} and the impact it had?`
      );

    return {
      success: true,
      questions: [
        ...questions,
        ...missingSkillsQuestions.slice(0, 2),
        ...matchedSkillsQuestions,
      ],
      analysis,
    };
  } catch (error) {
    console.error('Error generating questions from resume:', error);
    throw new Error('Failed to generate questions from resume');
  }
};

/**
 * Extract skills from resume
 */
export const extractSkills = async (resumeText) => {
  try {
    const { getModel, models } = await import('../config/gemini.js');
    const model = getModel(models.FLASH);

    const prompt = `Extract all technical and soft skills from this resume:

${resumeText}

Return JSON format:
{
  "technicalSkills": [<array of technical skills>],
  "softSkills": [<array of soft skills>],
  "tools": [<array of tools and technologies>],
  "certifications": [<array of certifications>],
  "languages": [<array of programming languages>]
}`;

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
    });

    const responseText = result.response.text();
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);

    if (jsonMatch) {
      return {
        success: true,
        skills: JSON.parse(jsonMatch[0]),
      };
    }

    throw new Error('Failed to extract skills');
  } catch (error) {
    console.error('Error extracting skills:', error);
    throw new Error('Failed to extract skills from resume');
  }
};

/**
 * Get resume improvement suggestions
 */
export const getResumeSuggestions = async (resumeText) => {
  try {
    const { getModel, models } = await import('../config/gemini.js');
    const model = getModel(models.PRO);

    const prompt = `Analyze this resume and provide detailed improvement suggestions:

${resumeText}

Return JSON format:
{
  "overallScore": <number 0-100>,
  "strengths": [<array of strengths>],
  "weaknesses": [<array of weaknesses>],
  "suggestions": [
    {
      "category": "<category like 'Format', 'Content', 'Keywords'>",
      "issue": "<specific issue>",
      "recommendation": "<specific recommendation>",
      "priority": "<high|medium|low>"
    }
  ],
  "atsOptimization": [<array of ATS optimization tips>],
  "keywordsMissing": [<array of important keywords that are missing>]
}`;

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
    });

    const responseText = result.response.text();
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);

    if (jsonMatch) {
      return {
        success: true,
        suggestions: JSON.parse(jsonMatch[0]),
      };
    }

    throw new Error('Failed to get suggestions');
  } catch (error) {
    console.error('Error getting resume suggestions:', error);
    throw new Error('Failed to get resume suggestions');
  }
};

/**
 * Compare resume with successful profiles
 */
export const benchmarkResume = async (resumeText, targetRole) => {
  try {
    const { getModel, models } = await import('../config/gemini.js');
    const model = getModel(models.PRO);

    const prompt = `Compare this resume against typical requirements for a ${targetRole} position:

Resume:
${resumeText}

Return JSON format:
{
  "matchScore": <number 0-100>,
  "marketComparison": "<how it compares to market standards>",
  "experienceLevel": "<entry|mid|senior>",
  "recommendedRoles": [<array of suitable roles>],
  "gaps": [<array of skill/experience gaps>],
  "strengths": [<array of competitive advantages>],
  "salaryRange": "<estimated salary range based on experience>",
  "nextCareerSteps": [<array of career development suggestions>]
}`;

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
    });

    const responseText = result.response.text();
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);

    if (jsonMatch) {
      return {
        success: true,
        benchmark: JSON.parse(jsonMatch[0]),
      };
    }

    throw new Error('Failed to benchmark resume');
  } catch (error) {
    console.error('Error benchmarking resume:', error);
    throw new Error('Failed to benchmark resume');
  }
};
