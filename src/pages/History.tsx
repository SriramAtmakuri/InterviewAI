import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Target, ArrowLeft, Calendar, Clock, TrendingUp, MessageSquare, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { InterviewSession } from "@/types/interview";

const History = () => {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState<InterviewSession[]>([]);
  const [selectedSession, setSelectedSession] = useState<InterviewSession | null>(null);

  useEffect(() => {
    const sessionsStr = localStorage.getItem("interviewSessions");
    if (sessionsStr) {
      setSessions(JSON.parse(sessionsStr));
    }
  }, []);

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatDuration = (start: Date, end?: Date) => {
    if (!end) return "In progress";
    const duration = Math.floor((new Date(end).getTime() - new Date(start).getTime()) / 60000);
    return `${duration} min`;
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      behavioral: "bg-primary/10 text-primary",
      technical: "bg-accent/10 text-accent",
      "system-design": "bg-success/10 text-success",
      coding: "bg-destructive/10 text-destructive",
    };
    return colors[type] || colors.behavioral;
  };

  const handleDeleteSession = (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation();

    const confirmed = window.confirm("Are you sure you want to delete this interview session? This action cannot be undone.");
    if (!confirmed) return;

    // Remove from sessions array
    const updatedSessions = sessions.filter(s => s.id !== sessionId);
    setSessions(updatedSessions);

    // Update localStorage
    localStorage.setItem("interviewSessions", JSON.stringify(updatedSessions));

    // Also update interviewHistory if it exists
    const historyStr = localStorage.getItem("interviewHistory");
    if (historyStr) {
      const history = JSON.parse(historyStr);
      const updatedHistory = history.filter((s: InterviewSession) => s.id !== sessionId);
      localStorage.setItem("interviewHistory", JSON.stringify(updatedHistory));
    }

    // Clear selected session if it was deleted
    if (selectedSession?.id === sessionId) {
      setSelectedSession(null);
    }
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
            <h1 className="text-4xl font-bold mb-2">Interview History</h1>
            <p className="text-muted-foreground text-lg">
              Review your past sessions and track your progress
            </p>
          </div>

          {sessions.length === 0 ? (
            <Card className="p-12 text-center border-2 border-dashed border-border">
              <MessageSquare className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-2xl font-bold mb-2">No interviews yet</h3>
              <p className="text-muted-foreground mb-6">
                Start your first mock interview to see your history here
              </p>
              <Button onClick={() => navigate("/interview/setup")}>
                Start Your First Interview
              </Button>
            </Card>
          ) : (
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Sessions List */}
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold mb-4">Your Sessions</h2>
                {sessions.map((session) => (
                  <Card
                    key={session.id}
                    className={`p-6 cursor-pointer hover:shadow-lg transition-all ${
                      selectedSession?.id === session.id ? "border-2 border-primary" : ""
                    }`}
                    onClick={() => setSelectedSession(session)}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-lg">{session.config.jobTitle}</h3>
                        <p className="text-sm text-muted-foreground">{session.config.company}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getTypeColor(session.config.type)}>
                          {session.config.type}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                          onClick={(e) => handleDeleteSession(session.id, e)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {formatDate(session.startTime)}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {formatDuration(session.startTime, session.endTime)}
                      </div>
                    </div>

                    {session.feedback && (
                      <div className="mt-4 pt-4 border-t border-border">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Overall Score</span>
                          <span className="text-lg font-bold text-primary">
                            {session.feedback.overallScore}%
                          </span>
                        </div>
                      </div>
                    )}
                  </Card>
                ))}
              </div>

              {/* Detailed Feedback */}
              {selectedSession && selectedSession.feedback && (
                <Card className="p-6 h-fit sticky top-24">
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-2xl font-bold mb-2">Performance Report</h2>
                      <p className="text-muted-foreground">
                        {selectedSession.config.jobTitle} at {selectedSession.config.company}
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">Overall Score</span>
                          <span className="text-2xl font-bold text-primary">
                            {selectedSession.feedback.overallScore}%
                          </span>
                        </div>
                        <Progress value={selectedSession.feedback.overallScore} className="h-3" />
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Technical</p>
                          <p className="text-lg font-bold">{selectedSession.feedback.technicalScore}%</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Communication</p>
                          <p className="text-lg font-bold">{selectedSession.feedback.communicationScore}%</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Problem Solving</p>
                          <p className="text-lg font-bold">{selectedSession.feedback.problemSolvingScore}%</p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-3 flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-success" />
                        Strengths
                      </h3>
                      <ul className="space-y-2">
                        {selectedSession.feedback.strengths.map((strength, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm">
                            <span className="text-success mt-1">✓</span>
                            <span>{strength}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-3">Areas for Improvement</h3>
                      <ul className="space-y-2">
                        {selectedSession.feedback.improvements.map((improvement, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm">
                            <span className="text-accent mt-1">→</span>
                            <span>{improvement}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="pt-4 border-t border-border">
                      <h3 className="font-semibold mb-2">Detailed Analysis</h3>
                      <p className="text-sm text-muted-foreground">
                        {selectedSession.feedback.detailedAnalysis}
                      </p>
                    </div>
                  </div>
                </Card>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default History;
