import { GEMINI_API_KEY, GEMINI_API_URL, isGeminiConfigured } from '@/config/gemini';

export interface AIValidationResult {
  isCorrect: boolean;
  explanation: string;
  testCases: Array<{
    input: string;
    expectedOutput: string;
    description: string;
  }>;
  suggestions?: string[];
}

/**
 * Uses Gemini AI to validate if the code solution matches the question requirements
 */
export async function validateCodeWithAI(
  question: string,
  code: string,
  language: string
): Promise<AIValidationResult> {
  if (!isGeminiConfigured()) {
    return {
      isCorrect: false,
      explanation: 'AI validation not configured. Add VITE_GEMINI_API_KEY to your .env file.',
      testCases: [],
    };
  }

  try {
    const prompt = `You are a coding interview expert. Analyze if the following code correctly solves the given problem.

**Question:**
${question}

**Programming Language:** ${language}

**User's Code:**
\`\`\`${language}
${code}
\`\`\`

Please analyze:
1. Does this code solve the problem described in the question?
2. Are there any logical errors or bugs?
3. Generate 3-5 test cases to validate the solution

Respond in the following JSON format:
{
  "isCorrect": true/false,
  "explanation": "Brief explanation of whether the code solves the problem",
  "testCases": [
    {
      "input": "test input",
      "expectedOutput": "expected result",
      "description": "what this test case validates"
    }
  ],
  "suggestions": ["optional improvement suggestions"]
}`;

    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.3,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048,
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Gemini API error: ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();
    const textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!textResponse) {
      throw new Error('No response from Gemini API');
    }

    // Extract JSON from response (handle markdown code blocks)
    let jsonText = textResponse.trim();
    if (jsonText.startsWith('```json')) {
      jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    } else if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/```\n?/g, '');
    }

    const result: AIValidationResult = JSON.parse(jsonText);
    return result;
  } catch (error: any) {
    console.error('AI validation error:', error);
    return {
      isCorrect: false,
      explanation: `AI validation failed: ${error.message}`,
      testCases: [],
    };
  }
}

/**
 * Generate test cases from a question using AI
 */
export async function generateTestCases(
  question: string,
  language: string,
  count: number = 5
): Promise<Array<{ input: string; expectedOutput: string; description: string }>> {
  if (!isGeminiConfigured()) {
    return [];
  }

  try {
    const prompt = `Generate ${count} test cases for the following coding problem:

**Question:**
${question}

**Programming Language:** ${language}

Generate diverse test cases including:
- Basic cases
- Edge cases
- Corner cases

Respond in JSON format:
{
  "testCases": [
    {
      "input": "function argument(s) as they would be called",
      "expectedOutput": "expected return value",
      "description": "what this test validates"
    }
  ]
}`;

    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.4,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.statusText}`);
    }

    const data = await response.json();
    const textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!textResponse) {
      return [];
    }

    // Extract JSON from response
    let jsonText = textResponse.trim();
    if (jsonText.startsWith('```json')) {
      jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    } else if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/```\n?/g, '');
    }

    const result = JSON.parse(jsonText);
    return result.testCases || [];
  } catch (error: any) {
    console.error('Test case generation error:', error);
    return [];
  }
}
