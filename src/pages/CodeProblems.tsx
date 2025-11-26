import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  Target,
  ArrowLeft,
  Code,
  Search,
  Filter,
  TrendingUp,
  Award,
  CheckCircle2,
  Circle,
  Lightbulb,
  Play,
} from "lucide-react";
import { codingProblems, getProblemById } from "@/data/codingProblems";
import type { CodingProblem } from "@/types/codingProblem";
import CodeEditor from "@/components/CodeEditor";

const CodeProblems = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [selectedProblem, setSelectedProblem] = useState<CodingProblem | null>(null);
  const [showHints, setShowHints] = useState(false);
  const [revealedHints, setRevealedHints] = useState<number>(0);

  // Mock solved problems (in real app, fetch from backend)
  const solvedProblems = new Set(['two-sum', 'valid-parentheses']);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy':
        return 'bg-success/10 text-success border-success/20';
      case 'Medium':
        return 'bg-warning/10 text-warning border-warning/20';
      case 'Hard':
        return 'bg-destructive/10 text-destructive border-destructive/20';
      default:
        return 'bg-muted';
    }
  };

  // Filter problems
  const filteredProblems = codingProblems.filter((problem) => {
    const matchesSearch =
      problem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      problem.category.some((c) => c.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesDifficulty =
      difficultyFilter === 'all' || problem.difficulty === difficultyFilter;

    const matchesCategory =
      categoryFilter === 'all' || problem.category.includes(categoryFilter);

    return matchesSearch && matchesDifficulty && matchesCategory;
  });

  // Get unique categories
  const categories = Array.from(
    new Set(codingProblems.flatMap((p) => p.category))
  ).sort();

  // Calculate stats
  const totalProblems = codingProblems.length;
  const easyProblems = codingProblems.filter((p) => p.difficulty === 'Easy').length;
  const mediumProblems = codingProblems.filter((p) => p.difficulty === 'Medium').length;
  const hardProblems = codingProblems.filter((p) => p.difficulty === 'Hard').length;

  const handleStartProblem = (problem: CodingProblem) => {
    setSelectedProblem(problem);
    setRevealedHints(0);
    setShowHints(false);
  };

  const revealNextHint = () => {
    if (selectedProblem && revealedHints < selectedProblem.hints.length) {
      setRevealedHints(revealedHints + 1);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/40 backdrop-blur-sm sticky top-0 z-50 bg-background/80">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Coding Problems
            </span>
          </div>
          <Button variant="ghost" onClick={() => navigate("/dashboard")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Stats Overview */}
          <div className="grid md:grid-cols-4 gap-4">
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold">{solvedProblems.size}/{totalProblems}</p>
                  <p className="text-sm text-muted-foreground">Problems Solved</p>
                </div>
                <Award className="h-8 w-8 text-primary" />
              </div>
              <Progress value={(solvedProblems.size / totalProblems) * 100} className="mt-2" />
            </Card>

            <Card className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-success">{easyProblems}</p>
                <p className="text-sm text-muted-foreground">Easy</p>
              </div>
            </Card>

            <Card className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-warning">{mediumProblems}</p>
                <p className="text-sm text-muted-foreground">Medium</p>
              </div>
            </Card>

            <Card className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-destructive">{hardProblems}</p>
                <p className="text-sm text-muted-foreground">Hard</p>
              </div>
            </Card>
          </div>

          {/* Filters */}
          <Card className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search problems..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Difficulties</SelectItem>
                  <SelectItem value="Easy">Easy</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Hard">Hard</SelectItem>
                </SelectContent>
              </Select>

              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </Card>

          {/* Problems List */}
          <div className="space-y-3">
            {filteredProblems.map((problem) => {
              const isSolved = solvedProblems.has(problem.id);

              return (
                <Card
                  key={problem.id}
                  className="p-4 hover:shadow-lg transition-all cursor-pointer"
                  onClick={() => handleStartProblem(problem)}
                >
                  <div className="flex items-center gap-4">
                    {isSolved ? (
                      <CheckCircle2 className="h-5 w-5 text-success flex-shrink-0" />
                    ) : (
                      <Circle className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                    )}

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold truncate">{problem.title}</h3>
                        <Badge className={getDifficultyColor(problem.difficulty)} variant="outline">
                          {problem.difficulty}
                        </Badge>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        {problem.category.slice(0, 3).map((cat) => (
                          <Badge key={cat} variant="secondary" className="text-xs">
                            {cat}
                          </Badge>
                        ))}

                        {problem.companies && problem.companies.length > 0 && (
                          <Badge variant="outline" className="text-xs">
                            {problem.companies[0]}
                            {problem.companies.length > 1 && ` +${problem.companies.length - 1}`}
                          </Badge>
                        )}

                        {problem.acceptanceRate && (
                          <span className="text-xs text-muted-foreground ml-auto">
                            {problem.acceptanceRate}% acceptance
                          </span>
                        )}
                      </div>
                    </div>

                    <Button size="sm">
                      <Play className="h-4 w-4 mr-1" />
                      Solve
                    </Button>
                  </div>
                </Card>
              );
            })}

            {filteredProblems.length === 0 && (
              <Card className="p-12 text-center">
                <Code className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-semibold mb-2">No problems found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your filters or search query
                </p>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Problem Detail Dialog */}
      <Dialog open={!!selectedProblem} onOpenChange={() => setSelectedProblem(null)}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          {selectedProblem && (
            <div className="space-y-6">
              <DialogHeader>
                <div className="flex items-center justify-between">
                  <DialogTitle className="text-2xl">{selectedProblem.title}</DialogTitle>
                  <Badge className={getDifficultyColor(selectedProblem.difficulty)}>
                    {selectedProblem.difficulty}
                  </Badge>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedProblem.category.map((cat) => (
                    <Badge key={cat} variant="secondary">
                      {cat}
                    </Badge>
                  ))}
                </div>
              </DialogHeader>

              <Tabs defaultValue="description">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="description">Description</TabsTrigger>
                  <TabsTrigger value="solution">Solution</TabsTrigger>
                  <TabsTrigger value="code">Code Editor</TabsTrigger>
                </TabsList>

                <TabsContent value="description" className="space-y-4">
                  <div className="prose dark:prose-invert max-w-none">
                    <h3>Problem Description</h3>
                    <p className="whitespace-pre-wrap">{selectedProblem.description}</p>

                    <h3>Examples</h3>
                    {selectedProblem.examples.map((example, idx) => (
                      <div key={idx} className="bg-muted p-4 rounded-lg mb-4">
                        <p className="font-semibold">Example {idx + 1}:</p>
                        <p>Input: {example.input}</p>
                        <p>Output: {example.output}</p>
                        {example.explanation && (
                          <p className="text-muted-foreground">
                            Explanation: {example.explanation}
                          </p>
                        )}
                      </div>
                    ))}

                    <h3>Constraints</h3>
                    <ul>
                      {selectedProblem.constraints.map((constraint, idx) => (
                        <li key={idx}>{constraint.description}</li>
                      ))}
                    </ul>

                    {selectedProblem.companies && selectedProblem.companies.length > 0 && (
                      <>
                        <h3>Companies</h3>
                        <div className="flex flex-wrap gap-2">
                          {selectedProblem.companies.map((company) => (
                            <Badge key={company} variant="outline">
                              {company}
                            </Badge>
                          ))}
                        </div>
                      </>
                    )}
                  </div>

                  {/* Hints Section */}
                  <Card className="p-4 bg-accent/5">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-semibold flex items-center gap-2">
                        <Lightbulb className="h-5 w-5 text-warning" />
                        Hints ({revealedHints}/{selectedProblem.hints.length})
                      </h4>
                      {revealedHints < selectedProblem.hints.length && (
                        <Button size="sm" variant="outline" onClick={revealNextHint}>
                          Reveal Hint {revealedHints + 1}
                        </Button>
                      )}
                    </div>

                    <div className="space-y-2">
                      {selectedProblem.hints.slice(0, revealedHints).map((hint, idx) => (
                        <div key={idx} className="p-3 bg-background rounded border">
                          <p className="text-sm">
                            <span className="font-medium">Hint {idx + 1}:</span> {hint}
                          </p>
                        </div>
                      ))}
                    </div>
                  </Card>
                </TabsContent>

                <TabsContent value="solution" className="space-y-4">
                  {selectedProblem.solution ? (
                    <div className="prose dark:prose-invert max-w-none">
                      <h3>Approach</h3>
                      <p>{selectedProblem.solution.approach}</p>

                      <h3>Complexity Analysis</h3>
                      <ul>
                        <li>Time Complexity: {selectedProblem.solution.complexity.time}</li>
                        <li>Space Complexity: {selectedProblem.solution.complexity.space}</li>
                      </ul>

                      <h3>Solution Code</h3>
                      {selectedProblem.solution.code.map((template) => (
                        <div key={template.language} className="mb-4">
                          <p className="font-semibold mb-2">{template.language}:</p>
                          <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
                            <code>{template.code}</code>
                          </pre>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-center py-8">
                      Solution not available yet. Try solving it yourself!
                    </p>
                  )}
                </TabsContent>

                <TabsContent value="code">
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Write your solution below and test it with the provided test cases.
                    </p>
                    <CodeEditor
                      initialCode={selectedProblem.starterCode[0]?.code || ''}
                      language="javascript"
                    />
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CodeProblems;
