import React, { useState, useEffect, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import { Sparkles, Search, Filter, XCircle } from "lucide-react";

import { Course } from "@/entities/Course";
import CourseUploadForm from "../components/content/CourseUploadForm";
import CourseCard from "../components/content/CourseCard";
import CourseEditModal from "../components/content/CourseEditModal";
import PreviewDrawer from "../components/media/PreviewDrawer";
import AssignCourseModal from "../components/courses/AssignCourseModal";
import { useTranslation } from "../i18n";
import { useTrainingTypeOptions } from "@/utils/labels";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function ContentManagement() {
  const { t } = useTranslation();

  const [courses, setCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [trainingFilter, setTrainingFilter] = useState("all");

  const [editingCourse, setEditingCourse] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [previewCourse, setPreviewCourse] = useState(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const [assigningCourse, setAssigningCourse] = useState(null);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);

  const trainingOptions = useTrainingTypeOptions(t);

  const loadCourses = useCallback(async () => {
    const data = await Course.list("-created_date");
    setCourses(data);
  }, []);

  useEffect(() => {
    loadCourses();
  }, [loadCourses]);

  const handleCourseCreate = useCallback(
    async (courseData) => {
      await Course.create(courseData);
      loadCourses();
    },
    [loadCourses],
  );

  const handleEdit = useCallback((course) => {
    setEditingCourse(course);
    setIsEditModalOpen(true);
  }, []);

  const handleSaveEdit = useCallback(
    async (updatedData) => {
      await Course.update(editingCourse.id, updatedData);
      loadCourses();
    },
    [editingCourse, loadCourses],
  );

  const handlePreview = useCallback((course) => {
    setPreviewCourse(course);
    setIsPreviewOpen(true);
  }, []);

  const handleFormPreview = useCallback((previewData) => {
    setPreviewCourse(previewData);
    setIsPreviewOpen(true);
  }, []);

  const handleAssign = useCallback((course) => {
    setAssigningCourse(course);
    setIsAssignModalOpen(true);
  }, []);

  const handleAssignSuccess = useCallback(() => {
    loadCourses();
  }, [loadCourses]);

  const filteredCourses = useMemo(() => {
    const normalizedTerm = searchTerm.trim().toLowerCase();

    return courses.filter((course) => {
      const matchesTraining =
        trainingFilter === "all" || course.training_type === trainingFilter;
      const matchesSearch =
        normalizedTerm.length === 0 ||
        [course.title, course.description]
          .filter(Boolean)
          .some((value) => value.toLowerCase().includes(normalizedTerm));

      return matchesTraining && matchesSearch;
    });
  }, [courses, searchTerm, trainingFilter]);

  const courseStats = useMemo(() => {
    if (courses.length === 0) {
      return {
        totalHours: 0,
        averageCompletion: 0,
        activeLearners: 0,
      };
    }

    const totalHours = courses.reduce(
      (acc, course) => acc + (Number(course.duration_hours) || 0),
      0,
    );

    const completionValues = courses
      .map((course) => Number(course.completion_rate) || 0)
      .filter((value) => value > 0);

    const averageCompletion =
      completionValues.length > 0
        ? completionValues.reduce((acc, value) => acc + value, 0) /
          completionValues.length
        : 0;

    const activeLearners = courses.reduce(
      (acc, course) => acc + (Number(course.enrolled_count) || 0),
      0,
    );

    return {
      totalHours,
      averageCompletion,
      activeLearners,
    };
  }, [courses]);

  const activeTrainingOption = trainingOptions.find(
    (option) => option.value === trainingFilter,
  );

  const hasActiveFilters =
    trainingFilter !== "all" || searchTerm.trim().length > 0;

  return (
    <div className="min-h-screen bg-surface/30 px-6 py-8 md:px-10">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
        <motion.header
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-2"
        >
          <h1 className="text-3xl font-bold text-primary md:text-4xl">
            {t("content.title", "Content Management")}
          </h1>
          <p className="max-w-2xl text-sm text-muted md:text-base">
            {t(
              "content.subtitle",
              "Create and manage training materials for your team",
            )}
          </p>
        </motion.header>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <CourseUploadForm
              onSuccess={handleCourseCreate}
              onPreview={handleFormPreview}
            />

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="rounded-3xl border border-border/60 bg-surface2/80 p-6 shadow-e1"
            >
              <div className="flex items-start gap-3">
                <Sparkles className="mt-1 h-5 w-5 text-brand" />
                <div>
                  <h3 className="text-lg font-semibold text-primary">
                    {t('content.tips.title', 'Share engaging learning journeys')}
                  </h3>
                  <p className="mt-2 text-sm text-muted">
                    {t(
                      'content.filteredCount',
                      '{{count}} course{{suffix}} match this filter',
                      {
                        count: filteredCourses.length,
                        suffix: filteredCourses.length === 1 ? '' : 's',
                      },
                    )}
                  </p>
                </div>
              </div>
              <div className="grid w-full gap-4 sm:grid-cols-3 lg:w-auto">
                <div className="rounded-2xl border border-border/50 bg-surface/70 p-4">
                  <p className="text-xs uppercase tracking-wide text-muted">
                    {t('content.stats.totalHoursLabel', 'Catalog hours')}
                  </p>
                  <p className="mt-2 text-2xl font-semibold text-primary">
                    {new Intl.NumberFormat().format(
                      Math.round(courseStats.totalHours)
                    )}
                  </p>
                  <p className="text-xs text-muted">
                    {t('content.stats.totalHoursHint', 'Hours of learning available')}
                  </p>
                </div>
                <div className="rounded-2xl border border-border/50 bg-surface/70 p-4">
                  <p className="text-xs uppercase tracking-wide text-muted">
                    {t('content.stats.averageCompletionLabel', 'Avg. completion')}
                  </p>
                  <p className="mt-2 text-2xl font-semibold text-primary">
                    {courseStats.averageCompletion.toFixed(0)}%
                  </p>
                  <p className="text-xs text-muted">
                    {t('content.stats.averageCompletionHint', 'Across published courses')}
                  </p>
                </div>
                <div className="rounded-2xl border border-border/50 bg-surface/70 p-4">
                  <p className="text-xs uppercase tracking-wide text-muted">
                    {t('content.stats.activeLearnersLabel', 'Active learners')}
                  </p>
                  <p className="mt-2 text-2xl font-semibold text-primary">
                    {t('content.stats.activeLearnersValue', '{{count}}', {
                      count: new Intl.NumberFormat().format(
                        courseStats.activeLearners
                      ),
                    })}
                  </p>
                  <p className="text-xs text-muted">
                    {t('content.stats.activeLearnersHint', 'Currently enrolled')}
                  </p>
                </div>
              </div>
            </div>
            </div>
          </div>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.6fr)] xl:gap-10">
          <div className="space-y-6 lg:sticky lg:top-10 lg:h-fit">
            <CourseUploadForm
              onSuccess={handleCourseCreate}
              onPreview={handleFormPreview}
            />

          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="rounded-3xl border border-border/60 bg-surface/80 p-6 shadow-e1 backdrop-blur-sm"
            >
              <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
                    <Filter className="h-4 w-4" />
                    {t('content.libraryTitle', 'Course Library')}
                  </div>
                  <h2 className="text-2xl font-bold text-primary">
                    {t('content.librarySubtitle', 'Curate and publish impactful learning')}
                  </h2>
                  <p className="text-sm text-muted">
                    {t(
                      'content.courseCount',
                      '{{count}} course{{suffix}} ready for your team',
                      {
                        count: courses.length,
                        suffix: courses.length === 1 ? '' : 's',
                      },
                    )}
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 xl:min-w-[24rem] xl:grid-cols-3">
                  <div className="rounded-2xl border border-border/50 bg-surface2/80 p-4">
                    <p className="text-xs uppercase tracking-wide text-muted">
                      {t('content.stats.totalHoursLabel', 'Catalog hours')}
                    </p>
                    <p className="mt-2 text-2xl font-semibold text-primary">
                      {new Intl.NumberFormat().format(
                        Math.round(courseStats.totalHours)
                      )}
                    </p>
                    <p className="text-xs text-muted">
                      {t('content.stats.totalHoursHint', 'Hours of learning available')}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-border/50 bg-surface2/80 p-4">
                    <p className="text-xs uppercase tracking-wide text-muted">
                      {t('content.stats.averageCompletionLabel', 'Avg. completion')}
                    </p>
                    <p className="mt-2 text-2xl font-semibold text-primary">
                      {courseStats.averageCompletion.toFixed(0)}%
                    </p>
                    <p className="text-xs text-muted">
                      {t('content.stats.averageCompletionHint', 'Across published courses')}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-border/50 bg-surface2/80 p-4">
                    <p className="text-xs uppercase tracking-wide text-muted">
                      {t('content.stats.activeLearnersLabel', 'Active learners')}
                    </p>
                    <p className="mt-2 text-2xl font-semibold text-primary">
                      {t('content.stats.activeLearnersValue', '{{count}}', {
                        count: new Intl.NumberFormat().format(
                          courseStats.activeLearners
                        ),
                      })}
                    </p>
                    <p className="text-xs text-muted">
                      {t('content.stats.activeLearnersHint', 'Currently enrolled')}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="rounded-3xl border border-border/60 bg-surface/80 p-6 shadow-e1 backdrop-blur-sm"
            >
              <div className="flex flex-col gap-6">
                <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
                  <div className="space-y-2">
                    <label
                      htmlFor="course-search"
                      className="text-xs font-medium uppercase tracking-wide text-muted"
                    >
                      {t("content.filters.searchLabel", "Search courses")}
                    </label>
                    <div className="relative">
                      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                      <Input
                        id="course-search"
                        value={searchTerm}
                        onChange={(event) => setSearchTerm(event.target.value)}
                        placeholder={t(
                          "content.filters.searchPlaceholder",
                          "Search by title or description",
                        )}
                        className="h-11 rounded-2xl border-border/60 bg-surface2/70 pl-10 text-sm text-primary placeholder:text-muted"
                      />
                    </div>
                  </div>

                  {hasActiveFilters && (
                    <Button
                      type="button"
                      variant="ghost"
                      className="justify-center gap-2 rounded-full border border-transparent bg-surface2/70 px-4 py-2 text-sm text-secondary hover:border-border/60 hover:bg-surface2"
                      onClick={() => {
                        setTrainingFilter("all");
                        setSearchTerm("");
                      }}
                    >
                      <XCircle className="h-4 w-4" />
                      {t("content.filters.clear", "Clear filters")}
                    </Button>
                  )}
                </div>

                <div className="space-y-3">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-muted">
                      {t('content.filters.trainingType', 'Training type')}
                    </p>
                    <div
                      className="mt-2 flex flex-wrap gap-2 rounded-2xl border border-border/60 bg-surface2/60 p-2"
                      role="group"
                      aria-label={t('content.filters.trainingType', 'Training type')}
                    >
                      {trainingOptions.map((option) => {
                        const isActive = trainingFilter === option.value;
                        return (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => setTrainingFilter(option.value)}
                            className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-surface ${
                              isActive
                                ? 'border-brand bg-brand text-white shadow-e2'
                                : 'border-transparent bg-transparent text-secondary hover:border-brand/40 hover:bg-brand/5 hover:text-primary'
                            }`}
                            aria-pressed={isActive}
                          >
                            {option.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-muted">
                    <Badge className="rounded-full border border-brand/30 bg-brand/10 text-brand">
                      {t(
                        'content.courseCount',
                      '{{count}} course{{suffix}}',
                      {
                        count: courses.length,
                        suffix: courses.length === 1 ? "" : "s",
                      })}
                    </Badge>
                    <span>
                      {t("content.resultsCount", "Showing {{count}} course{{suffix}}", {
                        count: filteredCourses.length,
                        suffix: filteredCourses.length === 1 ? '' : 's',
                      }
                    )}
                  </span>
                    {trainingFilter !== "all" && activeTrainingOption && (
                      <span className="inline-flex items-center gap-1 rounded-full border border-border/60 bg-surface2 px-3 py-1 text-xs text-secondary">
                        {t('content.filters.activeLabel', 'Filtered by')} {activeTrainingOption.label}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </motion.section>

            <div className="grid gap-6">
              {filteredCourses.map((course, index) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  index={index}
                  onEdit={handleEdit}
                  onPreview={handlePreview}
                  onAssign={handleAssign}
                />
              ))}
            </div>

            {filteredCourses.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-3xl border border-dashed border-border/60 bg-surface/60 p-12 text-center"
              >
                <p className="text-sm text-muted">
                  {t("content.empty", "No courses yet. Create your first one!")}
                </p>
              </motion.div>
            )}
          </section>
        </div>
      </div>

      <CourseEditModal
        course={editingCourse}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveEdit}
      />

      <PreviewDrawer
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        course={previewCourse}
      />

      <AssignCourseModal
        course={assigningCourse}
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        onSuccess={handleAssignSuccess}
      />
    </div>
  );
}

function StatCard({ label, value, hint }) {
  return (
    <div className="rounded-2xl border border-border/50 bg-surface2/80 p-4">
      <p className="text-xs uppercase tracking-wide text-muted">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-primary">{value}</p>
      <p className="text-xs text-muted">{hint}</p>
    </div>
  );
}
