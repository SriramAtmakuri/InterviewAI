import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lightbulb, Sparkles, Target } from "lucide-react";
import { useState } from "react";

interface InterviewHintsProps {
  interviewType: string;
  currentQuestion: string;
}

const InterviewHints = ({ interviewType, currentQuestion }: InterviewHintsProps) => {
  const [showHint, setShowHint] = useState(false);
  const [hintLevel, setHintLevel] = useState(1);

  const generateHints = () => {
    const hints: Record<string, string[]> = {
      behavioral: [
        "Use the STAR method: Situation, Task, Action, Result",
        "Be specific with numbers and metrics where possible",
        "Focus on YOUR actions and contributions, not the team's",
        "End with what you learned or how you'd improve"
      ],
      technical: [
        "Start by clarifying the requirements and constraints",
        "Think out loud - explain your reasoning process",
        "Consider edge cases and performance implications",
        "Compare different approaches and their trade-offs"
      ],
      coding: [
        "Break down the problem into smaller sub-problems",
        "Start with a brute force solution, then optimize",
        "Test your solution with example cases",
        "Analyze time and space complexity"
      ],
      "system-design": [
        "Define the scope and requirements first",
        "Start with high-level architecture, then drill down",
        "Consider scalability, reliability, and maintainability",
        "Discuss trade-offs of different design choices"
      ]
    };

    return hints[interviewType] || hints.behavioral;
  };

  const hints = generateHints();

  return (
    <Card className="p-4 bg-accent/50 border-primary/20">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-primary" />
          <h3 className="font-semibold">Interview Coach</h3>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => {
            setShowHint(!showHint);
            if (!showHint) setHintLevel(1);
          }}
        >
          {showHint ? "Hide" : "Show"} Hints
        </Button>
      </div>

      {showHint && (
        <div className="space-y-3">
          {hints.slice(0, hintLevel).map((hint, idx) => (
            <div key={idx} className="flex items-start gap-2 text-sm">
              <Target className="h-4 w-4 mt-0.5 text-primary flex-shrink-0" />
              <p>{hint}</p>
            </div>
          ))}
          
          {hintLevel < hints.length && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setHintLevel(prev => Math.min(prev + 1, hints.length))}
              className="w-full mt-2"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Get More Hints ({hints.length - hintLevel} remaining)
            </Button>
          )}
        </div>
      )}

      {interviewType === "behavioral" && showHint && (
        <div className="mt-4 p-3 bg-primary/10 rounded-lg">
          <p className="text-xs font-semibold mb-2">STAR Method Template:</p>
          <ul className="text-xs space-y-1 list-disc list-inside">
            <li><strong>S</strong>ituation: Set the context</li>
            <li><strong>T</strong>ask: Describe your responsibility</li>
            <li><strong>A</strong>ction: Explain what YOU did</li>
            <li><strong>R</strong>esult: Share the outcome with metrics</li>
          </ul>
        </div>
      )}
    </Card>
  );
};

export default InterviewHints;
