import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  SelectViewport,
} from "@/components/ui/select";
import { UploadFile } from "@/integrations/Core";
import { Upload, Loader2, Youtube, Eye } from "lucide-react";
import YouTubePreview from "./YouTubePreview";
import { useTranslation } from "@/i18n";
import { useTrainingTypeOptions } from "@/utils/labels";

export default function CourseUploadForm({ onSuccess, onPreview }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "Technical",
    difficulty: "Beginner",
    duration_hours: "",
    file_url: "",
    youtube_url: "",
    youtube_video_id: "",
    training_type: "webDevelopment",
  });
  const [isUploading, setIsUploading] = useState(false);
  const [file, setFile] = useState(null);
  const [previewData, setPreviewData] = useState(null);
  const { t } = useTranslation();
  const allTrainingOptions = useTrainingTypeOptions(t);
  const trainingOptions = useMemo(
    () => allTrainingOptions.filter(option => option.value !== "all"),
    [allTrainingOptions]
  );
  const selectContentClassName =
    "z-[9999] rounded-xl border border-border/60 bg-surface p-0 shadow-e3 w-[var(--radix-select-trigger-width)] min-w-[12rem]";

  const handleFileChange = React.useCallback(async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    setFile(selectedFile);

    const preview = {
      file_name: selectedFile.name,
      file_mime: selectedFile.type,
      file_size: selectedFile.size,
      title: formData.title || selectedFile.name,
      description: formData.description
    };
    setPreviewData(preview);

    if (onPreview) {
      onPreview(preview);
    }
  }, [formData.title, formData.description, onPreview]);

  const handleVideoIdChange = React.useCallback((videoId) => {
    setFormData(prev => ({ ...prev, youtube_video_id: videoId }));
  }, []);

  const handleSubmit = React.useCallback(async (e) => {
    e.preventDefault();
    setIsUploading(true);

    try {
      let fileUrl = formData.file_url;
      let fileName = null;
      let fileMime = null;
      let fileSize = null;
      
      if (file) {
        const uploadResult = await UploadFile({ file });
        fileUrl = uploadResult.file_url;
        fileName = file.name;
        fileMime = file.type;
        fileSize = file.size;
      }

      const courseData = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        difficulty: formData.difficulty,
        training_type: formData.training_type,
        duration_hours: parseFloat(formData.duration_hours) || 0,
        enrolled_count: 0,
        completion_rate: 0,
        published: true
      };

      if (fileUrl) {
        courseData.file_url = fileUrl;
        courseData.file_name = fileName;
        courseData.file_mime = fileMime;
        courseData.file_size = fileSize;
      }

      if (formData.youtube_video_id) {
        courseData.youtube_url = formData.youtube_url;
        courseData.youtube_video_id = formData.youtube_video_id;
      }

      await onSuccess(courseData);

      setFormData({
        title: "",
        description: "",
        category: "Technical",
        difficulty: "Beginner",
        duration_hours: "",
        file_url: "",
        youtube_url: "",
        youtube_video_id: "",
        training_type: "webDevelopment",
      });
      setFile(null);
      setPreviewData(null);
    } catch (error) {
      console.error("Error uploading course:", error);
    }

    setIsUploading(false);
  }, [formData, file, onSuccess]);

  return (
    <Card className="overflow-visible border-border/60 bg-surface shadow-e1">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-xl font-semibold text-primary">
          <Upload className="h-5 w-5" />
          {t("content.addCourse")}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">{t("courseForm.titleLabel")}</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder={t("common.placeholders.courseTitleExample")}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">{t("courseForm.descriptionLabel")}</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder={t("common.placeholders.courseDescription")}
              required
              className="min-h-[6rem]"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="category">{t("courseForm.categoryLabel")}</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger id="category">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent position="popper" sideOffset={6}>
                  <SelectItem value="Technical">{t("courseForm.categories.technical")}</SelectItem>
                  <SelectItem value="Leadership">{t("courseForm.categories.leadership")}</SelectItem>
                  <SelectItem value="Communication">{t("courseForm.categories.communication")}</SelectItem>
                  <SelectItem value="Design">{t("courseForm.categories.design")}</SelectItem>
                  <SelectItem value="Business">{t("courseForm.categories.business")}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="difficulty">{t("courseForm.difficultyLabel")}</Label>
              <Select
                value={formData.difficulty}
                onValueChange={(value) => setFormData({ ...formData, difficulty: value })}
              >
                <SelectTrigger id="difficulty">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent position="popper" sideOffset={6}>
                  <SelectItem value="Beginner">{t("courseForm.difficulties.beginner")}</SelectItem>
                  <SelectItem value="Intermediate">{t("courseForm.difficulties.intermediate")}</SelectItem>
                  <SelectItem value="Advanced">{t("courseForm.difficulties.advanced")}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="training-type">{t("courseForm.trainingTypeLabel")}</Label>
              <Select
                value={formData.training_type}
                onValueChange={(value) => setFormData({ ...formData, training_type: value })}
              >
                <SelectTrigger id="training-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent position="popper" sideOffset={6}>
                  {trainingOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration">{t("courseForm.durationLabel")}</Label>
              <Input
                id="duration"
                type="number"
                step="0.5"
                min = "0"
                max = "24"
                value={formData.duration_hours}
                onChange={(e) => setFormData({ ...formData, duration_hours: e.target.value })}
                placeholder="5.5"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="youtube" className="flex items-center gap-2">
              <Youtube className="h-4 w-4 text-error" />
              <span>{t("courseForm.youtubeLabel")}</span>
            </Label>
            <Input
              id="youtube"
              value={formData.youtube_url}
              onChange={(e) => setFormData({ ...formData, youtube_url: e.target.value })}
              placeholder={t("common.placeholders.youtubeUrl")}
            />
            <YouTubePreview
              url={formData.youtube_url}
              onVideoIdChange={handleVideoIdChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="file">{t("courseForm.materialsLabel")}</Label>
            <div className="rounded-2xl border-2 border-dashed border-border/60 bg-surface2/70 p-4">
              <label className="flex h-28 w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-transparent bg-transparent text-center transition-colors hover:border-brand/60">
                <Upload className="h-8 w-8 text-brand" />
                <span className="text-sm text-muted">
                  {file ? file.name : t("common.placeholders.uploadPrompt")}
                </span>
                {file && (
                  <span className="text-xs text-muted">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </span>
                )}
                <input
                  id="file"
                  type="file"
                  onChange={handleFileChange}
                  className="hidden"
                  accept="video/*,application/pdf,image/*,.docx,.pptx,.xlsx"
                />
              </label>
            </div>
          </div>

          {previewData && (
            <Button
              type="button"
              variant="outline"
              onClick={() => onPreview && onPreview(previewData)}
              className="w-full border-brand/30 hover:bg-brand/10 text-brand"
            >
              <Eye className="w-4 h-4 mr-2" />
              {t("courseForm.previewButton")}
            </Button>
          )}

          <Button
            type="submit"
            disabled={isUploading}
            className="w-full bg-brand hover:bg-brand/90 text-white"
          >
            {isUploading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {t("common.actions.uploading")}
              </>
            ) : (
              t("content.addCourse")
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
