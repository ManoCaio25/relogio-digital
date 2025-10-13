import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { RefreshCw } from 'lucide-react';
import { useTranslation } from '@/i18n';
import { PAGE_URLS } from '@/utils';
import { AssigneePicker } from '@/components/assign/AssigneePicker';
import { AssignToolbar } from '@/components/assign/AssignToolbar';
import { QuizPreviewCard } from '@/components/assign/QuizPreviewCard';
import { useUsersStore } from './stores/useUsersStore';
import { useQuizzesStore } from './stores/useQuizzesStore';
import { QuizService } from './services/quiz.service.mock';
import { useToast } from '@/components/feedback/Toaster';
import { Button } from '@/components/ui/button';

export default function AssignQuizzesPanel() {
  const { t } = useTranslation();
  const { users } = useUsersStore();
  const interns = React.useMemo(() => users.filter((user) => user.role === 'intern'), [users]);
  const mentors = React.useMemo(() => users.filter((user) => user.role === 'padrinho'), [users]);
  const {
    generatedQuizzes,
    setGeneratedQuizzes,
    assignQuizzes,
    updateQuizMeta,
  } = useQuizzesStore();
  const { pushToast } = useToast();

  const [loading, setLoading] = React.useState(false);
  const [assigning, setAssigning] = React.useState(false);
  const [selectedAssignees, setSelectedAssignees] = React.useState([]);
  const [selectedGroup, setSelectedGroup] = React.useState('none');
  const [dueDate, setDueDate] = React.useState('');
  const [difficulty, setDifficulty] = React.useState('medium');
  const [visibility, setVisibility] = React.useState('team');
  const [tags, setTags] = React.useState('');
  const [selectedQuizIds, setSelectedQuizIds] = React.useState([]);

  React.useEffect(() => {
    let active = true;
    if (!generatedQuizzes.length) {
      setLoading(true);
      QuizService.listGenerated()
        .then((data) => {
          if (active) {
            setGeneratedQuizzes(data);
          }
        })
        .catch(() => {
          if (active) {
            pushToast({
              variant: 'error',
              title: t('ascendaQuiz.assign.toasts.loadError.title'),
              description: t('ascendaQuiz.assign.toasts.loadError.description'),
            });
          }
        })
        .finally(() => {
          if (active) {
            setLoading(false);
          }
        });
    }
    return () => {
      active = false;
    };
  }, [generatedQuizzes.length, pushToast, setGeneratedQuizzes, t]);

  const toggleQuizSelection = React.useCallback((quizId) => {
    setSelectedQuizIds((prev) =>
      prev.includes(quizId)
        ? prev.filter((id) => id !== quizId)
        : [...prev, quizId],
    );
  }, []);

  const handleUpdateMeta = React.useCallback(
    (quizId, patch) => {
      updateQuizMeta(quizId, patch);
      pushToast({
        variant: 'success',
        title: t('ascendaQuiz.assign.toasts.metaUpdated.title'),
        description: t('ascendaQuiz.assign.toasts.metaUpdated.description'),
      });
    },
    [pushToast, t, updateQuizMeta],
  );

  const handleAssign = React.useCallback(async () => {
    const assigneesSet = new Set(selectedAssignees);
    if (selectedGroup === 'allInterns') {
      interns.forEach((intern) => assigneesSet.add(intern.login));
    }
    if (selectedGroup === 'mentors') {
      mentors.forEach((mentor) => assigneesSet.add(mentor.login));
    }

    if (!assigneesSet.size) {
      pushToast({
        variant: 'error',
        title: t('ascendaQuiz.assign.toasts.noAssignees.title'),
        description: t('ascendaQuiz.assign.toasts.noAssignees.description'),
      });
      return;
    }

    if (!selectedQuizIds.length) {
      pushToast({
        variant: 'error',
        title: t('ascendaQuiz.assign.toasts.noQuizzes.title'),
        description: t('ascendaQuiz.assign.toasts.noQuizzes.description'),
      });
      return;
    }

    setAssigning(true);
    const normalizedTags = tags
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean);

    const assignmentsPayload = {
      assignees: Array.from(assigneesSet),
      dueDate: dueDate || null,
      difficulty,
      visibility,
      tags: normalizedTags,
    };

    const createdAssignments = assignQuizzes(selectedQuizIds, assignmentsPayload);

    try {
      const response = await QuizService.assign(createdAssignments);
      if (!response.success) {
        throw new Error('assignment failed');
      }
      pushToast({
        variant: 'success',
        title: t('ascendaQuiz.assign.toasts.success.title', { count: assigneesSet.size }),
        description: t('ascendaQuiz.assign.toasts.success.description', {
          quizzes: selectedQuizIds.length,
          count: selectedQuizIds.length,
        }),
      });
      setSelectedQuizIds([]);
    } catch (error) {
      pushToast({
        variant: 'error',
        title: t('ascendaQuiz.assign.toasts.assignError.title'),
        description: t('ascendaQuiz.assign.toasts.assignError.description'),
      });
    } finally {
      setAssigning(false);
    }
  }, [
    assignQuizzes,
    difficulty,
    dueDate,
    interns,
    mentors,
    pushToast,
    selectedAssignees,
    selectedGroup,
    selectedQuizIds,
    tags,
    t,
    visibility,
  ]);

  const disableAssignButton = assigning;

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="flex flex-col gap-6"
    >
      <header className="rounded-2xl border border-border/60 bg-surface/80 p-6 shadow-e1 backdrop-blur-sm lg:p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold text-white">
              {t('ascendaQuiz.assign.title')}
            </h2>
            <p className="text-sm text-white/70">
              {t('ascendaQuiz.assign.subtitle')}
            </p>
          </div>
          <Button asChild variant="ghost" size="sm" className="gap-2 text-white/70 hover:text-white">
            <Link to={PAGE_URLS.AscendaIA} aria-label={t('ascendaQuiz.assign.backToGeneratorAria')}>
              <RefreshCw className="h-4 w-4" aria-hidden="true" />
              {t('ascendaQuiz.assign.backToGenerator')}
            </Link>
          </Button>
        </div>
      </header>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <div className="flex flex-col gap-6">
          <AssigneePicker
            interns={interns}
            mentors={mentors}
            selectedAssignees={selectedAssignees}
            selectedGroup={selectedGroup}
            onAssigneesChange={setSelectedAssignees}
            onGroupChange={setSelectedGroup}
          />

          <AssignToolbar
            dueDate={dueDate}
            onDueDateChange={setDueDate}
            difficulty={difficulty}
            onDifficultyChange={setDifficulty}
            visibility={visibility}
            onVisibilityChange={setVisibility}
            tags={tags}
            onTagsChange={setTags}
            selectedCount={selectedQuizIds.length}
            disabled={disableAssignButton}
            onAssign={handleAssign}
          />
        </div>

        <section className="rounded-2xl border border-border/60 bg-surface/80 p-6 shadow-e1 backdrop-blur-sm">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-semibold text-white">
                {t('ascendaQuiz.assign.generatedList.title')}
              </h3>
              <p className="text-xs text-white/60">
                {t('ascendaQuiz.assign.generatedList.subtitle')}
              </p>
            </div>
            <span className="text-xs text-white/50">
              {t('ascendaQuiz.assign.generatedList.count', { count: generatedQuizzes.length })}
            </span>
          </div>

          {loading ? (
            <div className="flex h-48 items-center justify-center text-sm text-white/60">
              {t('ascendaQuiz.assign.generatedList.loading')}
            </div>
          ) : generatedQuizzes.length ? (
            <div className="grid gap-4 lg:grid-cols-2">
              {generatedQuizzes.map((quiz) => (
                <QuizPreviewCard
                  key={quiz.id}
                  quiz={quiz}
                  selected={selectedQuizIds.includes(quiz.id)}
                  onToggle={toggleQuizSelection}
                  onUpdateMeta={handleUpdateMeta}
                />
              ))}
            </div>
          ) : (
            <div className="flex h-48 flex-col items-center justify-center gap-2 text-center text-sm text-white/60">
              <p>{t('ascendaQuiz.assign.generatedList.emptyTitle')}</p>
              <p className="text-xs text-white/40">
                {t('ascendaQuiz.assign.generatedList.emptySubtitle')}
              </p>
            </div>
          )}
        </section>
      </div>
    </motion.section>
  );
}
