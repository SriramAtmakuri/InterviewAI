import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Flame, Star, TrendingUp } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useState, useEffect } from "react";

interface UserStats {
  streak: number;
  totalInterviews: number;
  averageScore: number;
  badges: Array<{
    name: string;
    icon: string;
    earned: boolean;
  }>;
  level: number;
  xp: number;
  nextLevelXP: number;
}

const GamificationPanel = () => {
  const [stats, setStats] = useState<UserStats>({
    streak: 0,
    totalInterviews: 0,
    averageScore: 0,
    badges: [
      { name: "First Steps", icon: "👣", earned: false },
      { name: "Fast Learner", icon: "⚡", earned: false },
      { name: "Code Master", icon: "💻", earned: false },
      { name: "Communicator", icon: "🗣️", earned: false },
      { name: "Century Club", icon: "💯", earned: false },
    ],
    level: 1,
    xp: 0,
    nextLevelXP: 100
  });

  useEffect(() => {
    const loadStats = () => {
      try {
        const historyStr = localStorage.getItem("interviewHistory");
        const history = historyStr ? JSON.parse(historyStr) : [];

        const totalInterviews = history.length;
        const totalScore = history.reduce((sum: number, interview: any) =>
          sum + (interview.score || 0), 0
        );
        const averageScore = totalInterviews > 0 ? Math.round(totalScore / totalInterviews) : 0;
        const streak = calculateStreak(history);

        const xp = totalInterviews * 50;
        const level = Math.floor(xp / 100) + 1;
        const currentLevelXP = xp % 100;

        const earnedBadges = [
          { name: "First Steps", icon: "👣", earned: totalInterviews >= 1 },
          { name: "Fast Learner", icon: "⚡", earned: totalInterviews >= 5 },
          { name: "Code Master", icon: "💻", earned: averageScore >= 75 },
          { name: "Communicator", icon: "🗣️", earned: streak >= 3 },
          { name: "Century Club", icon: "💯", earned: totalInterviews >= 100 },
        ];

        setStats({
          streak,
          totalInterviews,
          averageScore,
          badges: earnedBadges,
          level,
          xp: currentLevelXP,
          nextLevelXP: 100
        });
      } catch (error) {
        console.error("Error loading stats:", error);
      }
    };

    loadStats();
    const interval = setInterval(loadStats, 30000);
    return () => clearInterval(interval);
  }, []);

  const calculateStreak = (history: any[]): number => {
    if (history.length === 0) return 0;
    const sorted = [...history].sort((a, b) =>
      new Date(b.timestamp || b.date).getTime() -
      new Date(a.timestamp || a.date).getTime()
    );
    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < sorted.length; i++) {
      const interviewDate = new Date(sorted[i].timestamp || sorted[i].date);
      interviewDate.setHours(0, 0, 0, 0);
      const daysDiff = Math.floor(
        (today.getTime() - interviewDate.getTime()) / (1000 * 60 * 60 * 24)
      );
      if (daysDiff === streak) {
        streak++;
      } else if (daysDiff > streak) {
        break;
      }
    }
    return streak;
  };

  const xpProgress = stats.nextLevelXP > 0 ? (stats.xp / stats.nextLevelXP) * 100 : 0;
  const earnedBadgesCount = stats.badges.filter(b => b.earned).length;

  return (
    <Card className="p-6 bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20 sticky top-4">
      <div className="space-y-6">
        {/* Level Progress */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-primary" />
              <span className="font-semibold">Level {stats.level}</span>
            </div>
            <span className="text-sm text-muted-foreground">
              {stats.xp} / {stats.nextLevelXP} XP
            </span>
          </div>
          <Progress value={xpProgress} className="h-2" />
          <p className="text-xs text-muted-foreground mt-1">
            {stats.nextLevelXP - stats.xp} XP to next level
          </p>
        </div>

        {/* Streak */}
        <div className="flex items-center justify-between p-4 bg-background/50 rounded-lg">
          <div className="flex items-center gap-3">
            <Flame className="h-6 w-6 text-orange-500" />
            <div>
              <p className="font-semibold text-lg">
                {stats.streak} Day Streak
              </p>
              <p className="text-xs text-muted-foreground">
                {stats.streak > 0 ? "Keep it up! 🔥" : "Start today!"}
              </p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 bg-background/50 rounded-lg">
            <Trophy className="h-5 w-5 text-primary mb-1" />
            <p className="text-2xl font-bold">{stats.totalInterviews}</p>
            <p className="text-xs text-muted-foreground">Interviews</p>
          </div>
          <div className="p-3 bg-background/50 rounded-lg">
            <TrendingUp className="h-5 w-5 text-success mb-1" />
            <p className="text-2xl font-bold">{stats.averageScore > 0 ? `${stats.averageScore}%` : "--"}</p>
            <p className="text-xs text-muted-foreground">Avg Score</p>
          </div>
        </div>

        {/* Badges */}
        <div>
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <Trophy className="h-4 w-4" />
            Achievements ({earnedBadgesCount}/{stats.badges.length})
          </h3>
          <div className="grid grid-cols-5 gap-2">
            {stats.badges.map((badge, idx) => (
              <div
                key={idx}
                className={`p-2 rounded-lg text-center transition-all ${
                  badge.earned
                    ? "bg-primary/20 border border-primary/30"
                    : "bg-muted/50 opacity-40 grayscale"
                }`}
                title={badge.name}
              >
                <div className="text-2xl mb-1">{badge.icon}</div>
                <p className="text-[10px] font-medium leading-tight">{badge.name}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Dynamic Progress */}
        {stats.totalInterviews === 0 && (
          <div className="p-4 bg-gradient-to-r from-primary/20 to-accent/20 rounded-lg border border-primary/30">
            <Badge variant="secondary" className="text-xs mb-2">Getting Started</Badge>
            <p className="text-sm font-medium">Complete your first interview!</p>
            <p className="text-xs text-muted-foreground mt-1">Earn 50 XP and unlock badges</p>
          </div>
        )}

        {stats.totalInterviews > 0 && stats.totalInterviews < 5 && (
          <div className="p-4 bg-gradient-to-r from-primary/20 to-accent/20 rounded-lg border border-primary/30">
            <Badge variant="secondary" className="text-xs mb-2">Next Goal</Badge>
            <p className="text-sm font-medium">Complete {5 - stats.totalInterviews} more interviews</p>
            <div className="flex items-center gap-2 mt-2">
              <Progress value={(stats.totalInterviews / 5) * 100} className="h-1 flex-1" />
              <span className="text-xs">{stats.totalInterviews}/5</span>
            </div>
          </div>
        )}

        {stats.totalInterviews >= 5 && (
          <div className="p-4 bg-gradient-to-r from-success/20 to-primary/20 rounded-lg border border-success/30">
            <Badge variant="secondary" className="text-xs bg-success/20 mb-2">On Fire! 🔥</Badge>
            <p className="text-sm font-medium">Great progress!</p>
            <p className="text-xs text-muted-foreground mt-1">Keep practicing to level up</p>
          </div>
        )}
      </div>
    </Card>
  );
};

export default GamificationPanel;
