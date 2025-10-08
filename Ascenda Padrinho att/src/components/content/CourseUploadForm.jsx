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
    <Card className="border-border bg-surface shadow-e1">
      <CardHeader>
        <CardTitle className="text-primary flex items-center gap-2">
          <Upload className="w-5 h-5" />
          {t("content.addCourse")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title" className="text-secondary">{t("courseForm.titleLabel")}</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder={t("common.placeholders.courseTitleExample")}
              required
              className="bg-surface2 border-border text-primary placeholder:text-muted"
            />
          </div>

          <div>
            <Label htmlFor="description" className="text-secondary">{t("courseForm.descriptionLabel")}</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder={t("common.placeholders.courseDescription")}
              required
              className="bg-surface2 border-border text-primary placeholder:text-muted h-24"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="category" className="text-secondary">{t("courseForm.categoryLabel")}</Label>
              <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                <SelectTrigger className="bg-surface2 border-border text-primary">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-surface border-border">
                  <SelectItem value="Technical">{t("courseForm.categories.technical")}</SelectItem>
                  <SelectItem value="Leadership">{t("courseForm.categories.leadership")}</SelectItem>
                  <SelectItem value="Communication">{t("courseForm.categories.communication")}</SelectItem>
                  <SelectItem value="Design">{t("courseForm.categories.design")}</SelectItem>
                  <SelectItem value="Business">{t("courseForm.categories.business")}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="difficulty" className="text-secondary">{t("courseForm.difficultyLabel")}</Label>
              <Select value={formData.difficulty} onValueChange={(value) => setFormData({ ...formData, difficulty: value })}>
                <SelectTrigger className="bg-surface2 border-border text-primary">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-surface border-border">
                  <SelectItem value="Beginner">{t("courseForm.difficulties.beginner")}</SelectItem>
                  <SelectItem value="Intermediate">{t("courseForm.difficulties.intermediate")}</SelectItem>
                  <SelectItem value="Advanced">{t("courseForm.difficulties.advanced")}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="training-type" className="text-secondary">{t("courseForm.trainingTypeLabel")}</Label>
              <Select
                value={formData.training_type}
                onValueChange={(value) => setFormData({ ...formData, training_type: value })}
              >
                <SelectTrigger className="bg-surface2 border-border text-primary">
                  <SelectValue />
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
              <Label htmlFor="duration" className="text-secondary">{t("courseForm.durationLabel")}</Label>
              <Input
                id="duration"
                type="number"
                step="0.5"
                value={formData.duration_hours}
                onChange={(e) => setFormData({ ...formData, duration_hours: e.target.value })}
                placeholder="5.5"
                className="bg-surface2 border-border text-primary placeholder:text-muted"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="youtube" className="text-secondary flex items-center gap-2">
              <Youtube className="w-4 h-4 text-error" />
              {t("courseForm.youtubeLabel")}
            </Label>
            <Input
              id="youtube"
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

          <div>
            <Label htmlFor="file" className="text-secondary">{t("courseForm.materialsLabel")}</Label>
            <div className="mt-2">
              <label className="flex items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-xl cursor-pointer hover:border-brand transition-colors bg-surface2">
                <div className="text-center">
                  <Upload className="w-8 h-8 mx-auto mb-2 text-brand" />
                  <span className="text-sm text-muted">
                    {file ? file.name : t("common.placeholders.uploadPrompt")}
                  </span>
                  {file && (
                    <span className="text-xs text-muted block mt-1">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </span>
                  )}
                </div>
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