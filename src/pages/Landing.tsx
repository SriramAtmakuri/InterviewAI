import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Mic, Code, BarChart, MessageSquare, Zap, Target } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-secondary/20 to-background">
      {/* Header */}
      <header className="border-b border-border/40 backdrop-blur-sm sticky top-0 z-50 bg-background/80">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              InterviewAI
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate("/auth")}>
              Sign In
            </Button>
            <Button onClick={() => navigate("/auth")}>
              Get Started <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
          <h1 className="text-6xl font-bold tracking-tight">
            Master Your Next
            <span className="block bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-gradient">
              Technical Interview
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Practice with AI-powered mock interviews. Get real-time feedback, tackle coding challenges,
            and build confidence before the real thing.
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" className="text-lg" onClick={() => navigate("/auth")}>
              Start Practicing Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" className="text-lg">
              Watch Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-4xl font-bold text-center mb-12">
          Everything You Need to <span className="text-primary">Ace Interviews</span>
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="p-6 hover:shadow-lg transition-shadow border-2 hover:border-primary/50">
            <MessageSquare className="h-12 w-12 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">AI Interviewer</h3>
            <p className="text-muted-foreground">
              Natural conversation flow with dynamic follow-up questions based on your answers.
            </p>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow border-2 hover:border-accent/50">
            <Code className="h-12 w-12 text-accent mb-4" />
            <h3 className="text-xl font-semibold mb-2">Live Coding</h3>
            <p className="text-muted-foreground">
              Practice coding challenges with syntax highlighting and multi-language support.
            </p>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow border-2 hover:border-success/50">
            <Mic className="h-12 w-12 text-success mb-4" />
            <h3 className="text-xl font-semibold mb-2">Voice & Text</h3>
            <p className="text-muted-foreground">
              Answer questions using voice or text. Practice your communication skills naturally.
            </p>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow border-2 hover:border-primary/50">
            <BarChart className="h-12 w-12 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Detailed Feedback</h3>
            <p className="text-muted-foreground">
              Get comprehensive performance reports with strengths and areas to improve.
            </p>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow border-2 hover:border-accent/50">
            <Zap className="h-12 w-12 text-accent mb-4" />
            <h3 className="text-xl font-semibold mb-2">Real-Time Evaluation</h3>
            <p className="text-muted-foreground">
              Instant AI assessment of your technical knowledge and problem-solving approach.
            </p>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow border-2 hover:border-success/50">
            <Target className="h-12 w-12 text-success mb-4" />
            <h3 className="text-xl font-semibold mb-2">Tailored Questions</h3>
            <p className="text-muted-foreground">
              Job-specific questions based on your target role and company requirements.
            </p>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <Card className="p-12 text-center bg-gradient-to-br from-primary/10 via-accent/5 to-primary/10 border-2 border-primary/20">
          <h2 className="text-4xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of developers who've landed their dream jobs with our AI-powered interview prep.
          </p>
          <Button size="lg" className="text-lg" onClick={() => navigate("/auth")}>
            Start Your Free Practice Session
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>© 2024 InterviewAI. Built with ❤️ for aspiring developers.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
