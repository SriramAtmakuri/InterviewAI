import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Target, Plus, History, BarChart, LogOut, BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = () => {
    localStorage.removeItem("user");
    toast({
      title: "Signed out",
      description: "You've been successfully signed out.",
    });
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/40 backdrop-blur-sm sticky top-0 z-50 bg-background/80">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              InterviewAI
            </span>
          </div>
          <Button variant="ghost" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Welcome Section */}
          <div>
            <h1 className="text-4xl font-bold mb-2">Welcome back!</h1>
            <p className="text-muted-foreground text-lg">
              Ready to practice your next interview?
            </p>
          </div>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-4 gap-6">
            <Card 
              className="p-6 cursor-pointer hover:shadow-lg transition-all border-2 hover:border-primary/50 group"
              onClick={() => navigate("/interview/setup")}
            >
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <Plus className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">New Interview</h3>
              <p className="text-muted-foreground">
                Start a new mock interview session
              </p>
            </Card>

            <Card 
              className="p-6 cursor-pointer hover:shadow-lg transition-all border-2 hover:border-accent/50 group"
              onClick={() => navigate("/history")}
            >
              <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors">
                <History className="h-6 w-6 text-accent" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Interview History</h3>
              <p className="text-muted-foreground">
                Review past sessions and feedback
              </p>
            </Card>

            <Card 
              className="p-6 cursor-pointer hover:shadow-lg transition-all border-2 hover:border-success/50 group"
              onClick={() => navigate("/question-bank")}
            >
              <div className="h-12 w-12 rounded-lg bg-success/10 flex items-center justify-center mb-4 group-hover:bg-success/20 transition-colors">
                <BookOpen className="h-6 w-6 text-success" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Question Bank</h3>
              <p className="text-muted-foreground">
                Custom questions & templates
              </p>
            </Card>

            <Card 
              className="p-6 cursor-pointer hover:shadow-lg transition-all border-2 hover:border-warning/50 group"
              onClick={() => navigate("/analytics")}
            >
              <div className="h-12 w-12 rounded-lg bg-warning/10 flex items-center justify-center mb-4 group-hover:bg-warning/20 transition-colors">
                <BarChart className="h-6 w-6 text-warning" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Performance</h3>
              <p className="text-muted-foreground">
                Track your progress over time
              </p>
            </Card>
          </div>

          {/* Stats Overview */}
          <Card className="p-8 bg-gradient-to-br from-primary/5 to-accent/5">
            <h2 className="text-2xl font-bold mb-6">Your Progress</h2>
            <div className="grid md:grid-cols-4 gap-6">
              <div>
                <p className="text-3xl font-bold text-primary">0</p>
                <p className="text-muted-foreground">Interviews Completed</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-accent">0</p>
                <p className="text-muted-foreground">Coding Challenges</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-success">0%</p>
                <p className="text-muted-foreground">Success Rate</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-foreground">0h</p>
                <p className="text-muted-foreground">Practice Time</p>
              </div>
            </div>
          </Card>

          {/* Get Started CTA */}
          <Card className="p-8 text-center border-2 border-dashed border-border">
            <h3 className="text-2xl font-bold mb-2">Ready to start?</h3>
            <p className="text-muted-foreground mb-6">
              Begin your first mock interview and get personalized feedback
            </p>
            <Button size="lg" onClick={() => navigate("/interview/setup")}>
              <Plus className="mr-2 h-5 w-5" />
              Start Your First Interview
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
