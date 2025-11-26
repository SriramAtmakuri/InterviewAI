export interface CustomQuestion {
  id: string;
  type: "behavioral" | "technical" | "system-design" | "coding";
  difficulty: "entry" | "mid" | "senior" | "lead";
  question: string;
  category: string;
  tags: string[];
  hint?: string;
  sampleAnswer?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface QuestionTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  questions: CustomQuestion[];
  isPublic: boolean;
  author: string;
  downloads: number;
  rating: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface TemplateStats {
  totalQuestions: number;
  behavioral: number;
  technical: number;
  systemDesign: number;
  coding: number;
}
