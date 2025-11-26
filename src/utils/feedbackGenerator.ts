import type { Message, InterviewConfig, InterviewFeedback } from "@/types/interview";

/**
 * Analyzes interview messages and generates real-time feedback
 * This generates intelligent feedback based on actual conversation
 * When Gemini API is added, this will be replaced with AI analysis
 */
export function generateFeedback(
  messages: Message[],
  config: InterviewConfig
): InterviewFeedback {
  // Filter to get only user messages (exclude AI questions)
  const userMessages = messages.filter(m => m.role === "user");

  if (userMessages.length === 0) {
    // No answers provided
    return {
      overallScore: 0,
      technicalScore: 0,
      communicationScore: 0,
      problemSolvingScore: 0,
      strengths: ["Session started but no answers provided"],
      improvements: ["Complete the interview to receive feedback"],
      detailedAnalysis: "No responses were recorded during this session."
    };
  }

  // Calculate scores based on answer quality
  const scores = analyzeAnswers(userMessages, config);

  // Generate strengths based on what they did well
  const strengths = generateStrengths(userMessages, scores);

  // Generate improvements based on gaps
  const improvements = generateImprovements(userMessages, scores, config);

  // Generate detailed analysis
  const detailedAnalysis = generateDetailedAnalysis(userMessages, scores, config);

  return {
    overallScore: scores.overall,
    technicalScore: scores.technical,
    communicationScore: scores.communication,
    problemSolvingScore: scores.problemSolving,
    strengths,
    improvements,
    detailedAnalysis
  };
}

interface Scores {
  overall: number;
  technical: number;
  communication: number;
  problemSolving: number;
}

function analyzeAnswers(userMessages: Message[], config: InterviewConfig): Scores {
  let technicalScore = 50; // Base score
  let communicationScore = 50;
  let problemSolvingScore = 50;

  userMessages.forEach(msg => {
    const content = msg.content.toLowerCase();
    const wordCount = msg.content.split(/\s+/).length;

    // Communication scoring
    if (wordCount > 50) communicationScore += 10; // Detailed answers
    if (wordCount < 20) communicationScore -= 5; // Too brief
    if (content.includes("example") || content.includes("instance")) communicationScore += 5;
    if (content.includes("specifically") || content.includes("particular")) communicationScore += 5;

    // Technical scoring (based on technical keywords)
    const technicalKeywords = [
      "api", "database", "algorithm", "architecture", "design", "performance",
      "scalability", "security", "testing", "deployment", "code", "function",
      "system", "data", "service", "interface", "implementation", "optimization"
    ];
    const technicalMatches = technicalKeywords.filter(kw => content.includes(kw)).length;
    technicalScore += Math.min(technicalMatches * 3, 30);

    // Problem solving scoring
    if (content.includes("approach") || content.includes("solution")) problemSolvingScore += 8;
    if (content.includes("consider") || content.includes("analyze")) problemSolvingScore += 5;
    if (content.includes("trade-off") || content.includes("pros and cons")) problemSolvingScore += 10;
    if (content.includes("step") || content.includes("first") || content.includes("then")) problemSolvingScore += 7;
  });

  // Cap scores at 100
  technicalScore = Math.min(Math.max(technicalScore, 40), 95);
  communicationScore = Math.min(Math.max(communicationScore, 40), 95);
  problemSolvingScore = Math.min(Math.max(problemSolvingScore, 40), 95);

  const overall = Math.round((technicalScore + communicationScore + problemSolvingScore) / 3);

  return {
    overall,
    technical: Math.round(technicalScore),
    communication: Math.round(communicationScore),
    problemSolving: Math.round(problemSolvingScore)
  };
}

function generateStrengths(userMessages: Message[], scores: Scores): string[] {
  const strengths: string[] = [];
  const totalWords = userMessages.reduce((sum, msg) =>
    sum + msg.content.split(/\s+/).length, 0
  );
  const avgWords = totalWords / userMessages.length;

  // Based on communication score
  if (scores.communication >= 75) {
    strengths.push("Clear and articulate communication throughout the interview");
  }
  if (avgWords > 50) {
    strengths.push("Provided detailed and comprehensive answers");
  }
  if (userMessages.some(m => m.content.toLowerCase().includes("example"))) {
    strengths.push("Effectively used examples to illustrate points");
  }

  // Based on technical score
  if (scores.technical >= 75) {
    strengths.push("Demonstrated solid technical knowledge");
  }
  if (userMessages.some(m => m.content.toLowerCase().includes("experience"))) {
    strengths.push("Drew from relevant past experience");
  }

  // Based on problem solving
  if (scores.problemSolving >= 75) {
    strengths.push("Showed good problem-solving methodology");
  }
  if (userMessages.some(m => m.content.toLowerCase().includes("approach"))) {
    strengths.push("Clearly explained your approach to problems");
  }

  // Ensure at least 3 strengths
  if (strengths.length < 3) {
    strengths.push("Engaged actively with the interview process");
    strengths.push("Answered all questions posed");
  }

  return strengths.slice(0, 5); // Max 5 strengths
}

function generateImprovements(userMessages: Message[], scores: Scores, config: InterviewConfig): string[] {
  const improvements: string[] = [];
  const totalWords = userMessages.reduce((sum, msg) =>
    sum + msg.content.split(/\s+/).length, 0
  );
  const avgWords = totalWords / userMessages.length;

  // Based on scores
  if (scores.technical < 70) {
    improvements.push("Include more technical details and specific terminology");
  }
  if (scores.communication < 70) {
    improvements.push("Provide more structured and detailed responses");
  }
  if (scores.problemSolving < 70) {
    improvements.push("Explain your thought process and approach more clearly");
  }

  // Based on answer quality
  if (avgWords < 30) {
    improvements.push("Expand on your answers with more depth and examples");
  }
  if (!userMessages.some(m => m.content.toLowerCase().includes("metric") ||
                            m.content.toLowerCase().includes("number"))) {
    improvements.push("Include quantifiable metrics and results when possible");
  }
  if (!userMessages.some(m => m.content.toLowerCase().includes("challenge") ||
                            m.content.toLowerCase().includes("difficult"))) {
    improvements.push("Discuss challenges faced and how you overcame them");
  }

  // Type-specific improvements
  if (config.type === "technical" && !userMessages.some(m =>
    m.content.toLowerCase().includes("trade-off"))) {
    improvements.push("Consider discussing trade-offs in your technical decisions");
  }
  if (config.type === "behavioral" && !userMessages.some(m =>
    m.content.toLowerCase().includes("team"))) {
    improvements.push("Highlight team collaboration and interpersonal skills");
  }

  // Ensure at least 3 improvements
  if (improvements.length < 3) {
    improvements.push("Practice answering with the STAR method (Situation, Task, Action, Result)");
  }

  return improvements.slice(0, 5); // Max 5 improvements
}

function generateDetailedAnalysis(userMessages: Message[], scores: Scores, config: InterviewConfig): string {
  const answerCount = userMessages.length;
  const totalWords = userMessages.reduce((sum, msg) =>
    sum + msg.content.split(/\s+/).length, 0
  );
  const avgWords = Math.round(totalWords / answerCount);

  let analysis = `Interview Analysis for ${config.jobTitle} position:\n\n`;

  // Overall performance
  if (scores.overall >= 80) {
    analysis += "Strong performance overall. ";
  } else if (scores.overall >= 60) {
    analysis += "Solid performance with room for growth. ";
  } else {
    analysis += "This interview showed potential but needs more practice. ";
  }

  // Answer quality
  analysis += `You provided ${answerCount} response${answerCount > 1 ? 's' : ''} with an average of ${avgWords} words per answer. `;

  if (avgWords > 50) {
    analysis += "Your responses were detailed and thorough. ";
  } else if (avgWords < 30) {
    analysis += "Consider providing more detailed responses with specific examples. ";
  }

  // Technical assessment
  if (scores.technical >= 75) {
    analysis += "\n\nYour technical knowledge appears solid. ";
  } else {
    analysis += "\n\nFocus on deepening your technical knowledge and using more specific terminology. ";
  }

  // Communication assessment
  if (scores.communication >= 75) {
    analysis += "Communication skills were clear and effective. ";
  } else {
    analysis += "Work on structuring your answers more clearly and providing concrete examples. ";
  }

  // Problem solving assessment
  if (scores.problemSolving >= 75) {
    analysis += "Your problem-solving approach was methodical and well-explained. ";
  } else {
    analysis += "Try to articulate your thought process more clearly when tackling problems. ";
  }

  // Recommendations
  analysis += "\n\nRecommendations for improvement:\n";
  analysis += "1. Use the STAR method (Situation, Task, Action, Result) for behavioral questions\n";
  analysis += "2. Include specific metrics and quantifiable results\n";
  analysis += "3. Practice explaining technical concepts clearly to non-technical audiences\n";

  if (config.type === "coding") {
    analysis += "4. Discuss time and space complexity when solving coding problems\n";
  } else if (config.type === "system-design") {
    analysis += "4. Consider scalability, reliability, and trade-offs in your designs\n";
  }

  return analysis;
}
