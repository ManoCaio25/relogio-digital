import React, { useMemo, useState } from "react";
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
import AscendaIASection from "../ascenda/AscendaIASection";

export default function CourseUploadForm({ onSuccess, onPreview }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [durationHours, setDurationHours] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [youtubeVideoId, setYoutubeVideoId] = useState("");
  const [category, setCategory] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [trainingType, setTrainingType] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [file, setFile] = useState(null);
  const [previewData, setPreviewData] = useState(null);
  const [quizDraft, setQuizDraft] = useState(null);
  const [isQuizModalOpen, setQuizModalOpen] = useState(false);
  const { t } = useTranslation();
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
  const trainingOptions = useMemo(
    () => [
      { value: "sap", label: t("courseForm.trainingTypes.sap", "SAP") },
      { value: "sapHr", label: t("courseForm.trainingTypes.sapHr", "HR") },
      { value: "sapHrPmo", label: t("courseForm.trainingTypes.sapHrPmo", "PMO") },
      { value: "webDevelopment", label: t("courseForm.trainingTypes.webDevelopment", "Web Development") },
      { value: "google", label: t("courseForm.trainingTypes.google", "Google") },
    ],
    [t],
  );
  const handleFileChange = React.useCallback(async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    setFile(selectedFile);

    const preview = {
      file_name: selectedFile.name,
      file_mime: selectedFile.type,
      file_size: selectedFile.size,
      title: title || selectedFile.name,
      description: description,
    };
    setPreviewData(preview);

    if (onPreview) {
      onPreview(preview);
    }
  }, [description, onPreview, title]);

  const handleVideoIdChange = React.useCallback((videoId) => {
    setYoutubeVideoId(videoId);
  }, []);

  const handleQuizComplete = React.useCallback((quiz) => {
    setQuizDraft(quiz);
  }, []);

  const handleSubmit = React.useCallback(async (e) => {
    e.preventDefault();
    if (!category || !difficulty || !trainingType) {
      console.error("Please select category, difficulty, and training type before submitting the course.");
      return;
    }

    setIsUploading(true);

    try {
      let fileUrl = "";
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
        title,
        description,
        category,
        difficulty,
        training_type: trainingType,
        duration_hours: parseFloat(durationHours) || 0,
        enrolled_count: 0,
        completion_rate: 0,
        published: true,
      };

      if (fileUrl) {
        courseData.file_url = fileUrl;
        courseData.file_name = fileName;
        courseData.file_mime = fileMime;
        courseData.file_size = fileSize;
      }

      if (youtubeVideoId) {
        courseData.youtube_url = youtubeUrl;
        courseData.youtube_video_id = youtubeVideoId;
      }

      await onSuccess(courseData);

      setTitle("");
      setDescription("");
      setDurationHours("");
      setYoutubeUrl("");
      setYoutubeVideoId("");
      setCategory("");
      setDifficulty("");
      setTrainingType("");
      setFile(null);
      setPreviewData(null);
    } catch (error) {
      console.error("Error uploading course:", error);
    }

    setIsUploading(false);
  }, [category, description, difficulty, durationHours, file, onSuccess, title, trainingType, youtubeUrl, youtubeVideoId]);

  return (
    <>
      <Card className="overflow-visible border-border/60 bg-surface shadow-e1">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-xl font-semibold text-primary">
            <Upload className="h-5 w-5" />
            {t("content.addCourse")}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">{t("courseForm.titleLabel")}</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={t("common.placeholders.courseTitleExample")}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">{t("courseForm.descriptionLabel")}</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={t("common.placeholders.courseDescription")}
                required
                className="min-h-[6rem]"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="category">{t("courseForm.categoryLabel")}</Label>
                <Select id="category" value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent position="popper" sideOffset={6}>
                    {categoryOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="difficulty">{t("courseForm.difficultyLabel")}</Label>
                <Select id="difficulty" value={difficulty} onValueChange={setDifficulty}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent position="popper" sideOffset={6}>
                    {difficultyOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="training-type">{t("courseForm.trainingTypeLabel")}</Label>
                <Select id="training-type" value={trainingType} onValueChange={setTrainingType}>
                  <SelectTrigger>
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
                  min="0"
                  max="24"
                  value={durationHours}
                  onChange={(e) => setDurationHours(e.target.value)}
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
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
                placeholder={t("common.placeholders.youtubeUrl")}
              />
              <YouTubePreview url={youtubeUrl} onVideoIdChange={handleVideoIdChange} />
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
                    <span className="text-xs text-muted">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
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

            <div className="space-y-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setQuizModalOpen(true)}
                className="w-full border-brand/30 text-brand hover:bg-brand/10"
              >
                ✨ AscendaIA — Gerar Quizzes
              </Button>

              {quizDraft && (
                <div className="rounded-2xl border border-emerald-400/40 bg-emerald-400/10 p-4 text-sm text-emerald-100">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div className="space-y-1">
                      <p className="text-base font-semibold text-emerald-50">{quizDraft.topic}</p>
                      {quizDraft.source && (
                        <p className="text-xs text-emerald-200/80">Fonte: {quizDraft.source}</p>
                      )}
                      <p className="text-xs text-emerald-200/70">
                        Total de {quizDraft.easy.length + quizDraft.intermediate.length + quizDraft.advanced.length} questões geradas.
                      </p>
                    </div>
                    <div className="flex flex-col gap-1 text-xs text-emerald-100">
                      <span>
                        Básico: <b>{quizDraft.easy.length}</b>
                      </span>
                      <span>
                        Intermediário: <b>{quizDraft.intermediate.length}</b>
                      </span>
                      <span>
                        Avançado: <b>{quizDraft.advanced.length}</b>
                      </span>
                    </div>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2 text-xs text-emerald-50">
                    <button
                      type="button"
                      onClick={() => setQuizDraft(null)}
                      className="rounded-lg border border-emerald-200/40 px-3 py-1 text-emerald-50 transition hover:bg-emerald-200/10"
                    >
                      Descartar rascunho
                    </button>
                    <button
                      type="button"
                      onClick={() => setQuizModalOpen(true)}
                      className="rounded-lg border border-transparent bg-emerald-400/30 px-3 py-1 font-medium text-emerald-950 transition hover:bg-emerald-300/70"
                    >
                      Gerar novamente
                    </button>
                  </div>
                </div>
              )}
            </div>

            <AscendaIASection
              open={isQuizModalOpen}
              onClose={() => setQuizModalOpen(false)}
              onComplete={handleQuizComplete}
            />

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
    </>
  );
}
