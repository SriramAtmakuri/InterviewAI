// Real code execution using Piston API (free and open-source)
// Supports 50+ languages running in isolated containers

export interface TestCase {
  input: string;
  expectedOutput: string;
  description?: string;
}

export interface ExecutionResult {
  success: boolean;
  output: string;
  error?: string;
  executionTime?: number;
  testResults?: Array<{
    passed: boolean;
    description: string;
    expected: string;
    actual: string;
  }>;
}

const PISTON_API = 'https://emkc.org/api/v2/piston';

// Popular languages supported by Piston API
const LANGUAGE_MAP: Record<string, { language: string; version: string }> = {
  javascript: { language: 'javascript', version: '18.15.0' },
  typescript: { language: 'typescript', version: '5.0.3' },
  python: { language: 'python', version: '3.10.0' },
  java: { language: 'java', version: '15.0.2' },
  cpp: { language: 'c++', version: '10.2.0' },
  c: { language: 'c', version: '10.2.0' },
  csharp: { language: 'csharp', version: '6.12.0' },
  go: { language: 'go', version: '1.16.2' },
  rust: { language: 'rust', version: '1.68.2' },
  php: { language: 'php', version: '8.2.3' },
  ruby: { language: 'ruby', version: '3.0.1' },
  swift: { language: 'swift', version: '5.3.3' },
  kotlin: { language: 'kotlin', version: '1.8.20' },
  scala: { language: 'scala', version: '3.2.2' },
  r: { language: 'r', version: '4.1.1' },
  perl: { language: 'perl', version: '5.36.0' },
  haskell: { language: 'haskell', version: '9.0.1' },
  bash: { language: 'bash', version: '5.2.0' },
  powershell: { language: 'powershell', version: '7.1.4' },
  sqlite: { language: 'sqlite3', version: '3.36.0' },
  mysql: { language: 'sqlite3', version: '3.36.0' },
  postgresql: { language: 'sqlite3', version: '3.36.0' },
  mssql: { language: 'sqlite3', version: '3.36.0' },
  oracle: { language: 'sqlite3', version: '3.36.0' },
  matlab: { language: 'octave', version: '6.2.0' },
};

export async function executeCode(
  code: string,
  language: string,
  testCases?: TestCase[]
): Promise<ExecutionResult> {
  try {
    const runtime = LANGUAGE_MAP[language.toLowerCase()];
    if (!runtime) {
      return {
        success: false,
        output: '',
        error: `Unsupported language: ${language}`,
      };
    }

    if (!testCases || testCases.length === 0) {
      return await executeSingleRun(code, runtime);
    }

    return await executeWithTests(code, language, runtime, testCases);
  } catch (error: any) {
    return {
      success: false,
      output: '',
      error: `Execution error: ${error.message}`,
    };
  }
}

async function executeSingleRun(
  code: string,
  runtime: { language: string; version: string }
): Promise<ExecutionResult> {
  const startTime = Date.now();

  try {
    const response = await fetch(`${PISTON_API}/execute`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        language: runtime.language,
        version: runtime.version,
        files: [{ content: code }],
        stdin: '',
        args: [],
        compile_timeout: 10000,
        run_timeout: 3000,
      }),
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    const result = await response.json();
    const executionTime = Date.now() - startTime;

    if (result.compile && result.compile.code !== 0) {
      return {
        success: false,
        output: result.compile.output || '',
        error: `Compilation error: ${result.compile.stderr || result.compile.output}`,
        executionTime,
      };
    }

    if (result.run.code !== 0) {
      return {
        success: false,
        output: result.run.stdout || '',
        error: `Runtime error: ${result.run.stderr || 'Program exited with non-zero code'}`,
        executionTime,
      };
    }

    return {
      success: true,
      output: result.run.stdout || result.run.output || 'Code executed successfully',
      executionTime,
    };
  } catch (error: any) {
    return {
      success: false,
      output: '',
      error: `Network error: ${error.message}`,
    };
  }
}

async function executeWithTests(
  code: string,
  language: string,
  runtime: { language: string; version: string },
  testCases: TestCase[]
): Promise<ExecutionResult> {
  const testResults = [];
  let allPassed = true;

  for (const testCase of testCases) {
    const testCode = wrapCodeWithTest(code, language, testCase);
    const result = await executeSingleRun(testCode, runtime);

    const actualOutput = result.output.trim();
    const expectedOutput = testCase.expectedOutput.trim();
    const passed = actualOutput === expectedOutput && result.success;

    testResults.push({
      passed,
      description: testCase.description || `Test with input: ${testCase.input}`,
      expected: expectedOutput,
      actual: actualOutput,
    });

    if (!passed) allPassed = false;
  }

  const passedCount = testResults.filter(t => t.passed).length;
  const totalCount = testResults.length;

  return {
    success: allPassed,
    output: `Test Results: ${passedCount}/${totalCount} passed\n\n${testResults
      .map((t, i) => `Test ${i + 1}: ${t.passed ? '✓ PASS' : '✗ FAIL'}\n  ${t.description}\n  Expected: ${t.expected}\n  Actual: ${t.actual}`)
      .join('\n\n')}`,
    testResults,
  };
}

function wrapCodeWithTest(code: string, language: string, testCase: TestCase): string {
  if (language === 'javascript' || language === 'typescript') {
    const funcMatch = code.match(/function\s+(\w+)/);
    const funcName = funcMatch ? funcMatch[1] : 'solution';
    return `${code}\n\nconsole.log(${funcName}(${testCase.input}));`;
  }

  if (language === 'python') {
    const funcMatch = code.match(/def\s+(\w+)/);
    const funcName = funcMatch ? funcMatch[1] : 'solution';
    return `${code}\n\nprint(${funcName}(${testCase.input}))`;
  }

  return code;
}

export function validateCode(code: string, language: string): { valid: boolean; error?: string } {
  if (!code || code.trim().length === 0) {
    return { valid: false, error: 'Code cannot be empty' };
  }

  const runtime = LANGUAGE_MAP[language.toLowerCase()];
  if (!runtime) {
    return { valid: false, error: `Unsupported language: ${language}` };
  }

  if (language === 'javascript' || language === 'typescript') {
    const openBraces = (code.match(/{/g) || []).length;
    const closeBraces = (code.match(/}/g) || []).length;
    if (openBraces !== closeBraces) {
      return { valid: false, error: 'Syntax error: Mismatched braces' };
    }
  }

  return { valid: true };
}

export function getAllSupportedLanguages(): Array<{id: string; name: string; popular?: boolean}> {
  return [
    { id: 'javascript', name: 'JavaScript', popular: true },
    { id: 'typescript', name: 'TypeScript', popular: true },
    { id: 'python', name: 'Python', popular: true },
    { id: 'java', name: 'Java', popular: true },
    { id: 'cpp', name: 'C++', popular: true },
    { id: 'c', name: 'C', popular: true },
    { id: 'csharp', name: 'C#', popular: true },
    { id: 'go', name: 'Go', popular: true },
    { id: 'rust', name: 'Rust', popular: true },
    { id: 'php', name: 'PHP', popular: true },
    { id: 'ruby', name: 'Ruby' },
    { id: 'swift', name: 'Swift' },
    { id: 'kotlin', name: 'Kotlin' },
    { id: 'scala', name: 'Scala' },
    { id: 'r', name: 'R' },
    { id: 'perl', name: 'Perl' },
    { id: 'haskell', name: 'Haskell' },
    { id: 'bash', name: 'Bash' },
    { id: 'powershell', name: 'PowerShell' },
    { id: 'sqlite', name: 'SQLite' },
    { id: 'mysql', name: 'MySQL' },
    { id: 'postgresql', name: 'PostgreSQL' },
    { id: 'mssql', name: 'MS SQL Server' },
    { id: 'oracle', name: 'Oracle SQL' },
    { id: 'matlab', name: 'MATLAB (Octave)' },
  ];
}