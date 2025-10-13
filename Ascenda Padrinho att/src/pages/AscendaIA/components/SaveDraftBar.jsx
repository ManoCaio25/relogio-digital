import React from 'react';
import { useTranslation } from '@/i18n';
import { Button } from '@/components/ui/button';

export function SaveDraftBar({ quiz, onDiscard, onSave }) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-border/60 bg-surface/80 p-4 shadow-e1 backdrop-blur-sm md:flex-row md:items-center md:justify-between">
      <p className="text-sm text-white/70" aria-live="polite">
        {quiz ? t('ascendaQuiz.actions.reviewBeforeSaving') : t('ascendaQuiz.actions.generateToEnable')}
      </p>
      <div className="flex flex-col gap-2 sm:flex-row">
        <Button
          type="button"
          variant="outline"
          onClick={onDiscard}
          className="h-10 rounded-xl border-white/20 bg-transparent text-sm font-semibold text-white transition hover:bg-white/10"
        >
          {t('ascendaQuiz.actions.discard')}
        </Button>
        <Button
          type="button"
          onClick={onSave}
          disabled={!quiz}
          className="h-10 rounded-xl bg-emerald-500/80 text-sm font-semibold text-emerald-950 transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {t('ascendaQuiz.actions.save')}
        </Button>
      </div>
    </div>
  );
}
