import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Target, ArrowLeft, Play, FileText, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import type { InterviewConfig, InterviewType, DifficultyLevel, InterviewMode } from "@/types/interview";
import { parseJobDescription, generateQuestionsFromJD } from "@/utils/jdParser";

const InterviewSetup = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [config, setConfig] = useState<InterviewConfig>({
    jobTitle: "",
    company: "",
    type: "behavioral",
    difficulty: "mid",
    duration: 30,
    mode: "standard",
  });
  const [jobDescription, setJobDescription] = useState("");
  const [parsedData, setParsedData] = useState<ReturnType<typeof parseJobDescription> | null>(null);
  const [stats, setStats] = useState({ total: 0, avgScore: 0, streak: 0 });

  useEffect(() => {
    // Load real stats from localStorage
    const history = JSON.parse(localStorage.getItem("interviewHistory") || "[]");
    const total = history.length;
    const avgScore = total > 0 
      ? Math.round(history.reduce((sum: number, h: any) => sum + (h.score || 0), 0) / total)
      : 0;
    
    // Calculate streak
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    let streak = 0;
    const sorted = [...history].sort((a, b) => 
      new Date(b.timestamp || b.date).getTime() - new Date(a.timestamp || a.date).getTime()
    );
    
    for (let i = 0; i < sorted.length; i++) {
      const interviewDate = new Date(sorted[i].timestamp || sorted[i].date);
      interviewDate.setHours(0, 0, 0, 0);
      const daysDiff = Math.floor((today.getTime() - interviewDate.getTime()) / (1000 * 60 * 60 * 24));
      if (daysDiff === streak) {
        streak++;
      } else if (daysDiff > streak) {
        break;
      }
    }
    
    setStats({ total, avgScore, streak });
  }, []);

  const handleParseJD = () => {
    if (!jobDescription.trim()) {
      toast({
        title: "Job description required",
        description: "Please paste a job description to analyze",
        variant: "destructive"
      });
      return;
    }
    
    const parsed = parseJobDescription(jobDescription);
    setParsedData(parsed);
    
    if (!config.jobTitle) {
      setConfig(prev => ({ ...prev, difficulty: parsed.experienceLevel as any }));
    }
    
    toast({
      title: "Job description analyzed!",
      description: `Found ${parsed.techStack.length} technologies and ${parsed.requiredSkills.length} key skills`,
    });
  };

  const handleStartInterview = () => {
    if (!config.jobTitle || !config.company) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }
    
    // Adjust duration based on mode
    let adjustedDuration = config.duration;
    if (config.mode === "speed") {
      adjustedDuration = 15;
    }
    
    const enrichedConfig = {
      ...config,
      duration: adjustedDuration,
      parsedJD: parsedData,
      customQuestions: parsedData ? generateQuestionsFromJD(parsedData, config.type, config.difficulty) : []
    };
    
    localStorage.setItem("currentInterviewConfig", JSON.stringify(enrichedConfig));
    navigate("/interview/session");
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/40 backdrop-blur-sm sticky top-0 z-50 bg-background/80">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              InterviewAI
            </span>
          </div>
          <Button variant="ghost" onClick={() => navigate("/dashboard")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Setup Your Interview</h1>
            <p className="text-muted-foreground text-lg">
              Configure your mock interview session to get started
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card className="p-6 bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
                <div className="flex items-center gap-2 mb-4">
                  <FileText className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold text-lg">AI-Powered JD Analysis</h3>
                  <Badge variant="secondary" className="ml-auto">
                    <Sparkles className="h-3 w-3 mr-1" />
                    Smart
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Paste the job description below and our AI will extract key requirements and generate tailored interview questions
                </p>
                <Textarea
                  placeholder="Paste the full job description here..."
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  className="min-h-[150px] font-mono text-sm mb-4"
                />
                <Button onClick={handleParseJD} variant="secondary" className="w-full">
                  <Sparkles className="mr-2 h-4 w-4" />
                  Analyze Job Description
                </Button>

                {parsedData && (
                  <div className="mt-4 space-y-3">
                    <div className="p-3 bg-background/50 rounded-lg">
                      <p className="text-xs font-semibold mb-2">Detected Tech Stack:</p>
                      <div className="flex flex-wrap gap-1">
                        {parsedData.techStack.map((tech, idx) => (
                          <Badge key={idx} variant="outline">{tech}</Badge>
                        ))}
                      </div>
                    </div>
                    <div className="p-3 bg-background/50 rounded-lg">
                      <p className="text-xs font-semibold mb-2">Key Skills Required:</p>
                      <div className="flex flex-wrap gap-1">
                        {parsedData.requiredSkills.slice(0, 5).map((skill, idx) => (
                          <Badge key={idx} variant="secondary">{skill}</Badge>
                        ))}
                      </div>
                    </div>
                    {parsedData.jobRole && (
                      <div className="p-3 bg-primary/10 rounded-lg border border-primary/30">
                        <p className="text-xs font-semibold text-primary">
                          ✓ Detected Role: {parsedData.jobRole.toUpperCase()} - Questions will be tailored accordingly!
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </Card>

              <Card className="p-8 space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="jobTitle">Job Title *</Label>
                  <Input
                    id="jobTitle"
                    placeholder="e.g., Senior Software Engineer, DevOps Engineer"
                    value={config.jobTitle}
                    onChange={(e) => setConfig({ ...config, jobTitle: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="company">Company *</Label>
                  <Input
                    id="company"
                    placeholder="e.g., Google, Amazon, Startup XYZ"
                    value={config.company}
                    onChange={(e) => setConfig({ ...config, company: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">Interview Type</Label>
                  <Select
                    value={config.type}
                    onValueChange={(value) => setConfig({ ...config, type: value as InterviewType })}
                  >
                    <SelectTrigger id="type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="behavioral">Behavioral</SelectItem>
                      <SelectItem value="technical">Technical</SelectItem>
                      <SelectItem value="system-design">System Design</SelectItem>
                      <SelectItem value="coding">Coding Challenge</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="difficulty">Difficulty Level</Label>
                  <Select
                    value={config.difficulty}
                    onValueChange={(value) => setConfig({ ...config, difficulty: value as DifficultyLevel })}
                  >
                    <SelectTrigger id="difficulty">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="entry">Entry Level</SelectItem>
                      <SelectItem value="mid">Mid Level</SelectItem>
                      <SelectItem value="senior">Senior Level</SelectItem>
                      <SelectItem value="lead">Lead/Principal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mode">Interview Mode</Label>
                  <Select
                    value={config.mode || "standard"}
                    onValueChange={(value) => setConfig({ ...config, mode: value as InterviewMode })}
                  >
                    <SelectTrigger id="mode">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="standard">🎯 Standard Mode - Realistic Experience</SelectItem>
                      <SelectItem value="practice">💡 Practice Mode - With Hints</SelectItem>
                      <SelectItem value="speed">⚡ Speed Round - Quick 15min</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {config.mode !== "speed" && (
                  <div className="space-y-2">
                    <Label htmlFor="duration">Duration (minutes)</Label>
                    <Select
                      value={config.duration.toString()}
                      onValueChange={(value) => setConfig({ ...config, duration: parseInt(value) })}
                    >
                      <SelectTrigger id="duration">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15">15 minutes</SelectItem>
                        <SelectItem value="30">30 minutes</SelectItem>
                        <SelectItem value="45">45 minutes</SelectItem>
                        <SelectItem value="60">60 minutes</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <Button
                  size="lg"
                  className="w-full text-lg"
                  onClick={handleStartInterview}
                  disabled={!config.jobTitle || !config.company}
                >
                  <Play className="mr-2 h-5 w-5" />
                  Start Interview
                </Button>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="p-6 bg-gradient-to-br from-primary/10 to-accent/10">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  Pro Tips
                </h3>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold">•</span>
                    <span>Use the <strong>AI JD Analyzer</strong> for personalized questions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold">•</span>
                    <span>Enable voice input for realistic practice</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold">•</span>
                    <span>Choose <strong>Practice Mode</strong> if you want hints during interview</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold">•</span>
                    <span>Review feedback after to track improvement</span>
                  </li>
                </ul>
              </Card>

              <Card className="p-6 bg-accent/5 border-accent/20">
                <h3 className="font-semibold mb-3 text-sm">Quick Stats</h3>
                <div className="space-y-2 text-xs text-muted-foreground">
                  <div className="flex justify-between">
                    <span>Total Interviews:</span>
                    <span className="font-semibold text-foreground">{stats.total}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Average Score:</span>
                    <span className="font-semibold text-foreground">
                      {stats.avgScore > 0 ? `${stats.avgScore}%` : "--"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Current Streak:</span>
                    <span className="font-semibold text-foreground">
                      {stats.streak} {stats.streak > 0 ? "days 🔥" : ""}
                    </span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewSetup;
