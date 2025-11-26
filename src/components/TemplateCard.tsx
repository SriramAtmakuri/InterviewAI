import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, Star, User, Calendar } from "lucide-react";
import type { QuestionTemplate } from "@/types/questionBank";

interface TemplateCardProps {
  template: QuestionTemplate;
  onDownload: (template: QuestionTemplate) => void;
  showActions?: boolean;
}

const TemplateCard = ({ template, onDownload, showActions = true }: TemplateCardProps) => {
  const stats = {
    behavioral: template.questions.filter((q) => q.type === "behavioral").length,
    technical: template.questions.filter((q) => q.type === "technical").length,
    systemDesign: template.questions.filter((q) => q.type === "system-design").length,
    coding: template.questions.filter((q) => q.type === "coding").length,
  };

  return (
    <Card className="p-6 hover:border-primary/50 transition-colors">
      <div className="space-y-4">
        <div>
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-semibold text-lg">{template.name}</h3>
            {template.isPublic && (
              <Badge variant="secondary" className="gap-1">
                <Star className="h-3 w-3 fill-current" />
                {template.rating.toFixed(1)}
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {template.description}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Badge variant="outline">{template.category}</Badge>
          {stats.behavioral > 0 && (
            <Badge variant="secondary">{stats.behavioral} Behavioral</Badge>
          )}
          {stats.technical > 0 && (
            <Badge variant="secondary">{stats.technical} Technical</Badge>
          )}
          {stats.systemDesign > 0 && (
            <Badge variant="secondary">{stats.systemDesign} System Design</Badge>
          )}
          {stats.coding > 0 && <Badge variant="secondary">{stats.coding} Coding</Badge>}
        </div>

        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <User className="h-3 w-3" />
            {template.author}
          </div>
          <div className="flex items-center gap-1">
            <Download className="h-3 w-3" />
            {template.downloads}
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {new Date(template.createdAt).toLocaleDateString()}
          </div>
        </div>

        {showActions && (
          <Button onClick={() => onDownload(template)} className="w-full" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Import Template
          </Button>
        )}
      </div>
    </Card>
  );
};

export default TemplateCard;
