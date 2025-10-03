import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  Clock,
  Users,
  TrendingUp,
  Pencil,
  Eye,
  Youtube,
  FileText,
  UserPlus,
  Layers,
} from "lucide-react";
import { motion } from "framer-motion";
import { CourseAssignment } from "@/entities/CourseAssignment";
import { useTranslation } from "@/i18n";
import { getTrainingTypeLabel } from "@/utils/labels";

export default function CourseCard({ course, index, onEdit, onPreview, onAssign }) {
  const [assignmentCount, setAssignmentCount] = useState(0);
  const { t } = useTranslation();
  const categoryLabels = React.useMemo(() => ({
    "Technical": t("courseForm.categories.technical"),
    "Leadership": t("courseForm.categories.leadership"),
    "Communication": t("courseForm.categories.communication"),
    "Design": t("courseForm.categories.design"),
    "Business": t("courseForm.categories.business"),
  }), [t]);
  const difficultyLabels = React.useMemo(() => ({
    "Beginner": t("courseForm.difficulties.beginner"),
    "Intermediate": t("courseForm.difficulties.intermediate"),
    "Advanced": t("courseForm.difficulties.advanced"),
  }), [t]);

  useEffect(() => {
    const loadAssignments = async () => {
      const assignments = await CourseAssignment.filter({ 
        course_id: course.id,
        status: ['assigned', 'in_progress']
      });
      setAssignmentCount(assignments.length);
    };
    loadAssignments();
  }, [course.id]);

  const difficultyColors = {
    "Beginner": "bg-green-500/20 text-success border-green-500/30",
    "Intermediate": "bg-yellow-500/20 text-warning border-yellow-500/30",
    "Advanced": "bg-red-500/20 text-error border-red-500/30"
  };

  const categoryColors = {
    "Technical": "bg-blue-500/20 text-blue-600 dark:text-blue-400 border-blue-500/30",
    "Leadership": "bg-purple-500/20 text-brand border-border",
    "Communication": "bg-pink-500/20 text-pink-600 dark:text-pink-400 border-pink-500/30",
    "Design": "bg-orange-500/20 text-brand2 border-orange-500/30",
    "Business": "bg-green-500/20 text-success border-green-500/30"
  };

  const trainingTypeColors = {
    sap: "bg-emerald-500/20 text-success border-emerald-500/30",
    sapHr: "bg-teal-500/20 text-teal-500 border-teal-500/30",
    sapHrPmo: "bg-cyan-500/20 text-cyan-500 border-cyan-500/30",
    webDevelopment: "bg-indigo-500/20 text-indigo-500 border-indigo-500/30",
    google: "bg-red-500/20 text-error border-red-500/30",
  };

  const hasMedia = course.youtube_video_id || course.file_url;
  const trainingTypeLabel = React.useMemo(
    () => getTrainingTypeLabel(course.training_type, t),
    [course.training_type, t]
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="group"
    >
      <Card className="relative overflow-hidden border border-border/60 bg-surface/80 shadow-e1 transition-all duration-300 hover:-translate-y-1 hover:shadow-e3">
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-brand via-brand2/70 to-brand" />
        <CardContent className="relative p-6">
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0 flex-1 space-y-2">
                <div className="flex flex-wrap items-center gap-2 text-xs text-muted">
                  <span className="inline-flex items-center gap-1 rounded-full bg-surface2/70 px-2 py-1 text-[11px] font-medium uppercase tracking-wide text-secondary">
                    <Layers className="h-3 w-3" />
                    {t('courseCard.label', 'Featured course')}
                  </span>
                  {course.training_type && trainingTypeLabel && (
                    <span className="inline-flex items-center gap-1 text-[11px] text-muted">
                      <BookOpen className="h-3 w-3" />
                      {trainingTypeLabel}
                    </span>
                  )}
                </div>
                <h3 className="text-xl font-semibold text-primary transition-colors group-hover:text-brand">
                  {course.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted line-clamp-2">
                  {course.description}
                </p>
              </div>
              <div className="shrink-0 rounded-2xl border border-border/60 bg-surface2 p-3 text-brand">
                <BookOpen className="h-5 w-5" />
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {trainingTypeLabel && (
                <Badge
                  className={`${trainingTypeColors[course.training_type] || 'bg-brand/10 text-brand border-brand/20'} border`}
                >
                  {trainingTypeLabel}
                </Badge>
              )}
              <Badge className={categoryColors[course.category] + " border"}>
                {categoryLabels[course.category] || course.category}
              </Badge>
              <Badge className={difficultyColors[course.difficulty] + " border"}>
                {difficultyLabels[course.difficulty] || course.difficulty}
              </Badge>
              {course.youtube_video_id && (
                <Badge variant="outline" className="border-error/30 bg-error/10 text-error">
                  <Youtube className="mr-1 h-3 w-3" />
                  {t("courseCard.youtube")}
                </Badge>
              )}
              {course.file_url && (
                <Badge variant="outline" className="border-brand/30 bg-brand/10 text-brand">
                  <FileText className="mr-1 h-3 w-3" />
                  {course.file_name || t("common.misc.file")}
                </Badge>
              )}
              {assignmentCount > 0 && (
                <Badge variant="outline" className="border-brand2/30 bg-brand2/10 text-brand2">
                  <Users className="mr-1 h-3 w-3" />
                  {t(
                    "courseCard.active",
                    '{{count}} active learner{{suffix}}',
                    {
                      count: assignmentCount,
                      suffix: assignmentCount === 1 ? '' : 's',
                    },
                  )}
                </Badge>
              )}
            </div>

            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted">
                {course.duration_hours && (
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{course.duration_hours}h</span>
                  </div>
                )}
                {course.enrolled_count > 0 && (
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>{course.enrolled_count}</span>
                  </div>
                )}
                {hasMedia && (
                  <div className="flex items-center gap-1">
                    <Eye className="h-4 w-4 text-brand" />
                    <span className="text-xs uppercase tracking-wide text-brand">
                      {t("courseCard.preview")}
                    </span>
                  </div>
                )}
              </div>
              {course.completion_rate > 0 && (
                <div className="inline-flex items-center gap-2 rounded-full bg-success/10 px-3 py-1 text-sm font-medium text-success">
                  <TrendingUp className="h-4 w-4" />
                  {course.completion_rate}%
                </div>
              )}
            </div>

            <div className="grid gap-2 pt-1 sm:grid-cols-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit(course)}
                className="h-11 justify-center rounded-xl border-border/70 bg-surface2/80 text-primary transition-colors hover:border-brand/40 hover:bg-surface"
              >
                <Pencil className="mr-2 h-4 w-4" />
                {t("courseCard.edit")}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onAssign(course)}
                className="h-11 justify-center rounded-xl border-brand2/40 bg-brand2/10 text-brand2 transition-colors hover:border-brand2/60 hover:bg-brand2/15"
              >
                <UserPlus className="mr-2 h-4 w-4" />
                {t("courseCard.assign")}
              </Button>
              {hasMedia && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onPreview(course)}
                  className="h-11 justify-center rounded-xl border-brand/40 bg-brand/10 text-brand transition-colors hover:border-brand/60 hover:bg-brand/15"
                >
                  <Eye className="mr-2 h-4 w-4" />
                  {t("courseCard.preview")}
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
