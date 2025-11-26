import { Editor } from "@monaco-editor/react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Play, RotateCcw, CheckCircle2, XCircle, AlertCircle, Sparkles } from "lucide-react";
import { useState } from "react";
import { executeCode, validateCode, getAllSupportedLanguages, type TestCase, type ExecutionResult } from "@/utils/codeExecutor";
import { validateCodeWithAI, generateTestCases, type AIValidationResult } from "@/utils/aiValidator";
import { isGeminiConfigured } from "@/config/gemini";

interface CodeEditorProps {
  initialCode?: string;
  language?: string;
  onRun?: (code: string) => void;
  readOnly?: boolean;
  testCases?: TestCase[];
  problemDescription?: string;
}

const CodeEditor = ({
  initialCode = "",
  language = "javascript",
  onRun,
  readOnly = false,
  testCases,
  problemDescription
}: CodeEditorProps) => {
  const [code, setCode] = useState(initialCode);
  const [selectedLang, setSelectedLang] = useState(language);
  const [output, setOutput] = useState<ExecutionResult | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [aiValidation, setAiValidation] = useState<AIValidationResult | null>(null);
  const [isValidating, setIsValidating] = useState(false);

  const languageTemplates: Record<string, string> = {
    javascript: "// Write your solution here\nfunction solution() {\n  // Your code\n}\n\nsolution();",
    typescript: "// Write your solution here\nfunction solution(): void {\n  // Your code\n}\n\nsolution();",
    python: "# Write your solution here\ndef solution():\n    # Your code\n    pass\n\nsolution()",
    java: "public class Solution {\n    public static void main(String[] args) {\n        // Your code here\n    }\n}",
    cpp: "#include <iostream>\nusing namespace std;\n\nint main() {\n    // Your code here\n    return 0;\n}",
    c: "#include <stdio.h>\n\nint main() {\n    // Your code here\n    return 0;\n}",
    csharp: "using System;\n\nclass Solution {\n    static void Main() {\n        // Your code here\n    }\n}",
    go: "package main\n\nimport \"fmt\"\n\nfunc main() {\n    // Your code here\n}",
    rust: "fn main() {\n    // Your code here\n}",
    php: "<?php\n// Your code here\n?>",
    ruby: "# Your code here\nputs \"Hello\"",
    swift: "import Foundation\n\n// Your code here",
    kotlin: "fun main() {\n    // Your code here\n}",
    scala: "object Main {\n  def main(args: Array[String]): Unit = {\n    // Your code here\n  }\n}",
    r: "# Your code here",
    perl: "#!/usr/bin/perl\n# Your code here",
    haskell: "main :: IO ()\nmain = do\n    -- Your code here\n    putStrLn \"Hello\"",
    bash: "#!/bin/bash\n# Your code here",
    powershell: "# Your code here\nWrite-Host \"Hello\"",
    sqlite: "-- Your SQLite query here\nSELECT * FROM table;",
    mysql: "-- Your MySQL query here\nSELECT * FROM table;",
    postgresql: "-- Your PostgreSQL query here\nSELECT * FROM table;",
    mssql: "-- Your MS SQL Server query here\nSELECT * FROM table;",
    oracle: "-- Your Oracle SQL query here\nSELECT * FROM table;",
    matlab: "% Your code here\ndisp('Hello')",
  };

  const handleReset = () => {
    setCode(languageTemplates[selectedLang] || "// Write your code here");
    setOutput(null);
    setAiValidation(null);
  };

  const handleAIValidation = async () => {
    if (!problemDescription) {
      setAiValidation({
        isCorrect: false,
        explanation: "No problem description provided for AI validation",
        testCases: [],
      });
      return;
    }

    setIsValidating(true);
    setAiValidation(null);

    try {
      const result = await validateCodeWithAI(problemDescription, code, selectedLang);
      setAiValidation(result);

      // If AI generated test cases, optionally run them
      if (result.testCases && result.testCases.length > 0 && result.isCorrect) {
        const generatedTestCases = result.testCases.map(tc => ({
          input: tc.input,
          expectedOutput: tc.expectedOutput,
          description: tc.description,
        }));

        // Run the code against AI-generated test cases
        const execResult = await executeCode(code, selectedLang, generatedTestCases);
        setOutput(execResult);
      }
    } catch (error: any) {
      setAiValidation({
        isCorrect: false,
        explanation: `AI validation failed: ${error.message}`,
        testCases: [],
      });
    } finally {
      setIsValidating(false);
    }
  };

  const handleRun = async () => {
    const validation = validateCode(code, selectedLang);
    if (!validation.valid) {
      setOutput({
        success: false,
        output: "",
        error: validation.error
      });
      return;
    }

    setIsRunning(true);
    setOutput(null);

    try {
      const result = await executeCode(code, selectedLang, testCases);
      setOutput(result);
      onRun?.(code);
    } catch (error: any) {
      setOutput({
        success: false,
        output: "",
        error: `Execution failed: ${error.message}`
      });
    } finally {
      setIsRunning(false);
    }
  };

  const allLanguages = getAllSupportedLanguages();
  const popularLanguages = allLanguages.filter(l => l.popular);
  const otherLanguages = allLanguages.filter(l => !l.popular);

  // Parse problem description into structured sections
  const parseProblemDescription = (desc: string) => {
    const sections: {
      title?: string;
      description?: string;
      examples?: string;
      constraints?: string;
      approach?: string;
      timeComplexity?: string;
      spaceComplexity?: string;
    } = {};

    // Extract title (first line)
    const lines = desc.split('\n');
    sections.title = lines[0]?.trim();

    // Extract main description (before "Examples:")
    const examplesIndex = desc.indexOf('Examples:');
    const constraintsIndex = desc.indexOf('Constraints:');
    const approachIndex = desc.indexOf('Expected Approach:');
    const timeComplexityMatch = desc.match(/Time Complexity:.*$/im);
    const spaceComplexityMatch = desc.match(/Space Complexity:.*$/im);

    if (examplesIndex > 0) {
      sections.description = desc.substring(sections.title?.length || 0, examplesIndex).trim();
    }

    // Extract examples
    if (examplesIndex > 0) {
      const endIndex = constraintsIndex > 0 ? constraintsIndex : approachIndex > 0 ? approachIndex : desc.length;
      sections.examples = desc.substring(examplesIndex + 9, endIndex).trim();
    }

    // Extract constraints
    if (constraintsIndex > 0) {
      const endIndex = approachIndex > 0 ? approachIndex : timeComplexityMatch ? desc.indexOf('Time Complexity:') : desc.length;
      sections.constraints = desc.substring(constraintsIndex + 12, endIndex).trim();
    }

    // Extract expected approach
    if (approachIndex > 0) {
      const endIndex = timeComplexityMatch ? desc.indexOf('Time Complexity:') : desc.length;
      sections.approach = desc.substring(approachIndex + 18, endIndex).trim();
    }

    // Extract complexity
    if (timeComplexityMatch) {
      sections.timeComplexity = timeComplexityMatch[0].trim();
    }
    if (spaceComplexityMatch) {
      sections.spaceComplexity = spaceComplexityMatch[0].trim();
    }

    return sections;
  };

  const sections = problemDescription ? parseProblemDescription(problemDescription) : null;

  return (
    <div className="space-y-4">
      {problemDescription && sections && (
        <Card className="p-6 bg-accent/20 border-accent/30">
          {/* Title */}
          {sections.title && (
            <h2 className="text-xl font-bold mb-4">{sections.title}</h2>
          )}

          {/* Description */}
          {sections.description && (
            <div className="mb-5">
              <p className="text-sm leading-relaxed whitespace-pre-line">{sections.description}</p>
            </div>
          )}

          {/* Examples Section */}
          {sections.examples && (
            <div className="mb-5">
              <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <span className="text-primary">Examples</span>
              </h3>
              <div className="bg-background/50 rounded-lg p-4 border border-border/50">
                <pre className="text-xs leading-relaxed whitespace-pre-line font-mono">
                  {sections.examples}
                </pre>
              </div>
            </div>
          )}

          {/* Constraints Section */}
          {sections.constraints && (
            <div className="mb-5">
              <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <span className="text-warning">Constraints</span>
              </h3>
              <div className="bg-background/30 rounded-lg p-4 border border-border/30">
                <pre className="text-xs leading-relaxed whitespace-pre-line text-muted-foreground">
                  {sections.constraints}
                </pre>
              </div>
            </div>
          )}

          {/* Expected Approach Section */}
          {sections.approach && (
            <div className="mb-5">
              <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <span className="text-success">Expected Approach</span>
              </h3>
              <div className="bg-background/30 rounded-lg p-4 border border-border/30">
                <pre className="text-xs leading-relaxed whitespace-pre-line text-muted-foreground">
                  {sections.approach}
                </pre>
              </div>
            </div>
          )}

          {/* Complexity Requirements */}
          {(sections.timeComplexity || sections.spaceComplexity) && (
            <div className="pt-4 border-t border-border/50">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                Complexity Requirements
              </h3>
              <div className="space-y-1">
                {sections.timeComplexity && (
                  <p className="text-xs text-muted-foreground">
                    • {sections.timeComplexity}
                  </p>
                )}
                {sections.spaceComplexity && (
                  <p className="text-xs text-muted-foreground">
                    • {sections.spaceComplexity}
                  </p>
                )}
              </div>
            </div>
          )}
        </Card>
      )}

      <Card className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <Select value={selectedLang} onValueChange={setSelectedLang}>
              <SelectTrigger className="w-[240px]">
                <SelectValue placeholder="Language" />
              </SelectTrigger>
              <SelectContent className="max-h-[400px]">
                <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                  Popular Languages
                </div>
                {popularLanguages.map(lang => (
                  <SelectItem key={lang.id} value={lang.id}>
                    {lang.name}
                  </SelectItem>
                ))}
                {otherLanguages.length > 0 && (
                  <>
                    <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground border-t mt-2">
                      Other Languages
                    </div>
                    {otherLanguages.map(lang => (
                      <SelectItem key={lang.id} value={lang.id}>
                        {lang.name}
                      </SelectItem>
                    ))}
                  </>
                )}
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleReset}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
            {isGeminiConfigured() && problemDescription && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleAIValidation}
                disabled={readOnly || isValidating}
                className="border-primary/30 text-primary hover:bg-primary/10"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                {isValidating ? "Validating..." : "AI Validate"}
              </Button>
            )}
            <Button size="sm" onClick={handleRun} disabled={readOnly || isRunning}>
              <Play className="h-4 w-4 mr-2" />
              {isRunning ? "Running..." : "Run Code"}
            </Button>
          </div>
        </div>
        
        <div className="border border-border rounded-lg overflow-hidden">
          <Editor
            height="400px"
            language={selectedLang}
            value={code}
            onChange={(value) => setCode(value || "")}
            theme="vs-dark"
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              lineNumbers: "on",
              scrollBeyondLastLine: false,
              automaticLayout: true,
              readOnly: readOnly,
            }}
          />
        </div>
      </Card>

      {aiValidation && (
        <Card className={`p-4 mb-4 ${aiValidation.isCorrect ? 'bg-primary/10 border-primary/30' : 'bg-warning/10 border-warning/30'}`}>
          <div className="flex items-start gap-2 mb-2">
            <Sparkles className={`h-5 w-5 mt-0.5 ${aiValidation.isCorrect ? 'text-primary' : 'text-warning'}`} />
            <div className="flex-1">
              <h3 className="font-semibold mb-2">
                AI Analysis: {aiValidation.isCorrect ? "Solution looks correct!" : "Potential issues detected"}
              </h3>
              <p className="text-sm mb-3">{aiValidation.explanation}</p>

              {aiValidation.testCases && aiValidation.testCases.length > 0 && (
                <div className="mt-3">
                  <p className="text-xs font-semibold mb-2">AI-Generated Test Cases:</p>
                  <div className="space-y-2">
                    {aiValidation.testCases.map((tc, idx) => (
                      <div key={idx} className="text-xs bg-background/50 p-2 rounded">
                        <p className="font-medium">{tc.description}</p>
                        <p className="text-muted-foreground">Input: {tc.input}</p>
                        <p className="text-muted-foreground">Expected: {tc.expectedOutput}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {aiValidation.suggestions && aiValidation.suggestions.length > 0 && (
                <div className="mt-3">
                  <p className="text-xs font-semibold mb-1">Suggestions:</p>
                  <ul className="text-xs space-y-1">
                    {aiValidation.suggestions.map((suggestion, idx) => (
                      <li key={idx} className="flex items-start gap-1">
                        <span>•</span>
                        <span>{suggestion}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </Card>
      )}

      {output && (
        <Card className={`p-4 ${output.success ? 'bg-success/10 border-success/30' : 'bg-destructive/10 border-destructive/30'}`}>
          <div className="flex items-start gap-2 mb-2">
            {output.success ? (
              <CheckCircle2 className="h-5 w-5 text-success mt-0.5" />
            ) : (
              <XCircle className="h-5 w-5 text-destructive mt-0.5" />
            )}
            <h3 className="font-semibold">
              {output.success ? "Success!" : "Failed"}
            </h3>
          </div>

          {output.error && (
            <div className="mb-3 p-3 bg-destructive/20 rounded-md">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-destructive mb-1">Error:</p>
                  <pre className="text-xs whitespace-pre-wrap text-destructive">{output.error}</pre>
                </div>
              </div>
            </div>
          )}

          {output.output && (
            <div>
              <p className="text-sm font-semibold mb-2">Output:</p>
              <pre className="text-sm whitespace-pre-wrap bg-background/50 p-3 rounded-md">{output.output}</pre>
            </div>
          )}

          {output.executionTime && (
            <p className="text-xs text-muted-foreground mt-2">
              Execution time: {output.executionTime}ms
            </p>
          )}

          {output.testResults && (
            <div className="mt-4 space-y-2">
              <p className="text-sm font-semibold">Test Results:</p>
              {output.testResults.map((test, idx) => (
                <div
                  key={idx}
                  className={`p-2 rounded-md ${
                    test.passed ? 'bg-success/20' : 'bg-destructive/20'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    {test.passed ? (
                      <CheckCircle2 className="h-4 w-4 text-success" />
                    ) : (
                      <XCircle className="h-4 w-4 text-destructive" />
                    )}
                    <span className="text-sm font-medium">{test.description}</span>
                  </div>
                  {!test.passed && (
                    <div className="ml-6 text-xs space-y-1">
                      <p>Expected: <code className="bg-background/50 px-1 rounded">{test.expected}</code></p>
                      <p>Got: <code className="bg-background/50 px-1 rounded">{test.actual}</code></p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </Card>
      )}
    </div>
  );
};

export default CodeEditor;