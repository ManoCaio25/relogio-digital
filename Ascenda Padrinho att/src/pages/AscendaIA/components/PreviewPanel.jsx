import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from '@/i18n';
import { TruncatedTooltipText } from './TruncatedTooltipText';

const COLUMN_TITLES = {
  easy: 'ascendaQuiz.preview.columns.easy',
  intermediate: 'ascendaQuiz.preview.columns.intermediate',
  advanced: 'ascendaQuiz.preview.columns.advanced',
};

function PreviewColumn({ label, items }) {
  const { t } = useTranslation();
  const title = t(label);

  return (
    <article className="flex min-w-[220px] snap-start flex-col gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 text-white/80">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-sm font-medium text-white/90">{title}</h3>
        <span className="text-xs text-white/50">{items.length}</span>
      </div>
      <ul className="space-y-3">
        {items.length === 0 && <li className="text-xs text-white/50">{t('ascendaQuiz.preview.noItems')}</li>}
        {items.map((item) => (
          <li key={item.id} className="rounded-xl border border-white/10 bg-white/5 p-3">
            <TruncatedTooltipText
              text={item.prompt}
              className="text-sm leading-snug text-white/70"
              tooltipClassName="max-w-xs"
              as="p"
            />
          </li>
        ))}
      </ul>
    </article>
  );
}

export function PreviewPanel({ quiz }) {
  const { t } = useTranslation();
  const totalItems = (quiz?.easy?.length || 0) + (quiz?.intermediate?.length || 0) + (quiz?.advanced?.length || 0);

  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.18 }}
      className="rounded-2xl border border-border/60 bg-surface/80 p-6 shadow-e1 backdrop-blur-sm lg:p-8"
      aria-labelledby="ascenda-preview"
    >
      <div className="space-y-2">
        <h2 id="ascenda-preview" className="text-lg font-semibold text-white">
          {t('ascendaQuiz.preview.title')}
        </h2>
        <p className="text-sm text-white/70">{t('ascendaQuiz.preview.description')}</p>
      </div>

      {!quiz && <p className="mt-6 text-sm text-white/60">{t('ascendaQuiz.preview.emptyState')}</p>}

      {quiz && (
        <div className="mt-6 space-y-6">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-1">
                <p className="text-xs uppercase tracking-[0.08em] text-white/50">{quiz.source}</p>
                <TruncatedTooltipText
                  text={quiz.topic}
                  className="text-xl font-semibold text-white"
                  tooltipClassName="max-w-lg"
                  as="h3"
                />
              </div>
              <span className="self-start rounded-full border border-white/15 bg-white/5 px-4 py-1 text-xs font-medium text-white/70">
                {t('ascendaQuiz.preview.totalItems', { count: totalItems })}
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <div className="flex gap-3 pb-1 snap-x snap-mandatory sm:grid sm:grid-cols-1 sm:gap-4 sm:snap-none lg:grid-cols-2 xl:grid-cols-3">
              <PreviewColumn label={COLUMN_TITLES.easy} items={quiz.easy} />
              <PreviewColumn label={COLUMN_TITLES.intermediate} items={quiz.intermediate} />
              <PreviewColumn label={COLUMN_TITLES.advanced} items={quiz.advanced} />
            </div>
          </div>
        </div>
      )}
    </motion.section>
  );
}
