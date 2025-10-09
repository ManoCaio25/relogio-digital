import React, { useState, useEffect, useMemo } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Youtube } from "lucide-react";
import YouTubePreview from "./YouTubePreview";
import { useTranslation } from "@/i18n";
import { useTrainingTypeOptions } from "@/utils/labels";

export default function CourseEditModal({ course, isOpen, onClose, onSave }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "Technical",
    difficulty: "Beginner",
    duration_hours: "",
    youtube_url: "",
    youtube_video_id: "",
    training_type: "webDevelopment",
  });
  const [isSaving, setIsSaving] = useState(false);
  const { t } = useTranslation();
  const allTrainingOptions = useTrainingTypeOptions(t);
  const trainingOptions = useMemo(
    () => allTrainingOptions.filter(option => option.value !== "all"),
    [allTrainingOptions]
  );
  const categoryOptions = useMemo(
    () => [
      { value: "Technical", label: t("courseForm.categories.technical") },
      { value: "Leadership", label: t("courseForm.categories.leadership") },
      { value: "Communication", label: t("courseForm.categories.communication") },
      { value: "Design", label: t("courseForm.categories.design") },
      { value: "Business", label: t("courseForm.categories.business") },
    ],
    [t],
  );
  const difficultyOptions = useMemo(
    () => [
      { value: "Beginner", label: t("courseForm.difficulties.beginner") },
      { value: "Intermediate", label: t("courseForm.difficulties.intermediate") },
      { value: "Advanced", label: t("courseForm.difficulties.advanced") },
    ],
    [t],
  );
  const selectedCategoryLabel = useMemo(() => {
    return categoryOptions.find((option) => option.value === formData.category)?.label ?? "";
  }, [categoryOptions, formData.category]);
  const selectedDifficultyLabel = useMemo(() => {
    return difficultyOptions.find((option) => option.value === formData.difficulty)?.label ?? "";
  }, [difficultyOptions, formData.difficulty]);
  const selectedTrainingLabel = useMemo(() => {
    return trainingOptions.find((option) => option.value === formData.training_type)?.label ?? "";
  }, [formData.training_type, trainingOptions]);

  useEffect(() => {
    if (course) {
      setFormData({
        title: course.title || "",
        description: course.description || "",
        category: course.category || "Technical",
        difficulty: course.difficulty || "Beginner",
        duration_hours: course.duration_hours?.toString() || "",
        youtube_url: course.youtube_url || "",
        youtube_video_id: course.youtube_video_id || "",
        training_type: course.training_type || "webDevelopment",
      });
    }
  }, [course]);

  const handleVideoIdChange = (videoId) => {
    setFormData(prev => ({ ...prev, youtube_video_id: videoId }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const updatedData = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        difficulty: formData.difficulty,
        training_type: formData.training_type,
        duration_hours: parseFloat(formData.duration_hours) || 0
      };

      if (formData.youtube_video_id) {
        updatedData.youtube_url = formData.youtube_url;
        updatedData.youtube_video_id = formData.youtube_video_id;
      } else {
        updatedData.youtube_url = null;
        updatedData.youtube_video_id = null;
      }

      await onSave(updatedData);
      onClose();
    } catch (error) {
      console.error("Error saving course:", error);
    }

    setIsSaving(false);
  };

  if (!course) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-surface border-border text-primary">
        <DialogHeader>
          <DialogTitle className="text-primary">{t("courseEdit.title")}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="edit-title" className="text-secondary">{t("courseForm.titleLabel")}</Label>
            <Input
              id="edit-title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              className="bg-surface2 border-border text-primary"
            />
          </div>

          <div>
            <Label htmlFor="edit-description" className="text-secondary">{t("courseForm.descriptionLabel")}</Label>
            <Textarea
              id="edit-description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              className="bg-surface2 border-border text-primary h-24"
            />
          </div>

          <div className="grid grid-cols-3 gap-4 lg:grid-cols-4">
            <div>
              <Label htmlFor="edit-category" className="text-secondary">{t("courseForm.categoryLabel")}</Label>
              <Select
                id="edit-category"
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger className="bg-surface2 border-border text-primary">
                  <SelectValue>
                    {selectedCategoryLabel}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="bg-surface border-border">
                  {categoryOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="edit-difficulty" className="text-secondary">{t("courseForm.difficultyLabel")}</Label>
              <Select
                id="edit-difficulty"
                value={formData.difficulty}
                onValueChange={(value) => setFormData({ ...formData, difficulty: value })}
              >
                <SelectTrigger className="bg-surface2 border-border text-primary">
                  <SelectValue>
                    {selectedDifficultyLabel}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="bg-surface border-border">
                  {difficultyOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="edit-training-type" className="text-secondary">{t("courseForm.trainingTypeLabel")}</Label>
              <Select
                id="edit-training-type"
                value={formData.training_type}
                onValueChange={(value) => setFormData({ ...formData, training_type: value })}
              >
                <SelectTrigger className="bg-surface2 border-border text-primary">
                  <SelectValue>
                    {selectedTrainingLabel}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="bg-surface border-border">
                  {trainingOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="edit-duration" className="text-secondary">{t("courseForm.durationLabel")}</Label>
              <Input
                id="edit-duration"
                type="number"
                step="0.5"
                value={formData.duration_hours}
                onChange={(e) => setFormData({ ...formData, duration_hours: e.target.value })}
                className="bg-surface2 border-border text-primary"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="edit-youtube" className="text-secondary flex items-center gap-2">
              <Youtube className="w-4 h-4 text-error" />
              {t("courseForm.youtubeLabel")}
            </Label>
            <Input
              id="edit-youtube"
              value={formData.youtube_url}
              onChange={(e) => setFormData({ ...formData, youtube_url: e.target.value })}
              placeholder={t("common.placeholders.youtubeUrl")}
              className="bg-surface2 border-border text-primary placeholder:text-muted"
            />
            <YouTubePreview
              url={formData.youtube_url}
              onVideoIdChange={handleVideoIdChange}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-border"
            >
              {t("common.actions.cancel")}
            </Button>
            <Button
              type="submit"
              disabled={isSaving}
              className="bg-brand hover:bg-brand/90 text-white"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {t("common.actions.saving")}
                </>
              ) : (
                t("courseEdit.save")
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}