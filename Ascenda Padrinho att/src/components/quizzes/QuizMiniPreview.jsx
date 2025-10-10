import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "@/i18n";

export function QuizMiniPreview({ data }) {
  const { t } = useTranslation();

  if (!data) {
    return null;
  }

  const easy = data.easy || [];
  const intermediate = data.intermediate || [];
  const advanced = data.advanced || [];
  const total = easy.length + intermediate.length + advanced.length;

  return (
    <Card className="border border-brand/30 bg-brand/5">
      <CardHeader className="pb-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <CardTitle className="text-base font-semibold text-primary">
            {data.topic || t("courseForm.quizzes.previewTitle", "Custom quiz")}
          </CardTitle>
          <Badge variant="outline" className="border-brand/30 bg-brand/10 text-brand">
            {t("courseForm.quizzes.totalLabel", "Total")}: {total}
          </Badge>
        </div>
        {data.generatedAt && (
          <p className="text-xs text-muted">
            {t("courseForm.quizzes.generatedAt", "Generated at")}: {new Date(data.generatedAt).toLocaleString()}
          </p>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        <DifficultyList
          title={t("courseForm.quizzes.easyLabel", "Easy questions")}
          questions={easy}
          accent="text-emerald-600"
        />
        <DifficultyList
          title={t("courseForm.quizzes.intermediateLabel", "Intermediate questions")}
          questions={intermediate}
          accent="text-amber-600"
        />
        <DifficultyList
          title={t("courseForm.quizzes.advancedLabel", "Advanced questions")}
          questions={advanced}
          accent="text-rose-600"
        />
      </CardContent>
    </Card>
  );
}

function DifficultyList({ title, questions, accent }) {
  if (!questions?.length) {
    return null;
  }

  return (
    <div className="space-y-1">
      <p className={`text-xs font-semibold ${accent}`}>{title}</p>
      <ul className="space-y-1 text-xs text-muted">
        {questions.slice(0, 3).map((question, index) => (
          <li key={question.id || index} className="flex items-start gap-2">
            <span className="mt-1 block h-1.5 w-1.5 rounded-full bg-current" />
            <span>{question.prompt || question.question || String(question)}</span>
          </li>
        ))}
        {questions.length > 3 && (
          <li className="italic text-muted">
            +{questions.length - 3}
            {questions.length - 3 === 1 ? " more question" : " more questions"}
          </li>
        )}
      </ul>
    </div>
  );
}

