import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  Target,
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  Calendar,
  Clock,
  Award,
  BarChart3,
  Brain,
  Code,
  Users,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";

const Analytics = () => {
  const navigate = useNavigate();
  const [timeRange, setTimeRange] = useState<"week" | "month" | "all">("month");

  // Mock performance data over time
  const performanceData = [
    { date: "Week 1", overall: 65, technical: 60, communication: 70, problemSolving: 65 },
    { date: "Week 2", overall: 68, technical: 65, communication: 72, problemSolving: 67 },
    { date: "Week 3", overall: 72, technical: 70, communication: 74, problemSolving: 72 },
    { date: "Week 4", overall: 78, technical: 75, communication: 80, problemSolving: 79 },
    { date: "Week 5", overall: 82, technical: 80, communication: 84, problemSolving: 82 },
  ];

  // Interview type distribution
  const interviewTypeData = [
    { type: "Technical", count: 12, avgScore: 78 },
    { type: "Behavioral", count: 8, avgScore: 82 },
    { type: "Coding", count: 15, avgScore: 75 },
    { type: "System Design", count: 5, avgScore: 70 },
  ];

  // Skill proficiency radar
  const skillData = [
    { skill: "Algorithms", score: 85 },
    { skill: "Data Structures", score: 78 },
    { skill: "System Design", score: 70 },
    { skill: "Communication", score: 88 },
    { skill: "Problem Solving", score: 82 },
    { skill: "Coding Speed", score: 75 },
  ];

  // Time of day performance
  const timeOfDayData = [
    { time: "6-9 AM", score: 72 },
    { time: "9-12 PM", score: 85 },
    { time: "12-3 PM", score: 78 },
    { time: "3-6 PM", score: 68 },
    { time: "6-9 PM", score: 82 },
    { time: "9-12 AM", score: 75 },
  ];

  // Question difficulty vs performance
  const difficultyPerformance = [
    { difficulty: "Easy", attempted: 25, passed: 24, avgScore: 92 },
    { difficulty: "Medium", attempted: 18, passed: 14, avgScore: 75 },
    { difficulty: "Hard", attempted: 8, passed: 4, avgScore: 58 },
  ];

  // Weekly activity heatmap data
  const weeklyActivity = [
    { day: "Mon", interviews: 3, hours: 2.5 },
    { day: "Tue", interviews: 2, hours: 1.5 },
    { day: "Wed", interviews: 4, hours: 3.0 },
    { day: "Thu", interviews: 1, hours: 0.8 },
    { day: "Fri", interviews: 3, hours: 2.2 },
    { day: "Sat", interviews: 5, hours: 4.0 },
    { day: "Sun", interviews: 2, hours: 1.5 },
  ];

  // Predictive score calculation
  const calculatePredictiveScore = () => {
    const recentPerformance = performanceData.slice(-3);
    const avgRecent =
      recentPerformance.reduce((sum, d) => sum + d.overall, 0) / recentPerformance.length;
    const trend =
      performanceData[performanceData.length - 1].overall - performanceData[0].overall;
    const trendFactor = trend > 0 ? 1.05 : 0.95;
    return Math.round(avgRecent * trendFactor);
  };

  const predictedScore = calculatePredictiveScore();
  const currentScore = performanceData[performanceData.length - 1].overall;
  const improvement = predictedScore - performanceData[0].overall;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/40 backdrop-blur-sm sticky top-0 z-50 bg-background/80">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              InterviewAI Analytics
            </span>
          </div>
          <Button variant="ghost" onClick={() => navigate("/dashboard")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Overview Stats */}
          <div className="grid md:grid-cols-4 gap-6">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <BarChart3 className="h-8 w-8 text-primary" />
                <Badge variant="secondary">Current</Badge>
              </div>
              <div className="space-y-2">
                <p className="text-3xl font-bold">{currentScore}%</p>
                <p className="text-sm text-muted-foreground">Overall Score</p>
                <div className="flex items-center text-success text-sm">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  +{improvement}% from start
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <Brain className="h-8 w-8 text-accent" />
                <Badge variant="secondary">Prediction</Badge>
              </div>
              <div className="space-y-2">
                <p className="text-3xl font-bold">{predictedScore}%</p>
                <p className="text-sm text-muted-foreground">Predicted Next Score</p>
                <div className="flex items-center text-primary text-sm">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  {predictedScore > currentScore ? "Improving" : "Stable"}
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <Calendar className="h-8 w-8 text-success" />
                <Badge variant="secondary">Activity</Badge>
              </div>
              <div className="space-y-2">
                <p className="text-3xl font-bold">40</p>
                <p className="text-sm text-muted-foreground">Total Interviews</p>
                <div className="flex items-center text-success text-sm">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  +12 this month
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <Clock className="h-8 w-8 text-warning" />
                <Badge variant="secondary">Time</Badge>
              </div>
              <div className="space-y-2">
                <p className="text-3xl font-bold">28h</p>
                <p className="text-sm text-muted-foreground">Practice Time</p>
                <div className="flex items-center text-warning text-sm">
                  <Clock className="h-4 w-4 mr-1" />
                  16h this month
                </div>
              </div>
            </Card>
          </div>

          {/* Main Analytics Tabs */}
          <Tabs defaultValue="performance" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="performance">Performance Trends</TabsTrigger>
              <TabsTrigger value="skills">Skills Analysis</TabsTrigger>
              <TabsTrigger value="activity">Activity Patterns</TabsTrigger>
              <TabsTrigger value="insights">AI Insights</TabsTrigger>
            </TabsList>

            {/* Performance Trends Tab */}
            <TabsContent value="performance" className="space-y-6">
              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-4">Score Progression Over Time</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="overall"
                      stackId="1"
                      stroke="#8884d8"
                      fill="#8884d8"
                      name="Overall"
                    />
                    <Area
                      type="monotone"
                      dataKey="technical"
                      stackId="2"
                      stroke="#82ca9d"
                      fill="#82ca9d"
                      name="Technical"
                    />
                    <Area
                      type="monotone"
                      dataKey="communication"
                      stackId="3"
                      stroke="#ffc658"
                      fill="#ffc658"
                      name="Communication"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </Card>

              <div className="grid md:grid-cols-2 gap-6">
                <Card className="p-6">
                  <h3 className="text-xl font-semibold mb-4">Interview Type Distribution</h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={interviewTypeData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="type" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="count" fill="#8884d8" name="Interviews" />
                      <Bar dataKey="avgScore" fill="#82ca9d" name="Avg Score" />
                    </BarChart>
                  </ResponsiveContainer>
                </Card>

                <Card className="p-6">
                  <h3 className="text-xl font-semibold mb-4">
                    Difficulty vs Performance
                  </h3>
                  <div className="space-y-4">
                    {difficultyPerformance.map((item) => (
                      <div key={item.difficulty} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{item.difficulty}</span>
                          <span className="text-sm text-muted-foreground">
                            {item.passed}/{item.attempted} passed ({item.avgScore}%)
                          </span>
                        </div>
                        <Progress value={item.avgScore} className="h-2" />
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </TabsContent>

            {/* Skills Analysis Tab */}
            <TabsContent value="skills" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="p-6">
                  <h3 className="text-xl font-semibold mb-4">Skill Proficiency Radar</h3>
                  <ResponsiveContainer width="100%" height={350}>
                    <RadarChart data={skillData}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="skill" />
                      <PolarRadiusAxis domain={[0, 100]} />
                      <Radar
                        name="Your Skills"
                        dataKey="score"
                        stroke="#8884d8"
                        fill="#8884d8"
                        fillOpacity={0.6}
                      />
                      <Tooltip />
                    </RadarChart>
                  </ResponsiveContainer>
                </Card>

                <Card className="p-6">
                  <h3 className="text-xl font-semibold mb-4">Skill Breakdown</h3>
                  <div className="space-y-4">
                    {skillData.map((skill) => (
                      <div key={skill.skill} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{skill.skill}</span>
                          <Badge
                            variant={skill.score >= 80 ? "default" : "secondary"}
                          >
                            {skill.score}%
                          </Badge>
                        </div>
                        <Progress value={skill.score} className="h-2" />
                        <p className="text-xs text-muted-foreground">
                          {skill.score >= 80
                            ? "Excellent - Keep it up!"
                            : skill.score >= 70
                            ? "Good - Room for improvement"
                            : "Needs Practice"}
                        </p>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </TabsContent>

            {/* Activity Patterns Tab */}
            <TabsContent value="activity" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="p-6">
                  <h3 className="text-xl font-semibold mb-4">Best Time to Practice</h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={timeOfDayData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="score"
                        stroke="#8884d8"
                        name="Avg Score"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                  <p className="text-sm text-muted-foreground mt-4">
                    You perform best between 9-12 PM with an average score of 85%
                  </p>
                </Card>

                <Card className="p-6">
                  <h3 className="text-xl font-semibold mb-4">Weekly Activity</h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={weeklyActivity}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="interviews" fill="#8884d8" name="Interviews" />
                    </BarChart>
                  </ResponsiveContainer>
                  <p className="text-sm text-muted-foreground mt-4">
                    Most active on Saturday with an average of 4 hours practice
                  </p>
                </Card>
              </div>
            </TabsContent>

            {/* AI Insights Tab */}
            <TabsContent value="insights" className="space-y-6">
              <Card className="p-6 bg-gradient-to-br from-primary/5 to-accent/5">
                <div className="flex items-start gap-4">
                  <Brain className="h-8 w-8 text-primary mt-1" />
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold">AI Performance Prediction</h3>
                    <p className="text-muted-foreground">
                      Based on your learning trajectory and practice patterns, our AI
                      predicts:
                    </p>
                    <div className="bg-background/50 p-4 rounded-lg space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Next Interview Score:</span>
                        <span className="text-2xl font-bold text-primary">
                          {predictedScore}%
                        </span>
                      </div>
                      <Progress value={predictedScore} className="h-2" />
                      <p className="text-sm text-muted-foreground">
                        {predictedScore > currentScore
                          ? `🎉 You're on track to improve by ${
                              predictedScore - currentScore
                            }%`
                          : "Keep practicing to maintain your score"}
                      </p>
                    </div>
                  </div>
                </div>
              </Card>

              <div className="grid md:grid-cols-2 gap-6">
                <Card className="p-6">
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <Award className="h-5 w-5 text-primary" />
                    Strengths
                  </h3>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2">
                      <TrendingUp className="h-5 w-5 text-success mt-0.5" />
                      <div>
                        <p className="font-medium">Communication Skills</p>
                        <p className="text-sm text-muted-foreground">
                          Consistently scoring 80%+ in behavioral interviews
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <TrendingUp className="h-5 w-5 text-success mt-0.5" />
                      <div>
                        <p className="font-medium">Consistent Practice</p>
                        <p className="text-sm text-muted-foreground">
                          7-day streak with steady improvement
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <TrendingUp className="h-5 w-5 text-success mt-0.5" />
                      <div>
                        <p className="font-medium">Algorithm Mastery</p>
                        <p className="text-sm text-muted-foreground">
                          85% proficiency in algorithms and data structures
                        </p>
                      </div>
                    </li>
                  </ul>
                </Card>

                <Card className="p-6">
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <TrendingDown className="h-5 w-5 text-warning" />
                    Areas for Improvement
                  </h3>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2">
                      <Target className="h-5 w-5 text-warning mt-0.5" />
                      <div>
                        <p className="font-medium">System Design</p>
                        <p className="text-sm text-muted-foreground">
                          Focus on scalability and architectural patterns
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <Target className="h-5 w-5 text-warning mt-0.5" />
                      <div>
                        <p className="font-medium">Hard Problem Solving</p>
                        <p className="text-sm text-muted-foreground">
                          Only 50% pass rate on hard difficulty questions
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <Target className="h-5 w-5 text-warning mt-0.5" />
                      <div>
                        <p className="font-medium">Coding Speed</p>
                        <p className="text-sm text-muted-foreground">
                          Practice more timed coding challenges
                        </p>
                      </div>
                    </li>
                  </ul>
                </Card>
              </div>

              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-4">Recommended Actions</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <Button className="h-auto py-4 flex-col items-start">
                    <Code className="h-6 w-6 mb-2" />
                    <span className="font-semibold">Practice System Design</span>
                    <span className="text-xs text-muted-foreground">
                      Complete 5 system design interviews
                    </span>
                  </Button>
                  <Button variant="outline" className="h-auto py-4 flex-col items-start">
                    <Users className="h-6 w-6 mb-2" />
                    <span className="font-semibold">Peer Mock Interview</span>
                    <span className="text-xs text-muted-foreground">
                      Practice with another user
                    </span>
                  </Button>
                  <Button variant="outline" className="h-auto py-4 flex-col items-start">
                    <Calendar className="h-6 w-6 mb-2" />
                    <span className="font-semibold">Follow Study Plan</span>
                    <span className="text-xs text-muted-foreground">
                      30-day FAANG prep roadmap
                    </span>
                  </Button>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
