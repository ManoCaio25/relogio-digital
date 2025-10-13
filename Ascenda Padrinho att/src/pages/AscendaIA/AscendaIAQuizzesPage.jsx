import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
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

import './styles/ascenda-quizz.css';

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

  const handleSave = React.useCallback(() => {
    if (!quiz) return;
    const success = saveDraft();
    window.alert(success ? t('ascendaQuiz.actions.saved') : t('ascendaQuiz.actions.saveError'));
  }, [quiz, saveDraft, t]);

  const handleDiscard = React.useCallback(() => {
    discard();
    setFeedback('');
  }, [discard, setFeedback]);

  return (
    <main data-quiz-scope className="min-h-screen bg-surface/30 py-10">
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

          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between lg:gap-6">
            <div className="space-y-2">
              <h1 className="text-3xl font-semibold text-white lg:text-4xl">
                {t('ascendaQuiz.page.title')}
              </h1>
              <p className="max-w-2xl text-sm text-white/70">
                {t('ascendaQuiz.page.subtitle')}
              </p>
            </div>
            <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/70">
              <Sparkles className="h-5 w-5 text-white" aria-hidden="true" />
              <span>{t('ascendaQuiz.page.powered')}</span>
            </div>
          </div>
        </motion.header>

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
              onGenerate={generate}
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

        <SaveDraftBar quiz={quiz} onDiscard={handleDiscard} onSave={handleSave} />

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
      </div>
    </main>
  );
}
