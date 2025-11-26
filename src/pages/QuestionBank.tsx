import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Target,
  Plus,
  Search,
  Filter,
  BookOpen,
  Download,
  Upload,
  Trash2,
  Edit,
  ArrowLeft,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import type { CustomQuestion, QuestionTemplate } from "@/types/questionBank";
import QuestionForm from "@/components/QuestionForm";
import TemplateCard from "@/components/TemplateCard";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const QuestionBank = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [myQuestions, setMyQuestions] = useState<CustomQuestion[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<CustomQuestion | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [communityTemplates, setCommunityTemplates] = useState<QuestionTemplate[]>([]);

  useEffect(() => {
    loadQuestions();
    loadCommunityTemplates();
  }, []);

  const loadQuestions = () => {
    const stored = localStorage.getItem("customQuestions");
    if (stored) {
      setMyQuestions(JSON.parse(stored));
    }
  };

  const loadCommunityTemplates = () => {
    // Simulated community templates
    const templates: QuestionTemplate[] = [
      {
        id: "1",
        name: "FAANG Behavioral Pack",
        description: "50+ behavioral questions commonly asked at top tech companies",
        category: "Behavioral",
        questions: [],
        isPublic: true,
        author: "Sarah Chen",
        downloads: 1243,
        rating: 4.8,
        createdAt: new Date("2024-01-15"),
        updatedAt: new Date("2024-01-15"),
      },
      {
        id: "2",
        name: "System Design Essentials",
        description: "Core system design questions covering scalability, databases, and architecture",
        category: "System Design",
        questions: [],
        isPublic: true,
        author: "Michael Rodriguez",
        downloads: 987,
        rating: 4.9,
        createdAt: new Date("2024-02-01"),
        updatedAt: new Date("2024-02-01"),
      },
      {
        id: "3",
        name: "Frontend Masters",
        description: "React, Vue, and modern JavaScript interview questions",
        category: "Technical",
        questions: [],
        isPublic: true,
        author: "Alex Johnson",
        downloads: 2156,
        rating: 4.7,
        createdAt: new Date("2024-01-20"),
        updatedAt: new Date("2024-01-20"),
      },
      {
        id: "4",
        name: "LeetCode Premium Selection",
        description: "Hand-picked coding challenges from easy to hard",
        category: "Coding",
        questions: [],
        isPublic: true,
        author: "Priya Sharma",
        downloads: 3421,
        rating: 4.9,
        createdAt: new Date("2023-12-10"),
        updatedAt: new Date("2023-12-10"),
      },
      {
        id: "5",
        name: "Leadership & Management",
        description: "Questions for senior and leadership roles",
        category: "Behavioral",
        questions: [],
        isPublic: true,
        author: "David Kim",
        downloads: 654,
        rating: 4.6,
        createdAt: new Date("2024-02-15"),
        updatedAt: new Date("2024-02-15"),
      },
      {
        id: "6",
        name: "Cloud Architecture Deep Dive",
        description: "AWS, Azure, GCP architecture and design patterns",
        category: "System Design",
        questions: [],
        isPublic: true,
        author: "Emma Watson",
        downloads: 1876,
        rating: 4.8,
        createdAt: new Date("2024-01-05"),
        updatedAt: new Date("2024-01-05"),
      },
    ];
    setCommunityTemplates(templates);
  };

  const saveQuestions = (questions: CustomQuestion[]) => {
    localStorage.setItem("customQuestions", JSON.stringify(questions));
    setMyQuestions(questions);
  };

  const handleAddQuestion = (question: CustomQuestion) => {
    const updated = [...myQuestions, question];
    saveQuestions(updated);
    setShowForm(false);
    toast({
      title: "Question added!",
      description: "Your custom question has been saved.",
    });
  };

  const handleUpdateQuestion = (question: CustomQuestion) => {
    const updated = myQuestions.map((q) => (q.id === question.id ? question : q));
    saveQuestions(updated);
    setEditingQuestion(null);
    toast({
      title: "Question updated!",
      description: "Your changes have been saved.",
    });
  };

  const handleDeleteQuestion = (id: string) => {
    const updated = myQuestions.filter((q) => q.id !== id);
    saveQuestions(updated);
    setDeleteDialog(null);
    toast({
      title: "Question deleted",
      description: "The question has been removed.",
    });
  };

  const handleDownloadTemplate = (template: QuestionTemplate) => {
    toast({
      title: "Template imported!",
      description: `${template.name} has been added to your question bank.`,
    });
  };

  const handleExportQuestions = () => {
    const dataStr = JSON.stringify(myQuestions, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "my-questions.json";
    link.click();
    toast({
      title: "Questions exported!",
      description: "Your questions have been downloaded.",
    });
  };

  const filteredQuestions = myQuestions.filter((q) => {
    const matchesSearch =
      q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = filterType === "all" || q.type === filterType;
    return matchesSearch && matchesType;
  });

  const stats = {
    total: myQuestions.length,
    behavioral: myQuestions.filter((q) => q.type === "behavioral").length,
    technical: myQuestions.filter((q) => q.type === "technical").length,
    systemDesign: myQuestions.filter((q) => q.type === "system-design").length,
    coding: myQuestions.filter((q) => q.type === "coding").length,
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/40 backdrop-blur-sm sticky top-0 z-50 bg-background/80">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Question Bank
            </span>
          </div>
          <Button variant="ghost" onClick={() => navigate("/dashboard")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="my-questions" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="my-questions">My Questions</TabsTrigger>
            <TabsTrigger value="community">Community Templates</TabsTrigger>
          </TabsList>

          <TabsContent value="my-questions" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <Card className="p-4">
                <p className="text-sm text-muted-foreground mb-1">Total</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </Card>
              <Card className="p-4">
                <p className="text-sm text-muted-foreground mb-1">Behavioral</p>
                <p className="text-2xl font-bold">{stats.behavioral}</p>
              </Card>
              <Card className="p-4">
                <p className="text-sm text-muted-foreground mb-1">Technical</p>
                <p className="text-2xl font-bold">{stats.technical}</p>
              </Card>
              <Card className="p-4">
                <p className="text-sm text-muted-foreground mb-1">System Design</p>
                <p className="text-2xl font-bold">{stats.systemDesign}</p>
              </Card>
              <Card className="p-4">
                <p className="text-sm text-muted-foreground mb-1">Coding</p>
                <p className="text-2xl font-bold">{stats.coding}</p>
              </Card>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-2">
              <Button onClick={() => setShowForm(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Question
              </Button>
              <Button variant="outline" onClick={handleExportQuestions} disabled={myQuestions.length === 0}>
                <Download className="mr-2 h-4 w-4" />
                Export Questions
              </Button>
            </div>

            {/* Question Form */}
            {(showForm || editingQuestion) && (
              <QuestionForm
                onSubmit={editingQuestion ? handleUpdateQuestion : handleAddQuestion}
                onCancel={() => {
                  setShowForm(false);
                  setEditingQuestion(null);
                }}
                initialData={editingQuestion || undefined}
              />
            )}

            {/* Search and Filter */}
            {!showForm && !editingQuestion && (
              <>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search questions..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={filterType} onValueChange={setFilterType}>
                    <SelectTrigger className="w-[200px]">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="behavioral">Behavioral</SelectItem>
                      <SelectItem value="technical">Technical</SelectItem>
                      <SelectItem value="system-design">System Design</SelectItem>
                      <SelectItem value="coding">Coding</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Questions List */}
                <div className="space-y-4">
                  {filteredQuestions.length === 0 ? (
                    <Card className="p-12 text-center">
                      <BookOpen className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                      <h3 className="text-xl font-semibold mb-2">No questions yet</h3>
                      <p className="text-muted-foreground mb-4">
                        Start building your custom question bank
                      </p>
                      <Button onClick={() => setShowForm(true)}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Your First Question
                      </Button>
                    </Card>
                  ) : (
                    filteredQuestions.map((question) => (
                      <Card key={question.id} className="p-6">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant="outline">{question.type}</Badge>
                              <Badge variant="secondary">{question.difficulty}</Badge>
                              <Badge>{question.category}</Badge>
                            </div>
                            <p className="text-lg font-medium mb-2">{question.question}</p>
                            {question.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1">
                                {question.tags.map((tag) => (
                                  <Badge key={tag} variant="outline" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setEditingQuestion(question)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setDeleteDialog(question.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        {question.hint && (
                          <div className="mt-3 p-3 bg-accent/30 rounded text-sm">
                            <p className="font-semibold mb-1">Hint:</p>
                            <p className="text-muted-foreground">{question.hint}</p>
                          </div>
                        )}
                      </Card>
                    ))
                  )}
                </div>
              </>
            )}
          </TabsContent>

          <TabsContent value="community" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-2">Community Templates</h2>
                <p className="text-muted-foreground">
                  Import pre-made question packs from the community
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {communityTemplates.map((template) => (
                <TemplateCard
                  key={template.id}
                  template={template}
                  onDownload={handleDownloadTemplate}
                />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteDialog} onOpenChange={() => setDeleteDialog(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Question</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this question? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => deleteDialog && handleDeleteQuestion(deleteDialog)}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default QuestionBank;
