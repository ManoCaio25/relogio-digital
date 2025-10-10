import React from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useTranslation } from "@/i18n";

function normaliseQuestionList(rawValue) {
  return rawValue
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((prompt, index) => ({ id: `${index}`, prompt }));
}

export function QuizGeneratorModal({
  defaultYoutubeUrl = "",
  defaultFiles = [],
  defaultText = "",
  onClose,
  onSave,
}) {
  const { t } = useTranslation();
  const [topic, setTopic] = React.useState("");
  const [easyQuestions, setEasyQuestions] = React.useState("");
  const [intermediateQuestions, setIntermediateQuestions] = React.useState("");
  const [advancedQuestions, setAdvancedQuestions] = React.useState("");
  const [notes, setNotes] = React.useState("");
  const [isSaving, setIsSaving] = React.useState(false);

  const handleSubmit = React.useCallback(
    (event) => {
      event.preventDefault();
      if (!onSave) return;

      setIsSaving(true);

      const payload = {
        topic: topic || t("courseForm.quizzes.defaultTopic", "Custom quiz"),
        easy: normaliseQuestionList(easyQuestions),
        intermediate: normaliseQuestionList(intermediateQuestions),
        advanced: normaliseQuestionList(advancedQuestions),
        generatedAt: new Date().toISOString(),
        source: {
          youtubeUrl: defaultYoutubeUrl,
          files: defaultFiles.map((file) => ({
            name: file.name,
            size: file.size,
            type: file.type,
          })),
          text: defaultText,
          notes,
        },
      };

      onSave(payload);
      setIsSaving(false);
    },
    [advancedQuestions, defaultFiles, defaultText, defaultYoutubeUrl, easyQuestions, intermediateQuestions, notes, onSave, t, topic],
  );

  const handleClose = React.useCallback(() => {
    if (isSaving) return;
    onClose?.();
  }, [isSaving, onClose]);

  return (
    <Dialog open onOpenChange={(open) => (!open ? handleClose() : null)}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t("courseForm.quizzes.modalTitle", "Create custom quiz")}</DialogTitle>
          <DialogDescription>
            {t(
              "courseForm.quizzes.modalDescription",
              "Use the fields below to craft a quiz. Add one question per line for each difficulty level.",
            )}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 p-6">
          <div className="space-y-2">
            <Label htmlFor="quiz-topic">{t("courseForm.quizzes.topicLabel", "Quiz topic")}</Label>
            <Input
              id="quiz-topic"
              value={topic}
              onChange={(event) => setTopic(event.target.value)}
              placeholder={t("courseForm.quizzes.topicPlaceholder", "e.g. Introduction to SAP")}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <QuestionBlock
              id="quiz-easy"
              label={t("courseForm.quizzes.easyLabel", "Easy questions")}
              helper={t(
                "courseForm.quizzes.easyHelper",
                "Add quick knowledge-check questions. One per line.",
              )}
              value={easyQuestions}
              onChange={setEasyQuestions}
            />
            <QuestionBlock
              id="quiz-intermediate"
              label={t("courseForm.quizzes.intermediateLabel", "Intermediate questions")}
              helper={t(
                "courseForm.quizzes.intermediateHelper",
                "Test deeper understanding. One per line.",
              )}
              value={intermediateQuestions}
              onChange={setIntermediateQuestions}
            />
            <QuestionBlock
              id="quiz-advanced"
              label={t("courseForm.quizzes.advancedLabel", "Advanced questions")}
              helper={t(
                "courseForm.quizzes.advancedHelper",
                "Challenge your learners. One per line.",
              )}
              value={advancedQuestions}
              onChange={setAdvancedQuestions}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="quiz-notes">{t("courseForm.quizzes.notesLabel", "Additional notes")}</Label>
            <Textarea
              id="quiz-notes"
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              placeholder={t(
                "courseForm.quizzes.notesPlaceholder",
                "Provide extra context for reviewers or learners.",
              )}
              className="min-h-[120px]"
            />
          </div>

          {(defaultYoutubeUrl || defaultText || defaultFiles.length > 0) && (
            <div className="space-y-2 rounded-xl border border-border/60 bg-surface2/70 p-4 text-sm text-muted">
              <p className="font-semibold text-primary">
                {t("courseForm.quizzes.sourceTitle", "Generation sources")}
              </p>
              {defaultYoutubeUrl && (
                <p>
                  {t("courseForm.quizzes.youtubeSource", "YouTube video")}:{" "}
                  <span className="font-medium text-primary">{defaultYoutubeUrl}</span>
                </p>
              )}
              {defaultText && (
                <p>
                  {t("courseForm.quizzes.textSource", "Provided text excerpt")}:
                  <span className="block whitespace-pre-wrap rounded-lg bg-background/60 p-3 text-xs text-foreground/80">
                    {defaultText}
                  </span>
                </p>
              )}
              {defaultFiles.length > 0 && (
                <ul className="space-y-1">
                  {defaultFiles.map((file) => (
                    <li key={file.name} className="flex items-center justify-between text-xs">
                      <span className="text-muted">{file.name}</span>
                      <span className="font-medium text-primary">
                        {Math.round(file.size / 1024)} KB
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          <DialogFooter>
            <Button type="button" variant="ghost" onClick={handleClose} disabled={isSaving}>
              {t("common.actions.cancel")}
            </Button>
            <Button type="submit" className="bg-brand text-white hover:bg-brand/90" disabled={isSaving}>
              {isSaving ? t("common.actions.saving") : t("common.actions.save")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function QuestionBlock({ id, label, helper, value, onChange }) {
  const handleChange = React.useCallback(
    (event) => onChange?.(event.target.value),
    [onChange],
  );

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Textarea
        id={id}
        value={value}
        onChange={handleChange}
        placeholder={helper}
        className="min-h-[160px]"
      />
      <p className="text-xs text-muted">{helper}</p>
      <p className="text-xs text-muted/80">
        {value.split("\n").filter(Boolean).length} {" "}
        {value.split("\n").filter(Boolean).length === 1 ? "question" : "questions"}
      </p>
    </div>
  );
}

