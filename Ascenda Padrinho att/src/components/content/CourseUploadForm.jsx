import React, { useCallback, useState } from "react";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UploadFile } from "@/integrations/Core";
import { Upload, Loader2, Youtube, Eye } from "lucide-react";
import YouTubePreview from "./YouTubePreview";

const createInitialState = () => ({
  title: "",
  description: "",
  category: "Technical",
  difficulty: "Beginner",
  duration_hours: "",
  file_url: "",
  youtube_url: "",
  youtube_video_id: "",
});

export default function CourseUploadForm({
  onSuccess,
  onPreview,
  layout = "card",
  submitLabel = "Add Course",
}) {
  const [formData, setFormData] = useState(() => createInitialState());
  const [isUploading, setIsUploading] = useState(false);
  const [file, setFile] = useState(null);
  const [previewData, setPreviewData] = useState(null);

  const handleFileChange = useCallback(
    async (event) => {
      const selectedFile = event.target.files?.[0];
      if (!selectedFile) return;

      setFile(selectedFile);

      const preview = {
        file_name: selectedFile.name,
        file_mime: selectedFile.type,
        file_size: selectedFile.size,
        title: formData.title || selectedFile.name,
        description: formData.description,
      };
      setPreviewData(preview);

      onPreview?.(preview);
    },
    [formData.description, formData.title, onPreview],
  );

  const handleVideoIdChange = useCallback((videoId) => {
    setFormData((prev) => ({ ...prev, youtube_video_id: videoId }));
  }, []);

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();
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
          duration_hours: Math.max(0, parseFloat(formData.duration_hours) || 0),
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

        if (formData.youtube_video_id) {
          courseData.youtube_url = formData.youtube_url;
          courseData.youtube_video_id = formData.youtube_video_id;
        }

        await onSuccess(courseData);

        setFormData(createInitialState());
        setFile(null);
        setPreviewData(null);
      } catch (error) {
        console.error("Error uploading course:", error);
      }

      setIsUploading(false);
    },
    [file, formData, onSuccess],
  );

  const formContent = (
    <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="title" className="text-secondary">
            Course Title *
          </Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(event) =>
              setFormData({ ...formData, title: event.target.value })
            }
            placeholder="e.g., Advanced React Patterns"
            required
            className="bg-surface2 border-border text-primary placeholder:text-muted"
          />
        </div>

        <div>
          <Label htmlFor="description" className="text-secondary">
            Description *
          </Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(event) =>
              setFormData({ ...formData, description: event.target.value })
            }
            placeholder="What will interns learn?"
            required
            className="bg-surface2 border-border text-primary placeholder:text-muted h-24"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div>
            <Label htmlFor="category" className="text-secondary">
              Category
            </Label>
            <Select
              value={formData.category}
              onValueChange={(value) =>
                setFormData({ ...formData, category: value })
              }
            >
              <SelectTrigger className="bg-surface2 border-border text-primary">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-surface border-border">
                <SelectItem value="Technical">Technical</SelectItem>
                <SelectItem value="Leadership">Leadership</SelectItem>
                <SelectItem value="Communication">Communication</SelectItem>
                <SelectItem value="Design">Design</SelectItem>
                <SelectItem value="Business">Business</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="difficulty" className="text-secondary">
              Difficulty
            </Label>
            <Select
              value={formData.difficulty}
              onValueChange={(value) =>
                setFormData({ ...formData, difficulty: value })
              }
            >
              <SelectTrigger className="bg-surface2 border-border text-primary">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-surface border-border">
                <SelectItem value="Beginner">Beginner</SelectItem>
                <SelectItem value="Intermediate">Intermediate</SelectItem>
                <SelectItem value="Advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="duration" className="text-secondary">
              Duration (hours)
            </Label>
          <Input
            id="duration"
            type="number"
            step="0.5"
            min="0"
            inputMode="decimal"
            value={formData.duration_hours}
            onChange={(event) => {
              const { value } = event.target;

              if (value === "") {
                setFormData({ ...formData, duration_hours: "" });
                return;
              }

              if (/^\d*\.?\d*$/.test(value)) {
                setFormData({ ...formData, duration_hours: value });
              }
            }}
            onKeyDown={(event) => {
              if (["-", "+", "e", "E"].includes(event.key)) {
                event.preventDefault();
              }
            }}
            placeholder="5.5"
            className="bg-surface2 border-border text-primary placeholder:text-muted"
          />
          </div>
        </div>

        <div>
          <Label
            htmlFor="youtube"
            className="flex items-center gap-2 text-secondary"
          >
            <Youtube className="w-4 h-4 text-error" />
            YouTube Link (Optional)
          </Label>
          <Input
            id="youtube"
            value={formData.youtube_url}
            onChange={(event) =>
              setFormData({ ...formData, youtube_url: event.target.value })
            }
            placeholder="https://www.youtube.com/watch?v=..."
            className="bg-surface2 border-border text-primary placeholder:text-muted"
          />
          <YouTubePreview url={formData.youtube_url} onVideoIdChange={handleVideoIdChange} />
        </div>

        <div>
          <Label htmlFor="file" className="text-secondary">
            Course Materials (Optional)
          </Label>
          <div className="mt-2">
            <label className="flex h-32 w-full cursor-pointer items-center justify-center rounded-xl border-2 border-dashed border-border bg-surface2 transition-colors hover:border-brand">
              <div className="text-center">
                <Upload className="mx-auto mb-2 h-8 w-8 text-brand" />
                <span className="text-sm text-muted">
                  {file
                    ? file.name
                    : "Click to upload PDF, video, image, or Office file"}
                </span>
                {file && (
                  <span className="mt-1 block text-xs text-muted">
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
            onClick={() => onPreview?.(previewData)}
            className="w-full border-brand/30 text-brand hover:bg-brand/10"
          >
            <Eye className="mr-2 h-4 w-4" />
            Preview Document
          </Button>
        )}

        <Button
          type="submit"
          disabled={isUploading}
          className="w-full bg-brand text-white hover:bg-brand/90"
        >
          {isUploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Uploading...
            </>
          ) : (
            submitLabel
          )}
        </Button>
    </form>
  );

  if (layout === "plain") {
    return formContent;
  }

  return (
    <Card className="bg-surface shadow-e1 border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-primary">
          <Upload className="h-5 w-5" />
          New Course
        </CardTitle>
      </CardHeader>
      <CardContent>{formContent}</CardContent>
    </Card>
  );
}
