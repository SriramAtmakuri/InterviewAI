export interface TestCase {
  input: string;
  expectedOutput: string;
  explanation?: string;
  hidden?: boolean; // Hidden test cases not shown to user
}

export interface Constraint {
  description: string;
  example?: string;
}

export interface Example {
  input: string;
  output: string;
  explanation: string;
}

export interface CodeTemplate {
  language: string;
  code: string;
}

export interface CodingProblem {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string[];
  description: string;
  examples: Example[];
  constraints: Constraint[];
  testCases: TestCase[];
  hints: string[];
  starterCode: CodeTemplate[];
  solution?: {
    approach: string;
    complexity: {
      time: string;
      space: string;
    };
    code: CodeTemplate[];
  };
  companies?: string[]; // Companies that ask this question
  acceptanceRate?: number;
  totalAttempts?: number;
  totalAccepted?: number;
  relatedTopics?: string[];
  relatedProblems?: string[];
}

export interface ProblemSubmission {
  problemId: string;
  userId: string;
  code: string;
  language: string;
  status: 'Accepted' | 'Wrong Answer' | 'Time Limit Exceeded' | 'Runtime Error' | 'Compilation Error';
  runtime?: number;
  memory?: number;
  testCasesPassed?: number;
  totalTestCases?: number;
  submittedAt: Date;
  feedback?: string;
}

export interface ProblemStats {
  problemId: string;
  difficulty: string;
  attempts: number;
  solved: boolean;
  lastAttemptDate?: Date;
  bestRuntime?: number;
  bestMemory?: number;
}
