import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import type { CustomQuestion } from "@/types/questionBank";

interface QuestionFormProps {
  onSubmit: (question: CustomQuestion) => void;
  onCancel: () => void;
  initialData?: CustomQuestion;
}

const QuestionForm = ({ onSubmit, onCancel, initialData }: QuestionFormProps) => {
  const [formData, setFormData] = useState<Partial<CustomQuestion>>(
    initialData || {
      type: "behavioral",
      difficulty: "mid",
      question: "",
      category: "",
      tags: [],
      hint: "",
      sampleAnswer: "",
    }
  );
  const [tagInput, setTagInput] = useState("");

  const handleAddTag = () => {
    if (tagInput.trim() && formData.tags && !formData.tags.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...(formData.tags || []), tagInput.trim()],
      });
      setTagInput("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    setFormData({
      ...formData,
      tags: formData.tags?.filter((t) => t !== tag) || [],
    });
  };

  const handleSubmit = () => {
    if (!formData.question || !formData.category) return;

    const question: CustomQuestion = {
      id: initialData?.id || Date.now().toString(),
      type: formData.type as any,
      difficulty: formData.difficulty as any,
      question: formData.question,
      category: formData.category,
      tags: formData.tags || [],
      hint: formData.hint,
      sampleAnswer: formData.sampleAnswer,
      createdAt: initialData?.createdAt || new Date(),
      updatedAt: new Date(),
    };

    onSubmit(question);
  };

  return (
    <Card className="p-6">
      <h3 className="text-xl font-semibold mb-6">
        {initialData ? "Edit Question" : "Add New Question"}
      </h3>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Question Type *</Label>
            <Select
              value={formData.type}
              onValueChange={(value) => setFormData({ ...formData, type: value as any })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="behavioral">Behavioral</SelectItem>
                <SelectItem value="technical">Technical</SelectItem>
                <SelectItem value="system-design">System Design</SelectItem>
                <SelectItem value="coding">Coding</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Difficulty Level *</Label>
            <Select
              value={formData.difficulty}
              onValueChange={(value) => setFormData({ ...formData, difficulty: value as any })}
            >
              <SelectTrigger>
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
        </div>

        <div className="space-y-2">
          <Label>Category *</Label>
          <Input
            placeholder="e.g., Leadership, Algorithms, Cloud Architecture"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label>Question *</Label>
          <Textarea
            placeholder="Enter the interview question..."
            value={formData.question}
            onChange={(e) => setFormData({ ...formData, question: e.target.value })}
            className="min-h-[100px]"
          />
        </div>

        <div className="space-y-2">
          <Label>Tags</Label>
          <div className="flex gap-2">
            <Input
              placeholder="Add tags (e.g., React, Leadership)"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddTag();
                }
              }}
            />
            <Button type="button" variant="outline" onClick={handleAddTag}>
              Add
            </Button>
          </div>
          {formData.tags && formData.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="gap-1">
                  {tag}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => handleRemoveTag(tag)}
                  />
                </Badge>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label>Hint (Optional)</Label>
          <Textarea
            placeholder="Provide a hint for candidates..."
            value={formData.hint}
            onChange={(e) => setFormData({ ...formData, hint: e.target.value })}
            className="min-h-[80px]"
          />
        </div>

        <div className="space-y-2">
          <Label>Sample Answer (Optional)</Label>
          <Textarea
            placeholder="Provide a sample good answer..."
            value={formData.sampleAnswer}
            onChange={(e) => setFormData({ ...formData, sampleAnswer: e.target.value })}
            className="min-h-[100px]"
          />
        </div>

        <div className="flex gap-2 pt-4">
          <Button onClick={handleSubmit} disabled={!formData.question || !formData.category}>
            {initialData ? "Update" : "Add"} Question
          </Button>
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default QuestionForm;
