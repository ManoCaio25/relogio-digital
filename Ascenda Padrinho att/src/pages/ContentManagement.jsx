// ContentManagement.jsx

import React, { useState, useEffect, useCallback, useMemo } from "react"; // hooks do React
import { Link } from "react-router-dom";
import { motion } from "framer-motion"; // animações
import { Sparkles, Search, Filter, XCircle, Bot } from "lucide-react"; // ícones

// Entidades e componentes internos
import { Course } from "@/entities/Course";
import CourseUploadForm from "../components/content/CourseUploadForm";
import CourseCard from "../components/content/CourseCard";
import CourseEditModal from "../components/content/CourseEditModal";
import PreviewDrawer from "../components/media/PreviewDrawer";
import AssignCourseModal from "../components/courses/AssignCourseModal";

// i18n e utils
import { useTranslation } from "../i18n";
import { useTrainingTypeOptions } from "@/utils/labels";
import { PAGE_URLS } from "@/utils";

// UI (shadcn)
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// ------------------------------------------------------------------------------------
// (Opcional) Cartão estatístico reutilizável — deixei aqui porque é simples/útil
function StatCard({ label, value, hint }) {
  // Cartão visual de estatística (usa estilos consistentes)
  return (
    <div className="rounded-2xl border border-border/50 bg-surface2/80 p-4">
      <p className="text-xs uppercase tracking-wide text-muted">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-primary">{value}</p>
      <p className="text-xs text-muted">{hint}</p>
    </div>
  );
}
// ------------------------------------------------------------------------------------

export default function ContentManagement() {
  const { t } = useTranslation(); // hook de tradução

  // Estado base
  const [courses, setCourses] = useState([]); // lista de cursos
  const [searchTerm, setSearchTerm] = useState(""); // texto de busca
  const [trainingFilter, setTrainingFilter] = useState("all"); // filtro por tipo de treinamento

  // Estados de edição
  const [editingCourse, setEditingCourse] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Estados de preview
  const [previewCourse, setPreviewCourse] = useState(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // Estados de atribuição
  const [assigningCourse, setAssigningCourse] = useState(null);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);

  // Opções de treinamento (traduzidas)
  const trainingOptions = useTrainingTypeOptions(t);

  // Carrega cursos (ordenados por data)
  const loadCourses = useCallback(async () => {
    const data = await Course.list("-created_date");
    setCourses(data);
  }, []);

  // Carrega ao montar
  useEffect(() => {
    loadCourses();
  }, [loadCourses]);

  // Criação de curso (refresh após criar)
  const handleCourseCreate = useCallback(
    async (courseData) => {
      await Course.create(courseData);
      loadCourses();
    },
    [loadCourses],
  );

  // Editar: abre modal
  const handleEdit = useCallback((course) => {
    setEditingCourse(course);
    setIsEditModalOpen(true);
  }, []);

  // Salvar edição (refresh após salvar)
  const handleSaveEdit = useCallback(
    async (updatedData) => {
      if (!editingCourse) return;
      await Course.update(editingCourse.id, updatedData);
      setIsEditModalOpen(false);
      setEditingCourse(null);
      loadCourses();
    },
    [editingCourse, loadCourses],
  );

  // Preview de um curso já existente
  const handlePreview = useCallback((course) => {
    setPreviewCourse(course);
    setIsPreviewOpen(true);
  }, []);

  // Preview a partir do formulário (antes de criar)
  const handleFormPreview = useCallback((previewData) => {
    setPreviewCourse(previewData);
    setIsPreviewOpen(true);
  }, []);

  // Atribuir curso (abre modal)
  const handleAssign = useCallback((course) => {
    setAssigningCourse(course);
    setIsAssignModalOpen(true);
  }, []);

  // Sucesso na atribuição (refresh)
  const handleAssignSuccess = useCallback(() => {
    loadCourses();
  }, [loadCourses]);

  const handleDeleteCourse = useCallback(
    async (course) => {
      if (!course) return;

      const confirmed = window.confirm(
        t(
          "content.delete.confirm",
          "Are you sure you want to delete the course \"{{title}}\"?",
          { title: course.title },
        ),
      );

      if (!confirmed) return;

      await Course.remove(course.id);
      loadCourses();
    },
    [loadCourses, t],
  );

  // Filtro + busca (memoizado)
  const filteredCourses = useMemo(() => {
    const normalizedTerm = searchTerm.trim().toLowerCase();

    return courses.filter((course) => {
      const matchesTraining =
        trainingFilter === "all" || course.training_type === trainingFilter;

      const matchesSearch =
        normalizedTerm.length === 0 ||
        [course.title, course.description]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(normalizedTerm));

      return matchesTraining && matchesSearch;
    });
  }, [courses, searchTerm, trainingFilter]);

  // Estatísticas (memoizadas)
  const courseStats = useMemo(() => {
    if (courses.length === 0) {
      return { totalHours: 0, averageCompletion: 0, activeLearners: 0 };
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
        ? completionValues.reduce((acc, v) => acc + v, 0) / completionValues.length
        : 0;

    const activeLearners = courses.reduce(
      (acc, course) => acc + (Number(course.enrolled_count) || 0),
      0,
    );

    return { totalHours, averageCompletion, activeLearners };
  }, [courses]);

  const activeTrainingOption = trainingOptions.find(
    (option) => option.value === trainingFilter,
  );

  const hasActiveFilters = trainingFilter !== "all" || searchTerm.trim().length > 0;

  // ------------------------------------------------------------------------------------
  // RENDER
  // ------------------------------------------------------------------------------------
  return (
    <div className="min-h-screen bg-surface/30 px-6 py-8 md:px-10">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
        {/* Cabeçalho animado */}
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

        {/* Grid principal: coluna esquerda (upload + dicas) / coluna direita (biblioteca) */}
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Coluna esquerda */}
          <div className="lg:col-span-1 space-y-6">
            {/* Formulário de upload/criação de curso */}
            <CourseUploadForm onSuccess={handleCourseCreate} onPreview={handleFormPreview} />

            {/* Card de dicas + estatísticas rápidas */}
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
                    {t("content.tips.title", "Share engaging learning journeys")}
                  </h3>
                  <p className="mt-2 text-sm text-muted">
                    {t(
                      "content.filteredCount",
                      "{{count}} course{{suffix}} match this filter",
                      {
                        count: filteredCourses.length,
                        suffix: filteredCourses.length === 1 ? "" : "s",
                      },
                    )}
                  </p>
                </div>
              </div>

              {/* Trinca de estatísticas compactas */}
              <div className="mt-4 grid w-full gap-4 sm:grid-cols-3 lg:w-auto">
                <StatCard
                  label={t("content.stats.totalHoursLabel", "Catalog hours")}
                  value={new Intl.NumberFormat().format(Math.round(courseStats.totalHours))}
                  hint={t("content.stats.totalHoursHint", "Hours of learning available")}
                />
                <StatCard
                  label={t("content.stats.averageCompletionLabel", "Avg. completion")}
                  value={`${courseStats.averageCompletion.toFixed(0)}%`}
                  hint={t("content.stats.averageCompletionHint", "Across published courses")}
                />
                <StatCard
                  label={t("content.stats.activeLearnersLabel", "Active learners")}
                  value={t("content.stats.activeLearnersValue", "{{count}}", {
                    count: new Intl.NumberFormat().format(courseStats.activeLearners),
                  })}
                  hint={t("content.stats.activeLearnersHint", "Currently enrolled")}
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="rounded-3xl border border-violet-400/40 bg-gradient-to-br from-violet-600/40 via-fuchsia-500/40 to-pink-500/40 p-6 shadow-e1 backdrop-blur-sm"
            >
              <div className="flex items-start gap-3 text-white">
                <div className="rounded-xl bg-white/10 p-2">
                  <Bot className="h-5 w-5" aria-hidden="true" />
                </div>
                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70">
                    {t("courseForm.ascendaIA.subtitle", "Quiz Generator")}
                  </p>
                  <h3 className="text-lg font-semibold">
                    {t("courseForm.ascendaIA.title", "AscendaIA quiz generator")}
                  </h3>
                  <p className="text-sm text-white/80">
                    {t(
                      "courseForm.ascendaIA.description",
                      "Generate quizzes with AscendaIA on the dedicated page.",
                    )}
                  </p>
                  <Button
                    asChild
                    size="sm"
                    variant="outline"
                    className="mt-2 h-9 rounded-xl border-white/40 bg-white/15 text-xs font-semibold text-white hover:bg-white/20"
                  >
                    <Link to={PAGE_URLS.AscendaIA} className="inline-flex items-center gap-2">
                      {t("courseForm.ascendaIA.action", "Open AscendaIA")}
                    </Link>
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Coluna direita: biblioteca, filtros e lista */}
          <div className="lg:col-span-2 space-y-8">
            {/* Seção “Course Library” */}
            <motion.section
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="rounded-3xl border border-border/60 bg-surface/80 p-6 shadow-e1 backdrop-blur-sm"
            >
              <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
                    <Filter className="h-4 w-4" />
                    {t("content.libraryTitle", "Course Library")}
                  </div>
                  <h2 className="text-2xl font-bold text-primary">
                    {t("content.librarySubtitle", "Curate and publish impactful learning")}
                  </h2>
                  <p className="text-sm text-muted">
                    {t(
                      "content.courseCount",
                      "{{count}} course{{suffix}} ready for your team",
                      {
                        count: courses.length,
                        suffix: courses.length === 1 ? "" : "s",
                      },
                    )}
                  </p>
                </div>

                {/* Estatísticas (largas) — mesmas infos, outra apresentação */}
                <div className="grid gap-4 sm:grid-cols-2 xl:min-w-[24rem] xl:grid-cols-3">
                  <StatCard
                    label={t("content.stats.totalHoursLabel", "Catalog hours")}
                    value={new Intl.NumberFormat().format(Math.round(courseStats.totalHours))}
                    hint={t("content.stats.totalHoursHint", "Hours of learning available")}
                  />
                  <StatCard
                    label={t("content.stats.averageCompletionLabel", "Avg. completion")}
                    value={`${courseStats.averageCompletion.toFixed(0)}%`}
                    hint={t("content.stats.averageCompletionHint", "Across published courses")}
                  />
                  <StatCard
                    label={t("content.stats.activeLearnersLabel", "Active learners")}
                    value={t("content.stats.activeLearnersValue", "{{count}}", {
                      count: new Intl.NumberFormat().format(courseStats.activeLearners),
                    })}
                    hint={t("content.stats.activeLearnersHint", "Currently enrolled")}
                  />
                </div>
              </div>
            </motion.section>

            {/* Seção de filtros + resultados */}
            <motion.section
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="rounded-3xl border border-border/60 bg-surface/80 p-6 shadow-e1 backdrop-blur-sm"
            >
              <div className="flex flex-col gap-6">
                {/* Busca + limpar filtros */}
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

                {/* Chips de tipo de treinamento + contadores */}
                <div className="space-y-3">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-muted">
                      {t("content.filters.trainingType", "Training type")}
                    </p>
                    <div
                      className="mt-2 flex flex-wrap gap-2 rounded-2xl border border-border/60 bg-surface2/60 p-2"
                      role="group"
                      aria-label={t("content.filters.trainingType", "Training type")}
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
                                ? "border-brand bg-brand text-white shadow-e2"
                                : "border-transparent bg-transparent text-secondary hover:border-brand/40 hover:bg-brand/5 hover:text-primary"
                            }`}
                            aria-pressed={isActive}
                          >
                            {option.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Contadores/estado dos filtros */}
                  <div className="flex flex-wrap items-center gap-3 text-xs text-muted">
                    <Badge className="rounded-full border border-brand/30 bg-brand/10 text-brand">
                      {t("content.courseCount", "{{count}} course{{suffix}}", {
                        count: courses.length,
                        suffix: courses.length === 1 ? "" : "s",
                      })}
                    </Badge>
                    <span>
                      {t(
                        "content.resultsCount",
                        "Showing {{count}} course{{suffix}}",
                        {
                          count: filteredCourses.length,
                          suffix: filteredCourses.length === 1 ? "" : "s",
                        },
                      )}
                    </span>

                    {trainingFilter !== "all" && activeTrainingOption && (
                      <span className="inline-flex items-center gap-1 rounded-full border border-border/60 bg-surface2 px-3 py-1 text-xs text-secondary">
                        {t("content.filters.activeLabel", "Filtered by")}{" "}
                        {activeTrainingOption.label}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </motion.section>

            {/* Lista de cursos */}
            <div className="grid gap-6">
              {filteredCourses.map((course, index) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  index={index}
                  onEdit={handleEdit}
                  onPreview={handlePreview}
                  onAssign={handleAssign}
                  onDelete={handleDeleteCourse}
                />
              ))}
            </div>

            {/* Vazio */}
            {filteredCourses.length === 0 && (
              <div className="rounded-3xl border border-dashed border-border/60 bg-surface/60 p-12 text-center">
                <p className="text-sm text-muted">
                  {t("content.empty", "No courses yet. Create your first one!")}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modais / Drawers (fora do grid, mas dentro da página) */}
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

/*

1) Tags JSX balanceadas:
   - Havia um erro “Expected corresponding JSX closing tag for <motion.div>” porque um bloco abriu com <motion.div>
     e fechava com </motion.section> em outra parte; além de <div>/<section> sem par.
   - Agora cada <motion.div> fecha com </motion.div> e cada <motion.section> fecha com </motion.section>.

2) Função “LibrarySummary” no meio do JSX:
   - O arquivo trazia uma função declarada entre tags JSX, o que quebra o parse.
   - Removi esse bloco “invadido” e mantive duas <motion.section> claras: (a) título/estatísticas da biblioteca; (b) filtros.

3) Parênteses/Chaves de i18n:
   - Alguns `t("key", "fallback", { ... })` estavam sem parêntese/chaves de fechamento.
   - Corrigi todos, inclusive o trecho do “resultsCount”.

4) Estrutura de layout:
   - Reorganizei o grid em duas colunas: esquerda (Upload + Dicas/Stats) e direita (Library + Filtros + Lista).
   - Coloquei os modais/drawer fora do grid principal, no final do componente, evitando conflitos.

5) Pequenos ajustes de estado:
   - Ao salvar edição, fecho o modal e limpo `editingCourse` antes do `loadCourses()` para evitar estados “pendurados”.

Dica: quando aparecer esse erro de “Expected corresponding JSX closing tag…”, procure:
   - A tag citada no erro e verifique se o fechamento bate exatamente (inclusive o mesmo tipo: motion.div vs motion.section).
   - Conte as aberturas/fechamentos de <div>/<section> ao redor do trecho indicado pela linha no stack trace.
   - Desconfie de funções/consts que tenham “caído” dentro do JSX durante um merge ou copy/paste.

Qualquer coisa me chama que a gente lapida mais 💪✨
*/
