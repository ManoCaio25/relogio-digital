import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from '@/i18n';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { TruncatedTooltipText } from './TruncatedTooltipText';
import { MAX_ITEMS_PER_LEVEL, QUIZ_LEVELS } from '../constants';

const LEVEL_TITLE = {
  easy: 'ascendaQuiz.levels.basic',
  intermediate: 'ascendaQuiz.levels.intermediate',
  advanced: 'ascendaQuiz.levels.advanced',
};

const LEVEL_DESCRIPTION = {
  easy: 'ascendaQuiz.levels.basicDesc',
  intermediate: 'ascendaQuiz.levels.intermediateDesc',
  advanced: 'ascendaQuiz.levels.advancedDesc',
};

function LevelRow({ level, onToggle, onCountChange, t }) {
  const label = t(LEVEL_TITLE[level.code]);
  const description = t(LEVEL_DESCRIPTION[level.code]);

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <label htmlFor={`ascenda-summary-${level.code}`} className="text-sm font-semibold text-white">
            {label}
          </label>
          <TruncatedTooltipText
            text={description}
            className="text-xs text-white/60"
            tooltipClassName="max-w-sm"
            as="p"
          />
        </div>
        <Checkbox
          id={`ascenda-summary-${level.code}`}
          checked={level.enabled}
          onCheckedChange={(value) => onToggle(level.code, Boolean(value))}
          className="mt-1 data-[state=checked]:bg-white/90 data-[state=checked]:text-background"
          aria-label={t('ascendaQuiz.controls.toggle', { level: label })}
        />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={() => onCountChange(level.code, Math.max(0, Number(level.count || 0) - 1))}
          disabled={!level.enabled}
          className="h-8 w-8 rounded-lg border-white/30 bg-background/70 text-lg text-white transition hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-violet-400/70 disabled:cursor-not-allowed disabled:opacity-50"
          aria-label={t('ascendaQuiz.controls.decrease', { level: label })}
        >
          −
        </Button>
        <Input
          type="number"
          inputMode="numeric"
          min={0}
          max={MAX_ITEMS_PER_LEVEL}
          value={level.count ?? 0}
          onChange={(event) => onCountChange(level.code, event.target.value)}
          onBlur={(event) => onCountChange(level.code, event.target.value)}
          disabled={!level.enabled}
          className="h-8 w-20 rounded-lg border-border/60 bg-background/80 text-center text-sm font-semibold text-white"
          aria-label={t('ascendaQuiz.controls.itemsField', { level: label })}
        />
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={() =>
            onCountChange(
              level.code,
              Math.min(MAX_ITEMS_PER_LEVEL, Number(level.count || 0) + 1),
            )
          }
          disabled={!level.enabled}
          className="h-8 w-8 rounded-lg border-white/30 bg-background/70 text-lg text-white transition hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-violet-400/70 disabled:cursor-not-allowed disabled:opacity-50"
          aria-label={t('ascendaQuiz.controls.increase', { level: label })}
        >
          +
        </Button>
      </div>
    </div>
  );
}

export function SummaryPanel({
  levels,
  setLevelEnabled,
  setLevelCount,
  totalRequested,
  canGenerate,
  loading,
  onGenerate,
  feedback,
}) {
  const { t } = useTranslation();

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.26, delay: 0.08 }}
      className="rounded-2xl border border-border/60 bg-surface/80 p-6 shadow-e1 backdrop-blur-sm lg:p-8"
      aria-labelledby="ascenda-summary"
    >
      <div className="space-y-2">
        <h2 id="ascenda-summary" className="text-lg font-semibold text-white">
          {t('ascendaQuiz.summary.title')}
        </h2>
        <p className="text-sm text-white/70">{t('ascendaQuiz.summary.description')}</p>
      </div>

      <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-5">
        <span className="text-xs uppercase tracking-[0.12em] text-white/40">
          {t('ascendaQuiz.summary.totalRequested')}
        </span>
        <p className="mt-3 text-3xl font-semibold text-white">{totalRequested}</p>
        <p className="text-xs text-white/60">{t('ascendaQuiz.summary.countNote')}</p>
      </div>

      <div className="mt-6 space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.1em] text-white/50">
          {t('ascendaQuiz.summary.levelOverview')}
        </p>
        <div className="space-y-3">
          {QUIZ_LEVELS.map((config) => {
            const level = levels.find((item) => item.code === config.code) ?? config;
            return (
              <LevelRow
                key={config.code}
                level={level}
                onToggle={setLevelEnabled}
                onCountChange={setLevelCount}
                t={t}
              />
            );
          })}
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-3" aria-live="polite">
        <Button
          onClick={onGenerate}
          disabled={!canGenerate || loading}
          className="h-11 rounded-xl bg-gradient-to-r from-violet-500/90 to-fuchsia-500/80 text-base font-semibold text-white shadow-e2 transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400/70 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? t('ascendaQuiz.summary.generating') : t('ascendaQuiz.summary.generate')}
        </Button>
        {loading && <Progress value={70} className="h-2 overflow-hidden rounded-full bg-white/10" />}
        {!loading && feedback && (
          <p className="text-xs text-warning">{t(feedback)}</p>
        )}
        {!loading && !feedback && !canGenerate && (
          <p className="text-xs text-white/60">{t('ascendaQuiz.summary.disabledHint')}</p>
        )}
      </div>
    </motion.section>
  );
}
