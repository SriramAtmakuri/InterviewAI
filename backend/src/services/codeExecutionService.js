import { exec } from 'child_process';
import { promisify } from 'util';
import { writeFile, unlink, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const execPromise = promisify(exec);

// Temporary directory for code execution
const TEMP_DIR = path.join(process.cwd(), 'temp');

// Ensure temp directory exists
if (!existsSync(TEMP_DIR)) {
  await mkdir(TEMP_DIR, { recursive: true });
}

/**
 * Language configurations
 */
const languageConfigs = {
  javascript: {
    extension: 'js',
    command: (file) => `node ${file}`,
    timeout: 10000,
  },
  python: {
    extension: 'py',
    command: (file) => `python3 ${file}`,
    timeout: 10000,
  },
  java: {
    extension: 'java',
    compile: (file) => `javac ${file}`,
    command: (file) => {
      const className = path.basename(file, '.java');
      return `java -cp ${path.dirname(file)} ${className}`;
    },
    timeout: 15000,
  },
  cpp: {
    extension: 'cpp',
    compile: (file, output) => `g++ ${file} -o ${output}`,
    command: (output) => `./${output}`,
    timeout: 15000,
  },
  c: {
    extension: 'c',
    compile: (file, output) => `gcc ${file} -o ${output}`,
    command: (output) => `./${output}`,
    timeout: 15000,
  },
};

/**
 * Sanitize code to prevent malicious operations
 */
const sanitizeCode = (code, language) => {
  // Basic security checks
  const dangerousPatterns = {
    javascript: [
      /require\s*\(\s*['"]child_process['"]\s*\)/,
      /require\s*\(\s*['"]fs['"]\s*\)/,
      /eval\s*\(/,
      /Function\s*\(/,
      /process\.exit/,
    ],
    python: [
      /import\s+os/,
      /import\s+sys/,
      /import\s+subprocess/,
      /exec\s*\(/,
      /eval\s*\(/,
      /__import__/,
    ],
  };

  const patterns = dangerousPatterns[language] || [];

  for (const pattern of patterns) {
    if (pattern.test(code)) {
      throw new Error(`Potentially dangerous code detected: ${pattern.toString()}`);
    }
  }

  return code;
};

/**
 * Execute code in a sandboxed environment
 */
export const executeCode = async (code, language, testCases = []) => {
  const config = languageConfigs[language.toLowerCase()];

  if (!config) {
    throw new Error(`Unsupported language: ${language}`);
  }

  // Check code length
  if (code.length > parseInt(process.env.MAX_CODE_LENGTH || '10000')) {
    throw new Error('Code exceeds maximum length');
  }

  // Sanitize code
  try {
    sanitizeCode(code, language.toLowerCase());
  } catch (error) {
    return {
      success: false,
      error: error.message,
      output: '',
      executionTime: 0,
    };
  }

  const executionId = uuidv4();
  const fileName = `${executionId}.${config.extension}`;
  const filePath = path.join(TEMP_DIR, fileName);

  try {
    // Write code to file
    await writeFile(filePath, code);

    let output = '';
    let compiledFile = null;

    // Compile if needed
    if (config.compile) {
      compiledFile = path.join(TEMP_DIR, executionId);
      const compileCommand = config.compile(filePath, compiledFile);

      try {
        const { stdout, stderr } = await execPromise(compileCommand, {
          timeout: 5000,
        });

        if (stderr) {
          return {
            success: false,
            error: 'Compilation Error',
            output: stderr,
            executionTime: 0,
          };
        }
      } catch (compileError) {
        return {
          success: false,
          error: 'Compilation Error',
          output: compileError.stderr || compileError.message,
          executionTime: 0,
        };
      }
    }

    // Execute code
    const startTime = Date.now();
    const executeCommand = compiledFile
      ? config.command(compiledFile)
      : config.command(filePath);

    try {
      const { stdout, stderr } = await execPromise(executeCommand, {
        timeout: config.timeout,
        maxBuffer: 1024 * 1024, // 1MB
      });

      const executionTime = Date.now() - startTime;

      output = stdout;

      // Run test cases if provided
      let testResults = [];
      if (testCases.length > 0) {
        testResults = await runTestCases(
          compiledFile || filePath,
          config,
          testCases,
          language
        );
      }

      return {
        success: !stderr,
        output: output || 'Code executed successfully (no output)',
        error: stderr || null,
        executionTime,
        testResults,
      };
    } catch (execError) {
      const executionTime = Date.now() - startTime;

      return {
        success: false,
        error: execError.killed ? 'Execution Timeout' : 'Runtime Error',
        output: execError.stdout || '',
        stderr: execError.stderr || execError.message,
        executionTime,
      };
    }
  } catch (error) {
    return {
      success: false,
      error: 'Execution Error',
      output: error.message,
      executionTime: 0,
    };
  } finally {
    // Cleanup
    try {
      await unlink(filePath);
      if (compiledFile && existsSync(compiledFile)) {
        await unlink(compiledFile);
      }
    } catch (cleanupError) {
      console.error('Cleanup error:', cleanupError);
    }
  }
};

/**
 * Run test cases against the code
 */
const runTestCases = async (filePath, config, testCases, language) => {
  const results = [];

  for (const testCase of testCases) {
    try {
      const command = config.command(filePath);
      const { stdout } = await execPromise(command, {
        timeout: config.timeout,
        input: testCase.input,
      });

      const passed = stdout.trim() === testCase.expected.trim();

      results.push({
        input: testCase.input,
        expected: testCase.expected,
        actual: stdout.trim(),
        passed,
      });
    } catch (error) {
      results.push({
        input: testCase.input,
        expected: testCase.expected,
        actual: error.message,
        passed: false,
      });
    }
  }

  return results;
};

/**
 * Validate code syntax without execution
 */
export const validateSyntax = async (code, language) => {
  const config = languageConfigs[language.toLowerCase()];

  if (!config) {
    throw new Error(`Unsupported language: ${language}`);
  }

  const executionId = uuidv4();
  const fileName = `${executionId}.${config.extension}`;
  const filePath = path.join(TEMP_DIR, fileName);

  try {
    await writeFile(filePath, code);

    // For compiled languages, try to compile
    if (config.compile) {
      const compiledFile = path.join(TEMP_DIR, executionId);
      const compileCommand = config.compile(filePath, compiledFile);

      try {
        const { stderr } = await execPromise(compileCommand, {
          timeout: 5000,
        });

        await unlink(compiledFile).catch(() => {});

        return {
          valid: !stderr,
          errors: stderr || null,
        };
      } catch (error) {
        return {
          valid: false,
          errors: error.stderr || error.message,
        };
      }
    }

    // For interpreted languages, do basic syntax check
    const syntaxCheckCommands = {
      javascript: `node --check ${filePath}`,
      python: `python3 -m py_compile ${filePath}`,
    };

    const checkCommand = syntaxCheckCommands[language.toLowerCase()];

    if (checkCommand) {
      try {
        const { stderr } = await execPromise(checkCommand, {
          timeout: 3000,
        });

        return {
          valid: !stderr,
          errors: stderr || null,
        };
      } catch (error) {
        return {
          valid: false,
          errors: error.stderr || error.message,
        };
      }
    }

    return {
      valid: true,
      errors: null,
    };
  } finally {
    await unlink(filePath).catch(() => {});
  }
};

/**
 * Get supported languages
 */
export const getSupportedLanguages = () => {
  return Object.keys(languageConfigs);
};
