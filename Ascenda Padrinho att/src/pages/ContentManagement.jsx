import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Course } from "@/entities/Course";
import { motion } from "framer-motion";
import CourseUploadForm from "../components/content/CourseUploadForm";
import CourseCard from "../components/content/CourseCard";
import CourseEditModal from "../components/content/CourseEditModal";
import PreviewDrawer from "../components/media/PreviewDrawer";
import AssignCourseModal from "../components/courses/AssignCourseModal";
import { useTranslation } from "../i18n";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

  const filteredCourses = useMemo(
    () =>
      courses.filter((course) =>
        trainingFilter === "all"
          ? true
          : course.training_type === trainingFilter
      ),
    [courses, trainingFilter]
  );

  return (
    <div className="min-h-screen p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl md:text-4xl font-bold text-primary mb-2">
            {t('content.title', 'Content Management')}
          </h1>
          <p className="text-muted">
            {t('content.subtitle', 'Create and manage training materials for your team')}
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <CourseUploadForm 
              onSuccess={handleCourseCreate}
              onPreview={handleFormPreview}
            />
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <h2 className="text-2xl font-bold text-primary">
                {t('content.libraryTitle', 'Course Library')}
              </h2>
              <div className="flex items-center gap-3">
                <span className="text-sm text-muted">
                  {t('content.courseCount', '{{count}} courses', { count: courses.length })}
                </span>
                <Select value={trainingFilter} onValueChange={setTrainingFilter}>
                  <SelectTrigger className="w-48 bg-surface2 border-border text-primary">
                    <SelectValue placeholder={t('content.filters.trainingType', 'Training type')} />
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
            </div>

            {trainingFilter !== "all" && (
              <p className="text-xs text-muted">
                {t(
                  'content.filteredCount',
                  '{{count}} course(s) match this filter',
                  { count: filteredCourses.length },
                )}
              </p>
            )}

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
              <div className="text-center py-12 bg-surface2 border border-border rounded-xl">
                <p className="text-muted">
                  {t('content.empty', 'No courses yet. Create your first one!')}
                </p>
              </div>
            )}
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
    </div>
  );
}