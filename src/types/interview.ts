export type InterviewType = "behavioral" | "technical" | "system-design" | "coding";
export type DifficultyLevel = "entry" | "mid" | "senior" | "lead";
export type InterviewMode = "standard" | "practice" | "speed";

export interface InterviewConfig {
  jobTitle: string;
  company: string;
  type: InterviewType;
  difficulty: DifficultyLevel;
  duration: number; // in minutes
  mode?: InterviewMode; // Interview mode
}

export interface Message {
  id: string;
  role: "ai" | "user";
  content: string;
  timestamp: Date;
  codeSnippet?: string;
}

export interface InterviewSession {
  id: string;
  config: InterviewConfig;
  messages: Message[];
  startTime: Date;
  endTime?: Date;
  feedback?: InterviewFeedback;
  status: "in-progress" | "completed";
}

export interface InterviewFeedback {
  overallScore: number;
  strengths: string[];
  improvements: string[];
  technicalScore: number;
  communicationScore: number;
  problemSolvingScore: number;
  detailedAnalysis: string;
}
