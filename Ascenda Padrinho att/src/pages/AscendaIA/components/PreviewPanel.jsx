import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from '@/i18n';
import { TruncatedTooltipText } from './TruncatedTooltipText';

const COLUMN_ACCENTS = {
  easy: 'bg-sky-400/30 text-sky-200',
  intermediate: 'bg-violet-400/30 text-violet-200',
  advanced: 'bg-fuchsia-400/30 text-fuchsia-200',
};

function PreviewColumn({ column, items, totalLabel }) {
  const accentClass = COLUMN_ACCENTS[column.key] ?? 'bg-white/20 text-white/70';

  return (
    <article className="flex snap-start flex-col rounded-2xl border border-border/60 bg-background/40 shadow-e1 backdrop-blur">
      <header className="sticky top-0 z-10 flex items-center justify-between gap-3 rounded-t-2xl border-b border-border/40 bg-background/70 px-4 py-3 backdrop-blur">
        <div className="flex items-center gap-2">
          <span className={`inline-flex h-2.5 w-2.5 shrink-0 rounded-full ${accentClass}`} aria-hidden="true" />
          <h4 className="text-sm font-semibold text-white">{column.title}</h4>
        </div>
        <span className="text-xs font-medium text-white/60">{totalLabel}</span>
      </header>

      <ul className="max-h-[360px] space-y-3 overflow-y-auto p-4">
        {items.length === 0 && (
          <li className="rounded-xl border border-border/40 bg-surface/60 p-3 text-xs text-white/60">
            {column.emptyLabel}
          </li>
        )}

        {items.map((item) => (
          <li
            key={item.id}
            className="rounded-xl border border-border/40 bg-surface/60 p-3 shadow-sm transition-colors hover:border-border/60"
            title={item.prompt}
          >
            <div className="flex items-start gap-2">
              <span className="mt-1 text-sm text-white/40" aria-hidden="true">
                •
              </span>
              <TruncatedTooltipText
                text={item.prompt}
                className="text-sm leading-snug text-white/80"
                tooltipClassName="max-w-sm"
                as="span"
              />
            </div>
          </li>
        ))}
      </ul>
    </article>
  );
}

export function PreviewPanel({ quiz }) {
  const { t } = useTranslation('common');

  const columns = useMemo(
    () => [
      {
        key: 'easy',
        title:
          t('ascendaQuiz.preview.basicCol', {
            defaultValue: t('ascendaQuiz.preview.columns.easy'),
          }) || t('ascendaQuiz.preview.columns.easy'),
      },
      {
        key: 'intermediate',
        title:
          t('ascendaQuiz.preview.intermediateCol', {
            defaultValue: t('ascendaQuiz.preview.columns.intermediate'),
          }) || t('ascendaQuiz.preview.columns.intermediate'),
      },
      {
        key: 'advanced',
        title:
          t('ascendaQuiz.preview.advancedCol', {
            defaultValue: t('ascendaQuiz.preview.columns.advanced'),
          }) || t('ascendaQuiz.preview.columns.advanced'),
      },
    ],
    [t],
  );

  const totals = useMemo(() => ({
    easy: quiz?.easy?.length ?? 0,
    intermediate: quiz?.intermediate?.length ?? 0,
    advanced: quiz?.advanced?.length ?? 0,
  }), [quiz]);

  const totalItems = totals.easy + totals.intermediate + totals.advanced;
  const topicLabel = quiz?.topic?.trim() ? quiz.topic : t('common.misc.unknown');

  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.18 }}
      className="rounded-2xl border border-border/60 bg-surface/80 p-6 shadow-e1 backdrop-blur-sm lg:p-8"
      aria-labelledby="ascenda-preview"
    >
      <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-1">
          <h2 id="ascenda-preview" className="text-lg font-semibold text-white">
            {t('ascendaQuiz.preview.title')}
          </h2>
          <p className="text-sm text-white/70">
            {t('ascendaQuiz.preview.subtitle', t('ascendaQuiz.preview.description'))}
          </p>
        </div>

        {quiz && (
          <div className="flex flex-wrap items-center gap-2">
            <span
              className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white/70"
              title={topicLabel}
              aria-label={t('ascendaQuiz.preview.topicAria', { topic: topicLabel })}
            >
              {topicLabel}
            </span>
            <span
              className="rounded-full bg-brand/20 px-3 py-1 text-xs font-semibold text-white/80"
              aria-label={t('ascendaQuiz.preview.totalItemsAria', { count: totalItems })}
              title={t('ascendaQuiz.preview.totalItemsTooltip', { count: totalItems })}
            >
              {t('ascendaQuiz.levels.items', { count: totalItems })}
            </span>
          </div>
        )}
      </div>

      {!quiz && <p className="text-sm text-white/60">{t('ascendaQuiz.preview.emptyState')}</p>}

      {quiz && (
        <div className="space-y-5">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-1">
                <p className="text-xs uppercase tracking-[0.08em] text-white/50">{quiz.source}</p>
                <TruncatedTooltipText
                  text={quiz.topic || topicLabel}
                  className="text-xl font-semibold text-white"
                  tooltipClassName="max-w-lg"
                  as="h3"
                />
              </div>
              <span
                className="self-start rounded-full border border-white/15 bg-white/5 px-4 py-1 text-xs font-medium text-white/70"
                aria-label={t('ascendaQuiz.preview.totalItemsAria', { count: totalItems })}
                title={t('ascendaQuiz.preview.totalItemsTooltip', { count: totalItems })}
              >
                {t('ascendaQuiz.levels.items', { count: totalItems })}
              </span>
            </div>
          </div>

          <div className="overflow-x-auto scroll-smooth pb-2">
            <div
              className="grid snap-x snap-mandatory gap-5 [grid-auto-flow:column] [grid-template-columns:repeat(auto-fit,minmax(240px,1fr))] sm:[grid-auto-flow:row] sm:[grid-template-columns:repeat(auto-fit,minmax(240px,1fr))] lg:grid-cols-2 xl:grid-cols-3"
            >
              {columns.map((column) => {
                const items = quiz?.[column.key] ?? [];
                const totalLabel = t('ascendaQuiz.levels.items', { count: items.length });
                return (
                  <PreviewColumn
                    key={column.key}
                    column={{ ...column, emptyLabel: t('ascendaQuiz.preview.noItems') }}
                    items={items}
                    totalLabel={totalLabel}
                  />
                );
              })}
            </div>
          </div>
        </div>
      )}
    </motion.section>
  );
}
