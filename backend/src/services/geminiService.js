import { getModel, interviewConfig, codeAnalysisConfig, resumeAnalysisConfig, models } from '../config/gemini.js';

/**
 * Generate intelligent interview questions based on context
 */
export const generateInterviewQuestion = async (context) => {
  try {
    const model = getModel(models.FLASH);

    const prompt = `You are an expert technical interviewer. Generate the next interview question based on:

Job Details:
- Position: ${context.jobTitle}
- Company: ${context.company}
- Type: ${context.type}
- Difficulty: ${context.difficulty}

${context.jobDescription ? `Job Description: ${context.jobDescription}` : ''}

Previous Conversation:
${context.conversationHistory ? context.conversationHistory.map(msg => `${msg.role}: ${msg.content}`).join('\n') : 'None'}

${context.userAnswer ? `Candidate's Last Answer: ${context.userAnswer}` : ''}

Generate a relevant, insightful follow-up question. The question should:
1. Be appropriate for the ${context.type} interview type
2. Match the ${context.difficulty} difficulty level
3. Build upon previous answers if available
4. Be specific to the role and requirements
5. Test both knowledge and practical application

Return ONLY the question, no additional explanation.`;

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: interviewConfig,
    });

    return result.response.text();
  } catch (error) {
    console.error('Error generating interview question:', error);
    throw new Error('Failed to generate interview question');
  }
};

/**
 * Analyze candidate's answer and provide feedback
 */
export const analyzeAnswer = async (question, answer, context) => {
  try {
    const model = getModel(models.PRO);

    const prompt = `You are an expert technical interviewer analyzing a candidate's response.

Interview Context:
- Position: ${context.jobTitle}
- Type: ${context.type}
- Difficulty: ${context.difficulty}

Question: ${question}

Candidate's Answer: ${answer}

Provide a comprehensive analysis in JSON format:
{
  "score": <number 0-100>,
  "strengths": [<array of strengths>],
  "weaknesses": [<array of areas for improvement>],
  "feedback": "<detailed constructive feedback>",
  "followUpSuggestions": [<array of suggested follow-up questions>],
  "technicalAccuracy": <number 0-100>,
  "communicationClarity": <number 0-100>,
  "depth": <number 0-100>
}

Be fair, constructive, and specific in your analysis.`;

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: interviewConfig,
    });

    const responseText = result.response.text();

    // Extract JSON from response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }

    throw new Error('Invalid response format');
  } catch (error) {
    console.error('Error analyzing answer:', error);
    throw new Error('Failed to analyze answer');
  }
};

/**
 * Analyze code submission
 */
export const analyzeCode = async (code, problem, language) => {
  try {
    const model = getModel(models.PRO);

    const prompt = `You are an expert code reviewer. Analyze this code submission:

Programming Language: ${language}

Problem Statement: ${problem}

Submitted Code:
\`\`\`${language}
${code}
\`\`\`

Provide a detailed analysis in JSON format:
{
  "correctness": <number 0-100>,
  "efficiency": <number 0-100>,
  "codeQuality": <number 0-100>,
  "timeComplexity": "<Big O notation>",
  "spaceComplexity": "<Big O notation>",
  "strengths": [<array of strengths>],
  "improvements": [<array of specific improvements>],
  "bugs": [<array of bugs or issues>],
  "suggestions": "<detailed suggestions for improvement>",
  "overallScore": <number 0-100>
}

Be thorough and provide actionable feedback.`;

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: codeAnalysisConfig,
    });

    const responseText = result.response.text();
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);

    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }

    throw new Error('Invalid response format');
  } catch (error) {
    console.error('Error analyzing code:', error);
    throw new Error('Failed to analyze code');
  }
};

/**
 * Generate comprehensive interview feedback
 */
export const generateInterviewFeedback = async (interviewData) => {
  try {
    const model = getModel(models.PRO);

    const prompt = `You are an expert career coach providing comprehensive interview feedback.

Interview Details:
- Position: ${interviewData.jobTitle}
- Company: ${interviewData.company}
- Type: ${interviewData.type}
- Duration: ${interviewData.duration} minutes

Conversation Transcript:
${interviewData.messages.map((msg, idx) => `${idx + 1}. ${msg.role}: ${msg.content}`).join('\n')}

${interviewData.codeSubmissions ? `Code Submissions: ${interviewData.codeSubmissions.length}` : ''}

Provide comprehensive feedback in JSON format:
{
  "overallScore": <number 0-100>,
  "technicalScore": <number 0-100>,
  "communicationScore": <number 0-100>,
  "problemSolvingScore": <number 0-100>,
  "strengths": [<array of 3-5 specific strengths>],
  "improvements": [<array of 3-5 specific areas for improvement>],
  "detailedAnalysis": "<comprehensive analysis paragraph>",
  "recommendedNextSteps": [<array of actionable next steps>],
  "comparedToMarket": "<how candidate compares to market standards>"
}

Be honest, constructive, and specific with examples from the interview.`;

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: interviewConfig,
    });

    const responseText = result.response.text();
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);

    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }

    throw new Error('Invalid response format');
  } catch (error) {
    console.error('Error generating feedback:', error);
    throw new Error('Failed to generate feedback');
  }
};

/**
 * Analyze resume against job description
 */
export const analyzeResume = async (resumeText, jobDescription) => {
  try {
    const model = getModel(models.PRO);

    const prompt = `You are an expert ATS (Applicant Tracking System) and career advisor. Analyze this resume against the job description.

Job Description:
${jobDescription}

Resume:
${resumeText}

Provide a comprehensive analysis in JSON format:
{
  "atsScore": <number 0-100>,
  "matchPercentage": <number 0-100>,
  "matchedSkills": [<array of skills that match>],
  "missingSkills": [<array of skills mentioned in JD but missing in resume>],
  "strengths": [<array of resume strengths>],
  "weaknesses": [<array of resume weaknesses>],
  "recommendations": [<array of specific recommendations>],
  "suggestedInterviewQuestions": [<array of 5-7 interview questions based on gaps>],
  "keywordsFound": <number of JD keywords found>,
  "keywordsTotal": <total keywords in JD>,
  "summary": "<brief summary of the match>"
}

Be thorough and provide actionable insights.`;

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: resumeAnalysisConfig,
    });

    const responseText = result.response.text();
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);

    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }

    throw new Error('Invalid response format');
  } catch (error) {
    console.error('Error analyzing resume:', error);
    throw new Error('Failed to analyze resume');
  }
};

/**
 * Parse and extract text from job description
 */
export const parseJobDescription = async (jdText) => {
  try {
    const model = getModel(models.FLASH);

    const prompt = `Extract structured information from this job description:

${jdText}

Return JSON format:
{
  "title": "<job title>",
  "company": "<company name if mentioned>",
  "requiredSkills": [<array of required skills>],
  "preferredSkills": [<array of preferred skills>],
  "experience": "<experience level>",
  "responsibilities": [<array of key responsibilities>],
  "techStack": [<array of technologies>],
  "educationRequired": "<education requirements>",
  "keywords": [<array of important keywords for ATS>]
}`;

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: resumeAnalysisConfig,
    });

    const responseText = result.response.text();
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);

    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }

    throw new Error('Invalid response format');
  } catch (error) {
    console.error('Error parsing job description:', error);
    throw new Error('Failed to parse job description');
  }
};
