import React from 'react';
import { motion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import { useTranslation } from '@/i18n';
import { useAscendaIAQuizGen } from './hooks/useAscendaIAQuizGen';
import { SourceInputPanel } from './components/SourceInputPanel';
import { SummaryPanel } from './components/SummaryPanel';
import { QuizLevelsPanel } from './components/QuizLevelsPanel';
import { PreviewPanel } from './components/PreviewPanel';
import { SaveDraftBar } from './components/SaveDraftBar';
import { Button } from '@/components/ui/button';
import { PAGE_URLS } from '@/utils';
import { LanguageSwitcher } from './components/LanguageSwitcher';
import AssignQuizzesPanel from './AssignQuizzesPanel';
import CourseLibrary from './CourseLibrary.jsx';
import { useQuizzesStore } from './stores/useQuizzesStore';
import { useToast } from '@/components/feedback/Toaster';

import './styles/ascenda-quizz.css';

const QUIZ_LEVELS_KEYS = ['easy', 'intermediate', 'advanced'];

function flattenQuizItems(quiz) {
  if (!quiz) return [];
  return QUIZ_LEVELS_KEYS.flatMap((level) =>
    (quiz?.[level] ?? []).map((item) => ({
      id: item.id,
      question: item.prompt ?? '',
      options: item.options ?? [],
      answer:
        typeof item.correctIndex === 'number'
          ? item.options?.[item.correctIndex] ?? ''
          : item.answer ?? '',
      level,
    })),
  );
}

export default function AscendaIAQuizzesPage() {
  const {
    topic,
    setTopic,
    youtubeUrl,
    setYoutubeUrl,
    textFile,
    setTextFile,
    clearTextFile,
    errors,
    setErrors,
    levels,
    setLevelEnabled,
    setLevelCount,
    totalRequested,
    canGenerate,
    loading,
    generate,
    quiz,
    discard,
    saveDraft,
    feedback,
    setFeedback,
    youtubeValid,
  } = useAscendaIAQuizGen();

  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { pushToast } = useToast();

  const addTemplateFromGenerator = useQuizzesStore((state) => state.addTemplateFromGenerator);
  const updateTemplate = useQuizzesStore((state) => state.updateTemplate);

  const [lastTemplateId, setLastTemplateId] = React.useState(null);

  const activeTab = React.useMemo(() => {
    if (location.pathname.startsWith(PAGE_URLS.AscendaIALibrary)) return 'library';
    if (location.pathname.startsWith(PAGE_URLS.AscendaIAAssign)) return 'assign';
    return 'generator';
  }, [location.pathname]);

  const focusParam = React.useMemo(() => {
    if (!location.search) return null;
    return new URLSearchParams(location.search).get('focus');
  }, [location.search]);

  const tabs = React.useMemo(
    () => [
      { key: 'generator', label: t('ascendaQuiz.tabs.generator'), path: PAGE_URLS.AscendaIA },
      { key: 'assign', label: t('ascendaQuiz.tabs.assign'), path: PAGE_URLS.AscendaIAAssign },
      { key: 'library', label: t('common.course_library'), path: PAGE_URLS.AscendaIALibrary },
    ],
    [t],
  );

  const handleTabChange = React.useCallback(
    (next) => {
      const tab = tabs.find((item) => item.key === next);
      if (!tab) return;
      navigate(tab.path);
    },
    [navigate, tabs],
  );

  const handleGenerate = React.useCallback(async () => {
    const result = await generate();
    if (!result) return;

    const template = addTemplateFromGenerator({ quiz: result });
    setLastTemplateId(template.id);
    pushToast({
      variant: 'success',
      title: t('common.saved_to_library'),
      description: t('ascendaQuiz.generator.autoSavedToLibrary'),
    });
  }, [addTemplateFromGenerator, generate, pushToast, t]);

  const handleSaveDraft = React.useCallback(() => {
    if (!quiz) return;
    const success = saveDraft();
    window.alert(success ? t('ascendaQuiz.actions.saved') : t('ascendaQuiz.actions.saveError'));
  }, [quiz, saveDraft, t]);

  const handleDiscard = React.useCallback(() => {
    discard();
    setFeedback('');
  }, [discard, setFeedback]);

  const handleSaveTemplate = React.useCallback(() => {
    if (!quiz) return;

    const payload = {
      title: quiz.topic,
      description: quiz.source,
      items: flattenQuizItems(quiz),
    };

    const updated = lastTemplateId
      ? updateTemplate(lastTemplateId, payload)
      : addTemplateFromGenerator({ quiz }, payload);

    const templateId = updated?.id ?? lastTemplateId;
    if (updated?.id && updated.id !== lastTemplateId) {
      setLastTemplateId(updated.id);
    }

    pushToast({
      variant: 'success',
      title: t('common.new_version_saved'),
      description: t('common.saved_to_library'),
    });

    return templateId;
  }, [addTemplateFromGenerator, lastTemplateId, pushToast, quiz, t, updateTemplate]);

  const handleOpenLibrary = React.useCallback(() => {
    if (!lastTemplateId) {
      navigate(PAGE_URLS.AscendaIALibrary);
      return;
    }
    navigate(`${PAGE_URLS.AscendaIALibrary}?focus=${encodeURIComponent(lastTemplateId)}`);
  }, [lastTemplateId, navigate]);

  const headerTitle = React.useMemo(() => {
    if (activeTab === 'assign') return t('ascendaQuiz.assign.title');
    if (activeTab === 'library') return t('common.course_library');
    return t('ascendaQuiz.page.title');
  }, [activeTab, t]);

  const headerSubtitle = React.useMemo(() => {
    if (activeTab === 'assign') return t('ascendaQuiz.assign.subtitle');
    if (activeTab === 'library') return t('ascendaQuiz.library.subtitle');
    return t('ascendaQuiz.page.subtitle');
  }, [activeTab, t]);

  return (
    <main data-quiz-scope className="min-h-screen py-10 transition-colors">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-6 lg:px-8">
        <motion.header
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="flex flex-col gap-6"
        >
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3 text-sm text-white/60">
              <button
                type="button"
                className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-white/80 transition hover:bg-white/10"
                onClick={() => navigate(PAGE_URLS.ContentManagement)}
              >
                {t('ascendaQuiz.page.breadcrumbHome')}
              </button>
              <span className="text-white/40">/</span>
              <span className="text-xs uppercase tracking-[0.2em] text-white/60">
                {t('ascendaQuiz.page.breadcrumbCurrent')}
              </span>
            </div>
            <LanguageSwitcher />
          </div>

          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between lg:gap-6">
              <div className="space-y-2">
                <h1 className="text-3xl font-semibold text-white lg:text-4xl">{headerTitle}</h1>
                <p className="max-w-2xl text-sm text-white/70">{headerSubtitle}</p>
              </div>
              <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/70">
                <Sparkles className="h-5 w-5 text-white" aria-hidden="true" />
                <span>{t('ascendaQuiz.page.powered')}</span>
              </div>
            </div>

            <nav className="flex flex-wrap gap-2">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => handleTabChange(tab.key)}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300 ${
                    activeTab === tab.key
                      ? 'bg-white text-surface'
                      : 'border border-white/20 bg-white/5 text-white/70 hover:bg-white/10'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </motion.header>

        {activeTab === 'generator' && (
          <>
            <section className="layout grid gap-6 lg:gap-8 xl:grid-cols-[minmax(0,1.65fr)_minmax(0,1fr)]">
              <div className="flex flex-col gap-6 lg:gap-8">
                <SourceInputPanel
                  topic={topic}
                  setTopic={setTopic}
                  youtubeUrl={youtubeUrl}
                  setYoutubeUrl={setYoutubeUrl}
                  textFile={textFile}
                  setTextFile={setTextFile}
                  errors={errors}
                  setErrors={setErrors}
                  onClearTextFile={clearTextFile}
                  youtubeValid={youtubeValid}
                />

                <SummaryPanel
                  levels={levels}
                  setLevelEnabled={setLevelEnabled}
                  setLevelCount={setLevelCount}
                  totalRequested={totalRequested}
                  canGenerate={canGenerate}
                  loading={loading}
                  onGenerate={handleGenerate}
                  feedback={feedback}
                />
              </div>

              <div className="flex flex-col gap-6 lg:gap-8">
                <QuizLevelsPanel
                  levels={levels}
                  setLevelEnabled={setLevelEnabled}
                  setLevelCount={setLevelCount}
                />
                <PreviewPanel quiz={quiz} />
              </div>
            </section>

            <SaveDraftBar
              quiz={quiz}
              onDiscard={handleDiscard}
              onSave={handleSaveDraft}
              onSaveTemplate={handleSaveTemplate}
              onOpenLibrary={handleOpenLibrary}
            />

            <div className="rounded-2xl border border-border/60 bg-surface/80 p-6 shadow-e1 backdrop-blur-sm lg:p-8">
              <p className="text-sm text-white/70">{t('ascendaQuiz.page.backNote')}</p>
              <Button
                type="button"
                variant="ghost"
                onClick={() => navigate(PAGE_URLS.ContentManagement)}
                className="mt-3 h-11 rounded-xl border border-white/10 bg-transparent text-sm font-semibold text-white transition hover:bg-white/10"
              >
                {t('ascendaQuiz.page.backCta')}
              </Button>
            </div>
          </>
        )}

        {activeTab === 'assign' && <AssignQuizzesPanel />}
        {activeTab === 'library' && <CourseLibrary focusId={focusParam} />}
      </div>
    </main>
  );
}
