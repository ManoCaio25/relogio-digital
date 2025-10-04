import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Course } from "@/entities/Course";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import CourseUploadForm from "../components/content/CourseUploadForm";
import CourseCard from "../components/content/CourseCard";
import CourseEditModal from "../components/content/CourseEditModal";
import PreviewDrawer from "../components/media/PreviewDrawer";
import AssignCourseModal from "../components/courses/AssignCourseModal";
import LibraryFilterCard from "../components/content/LibraryFilterCard";
import { useTranslation } from "../i18n";
import { useTrainingTypeOptions } from "@/utils/labels";

export default function ContentManagement() {
  const [courses, setCourses] = useState([]);
  const [editingCourse, setEditingCourse] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [previewCourse, setPreviewCourse] = useState(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [assigningCourse, setAssigningCourse] = useState(null);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [trainingFilter, setTrainingFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const { t } = useTranslation();
  const trainingOptions = useTrainingTypeOptions(t);

  const loadCourses = useCallback(async () => {
    const data = await Course.list('-created_date');
    setCourses(data);
  }, []);

  useEffect(() => {
    loadCourses();
  }, [loadCourses]);

  const handleCourseCreate = useCallback(async (courseData) => {
    await Course.create(courseData);
    loadCourses();
  }, [loadCourses]);

  const handleEdit = useCallback((course) => {
    setEditingCourse(course);
    setIsEditModalOpen(true);
  }, []);

  const handleSaveEdit = useCallback(async (updatedData) => {
    await Course.update(editingCourse.id, updatedData);
    loadCourses();
  }, [editingCourse, loadCourses]);

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
  }, [courses, trainingFilter, searchTerm]);

  const courseStats = useMemo(() => {
    if (!courses.length) {
      return {
        totalHours: 0,
        averageCompletion: 0,
        activeLearners: 0,
      };
    }

    const totalHours = courses.reduce(
      (acc, course) => acc + (Number(course.duration_hours) || 0),
      0
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
      0
    );

    return {
      totalHours,
      averageCompletion,
      activeLearners,
    };
  }, [courses]);

  const activeTrainingOption = trainingOptions.find(
    (option) => option.value === trainingFilter
  );

  const hasActiveFilters =
    trainingFilter !== "all" || searchTerm.trim().length > 0;

  const handleClearFilters = useCallback(() => {
    setTrainingFilter("all");
    setSearchTerm("");
  }, []);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(55,110,255,0.12),_transparent_55%)] p-6 md:p-10">
      <div className="mx-auto flex max-w-7xl flex-col gap-10">
        <motion.section
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="relative overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-br from-surface/90 via-surface2/90 to-surface/95 p-8 shadow-e3"
        >
          <div className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-brand via-brand2/70 to-brand" />
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-4">
              <span className="inline-flex items-center gap-2 rounded-full bg-brand/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-brand">
                <Sparkles className="h-4 w-4" />
                {t('content.heroBadge', 'Learning hub')}
              </span>
              <div className="space-y-2">
                <h1 className="text-3xl font-bold text-primary md:text-4xl">
                  {t('content.title', 'Content Management')}
                </h1>
                <p className="max-w-2xl text-base text-muted md:text-lg">
                  {t(
                    'content.subtitle',
                    'Create and manage training materials for your team'
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
        </motion.section>

        <div className="grid grid-cols-12 gap-6 xl:gap-10">
          <div className="col-span-12 lg:col-span-8">
            <div className="space-y-6">
              <LibraryFilterCard
                t={t}
                searchTerm={searchTerm}
                onSearchTermChange={setSearchTerm}
                onClearFilters={handleClearFilters}
                hasActiveFilters={hasActiveFilters}
                trainingOptions={trainingOptions}
                trainingFilter={trainingFilter}
                onTrainingFilterChange={setTrainingFilter}
                coursesCount={courses.length}
                filteredCount={filteredCourses.length}
                activeTrainingOption={activeTrainingOption}
              />

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
                    {t('content.empty', 'No courses yet. Create your first one!')}
                  </p>
                </motion.div>
              )}
            </div>
          </div>

          <div className="col-span-12 lg:col-span-4">
            <div className="space-y-6 lg:sticky lg:top-10 lg:h-fit">
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
                <h3 className="text-lg font-semibold text-primary">
                  {t('content.tips.title', 'Share engaging learning journeys')}
                </h3>
                <p className="mt-2 text-sm text-muted">
                  {t(
                    'content.tips.body',
                    'Highlight why the course matters, include helpful materials, and preview before publishing to craft delightful learning experiences.'
                  )}
                </p>
              </motion.div>
            </div>
          </div>
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
