import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from '@/i18n';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { TruncatedTooltipText } from './TruncatedTooltipText';
import { MAX_ITEMS_PER_LEVEL, QUIZ_LEVELS } from '../constants';

const ACCENT_RING = {
  sky: 'ring-sky-400/30',
  violet: 'ring-violet-400/30',
  fuchsia: 'ring-fuchsia-400/30',
};

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

export function QuizLevelsPanel({ levels, setLevelEnabled, setLevelCount }) {
  const { t } = useTranslation();

  const getLevel = React.useCallback((code) => levels.find((level) => level.code === code), [levels]);

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, delay: 0.12 }}
      className="rounded-2xl border border-border/60 bg-surface/80 p-6 shadow-e1 backdrop-blur-sm lg:p-8"
      aria-labelledby="ascenda-levels"
    >
      <div className="space-y-2">
        <h2 id="ascenda-levels" className="text-lg font-semibold text-white">
          {t('ascendaQuiz.levels.title')}
        </h2>
        <p className="text-sm text-white/70">{t('ascendaQuiz.levels.subtitle')}</p>
      </div>

      <div className="mt-6 space-y-4">
        {QUIZ_LEVELS.map((config, index) => {
          const level = getLevel(config.code) ?? config;
          const accent = ACCENT_RING[level.accent] ?? ACCENT_RING.sky;
          const levelLabel = t(LEVEL_TITLE[config.code]);
          const description = t(LEVEL_DESCRIPTION[config.code]);
          const itemsLabel = level.enabled
            ? t('ascendaQuiz.levels.items', { count: Number(level.count || 0) })
            : t('ascendaQuiz.levels.disabled');

          return (
            <motion.article
              key={config.code}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.24, delay: 0.05 * index }}
              className={`flex flex-col gap-5 rounded-2xl border border-white/10 bg-white/5 p-5 ring-1 ${accent}`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-2">
                  <h3 className="text-base font-semibold text-white">{levelLabel}</h3>
                  <TruncatedTooltipText
                    text={description}
                    className="text-sm text-white/60"
                    tooltipClassName="max-w-sm"
                  />
                </div>
                <Checkbox
                  id={`ascenda-card-${level.code}`}
                  checked={level.enabled}
                  onCheckedChange={(value) => setLevelEnabled(level.code, Boolean(value))}
                  className="mt-1 data-[state=checked]:bg-white/90 data-[state=checked]:text-background"
                  aria-label={t('ascendaQuiz.controls.toggle', { level: levelLabel })}
                />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    disabled={!level.enabled}
                    onClick={() => setLevelCount(level.code, Math.max(0, Number(level.count || 0) - 1))}
                    className="h-9 w-9 rounded-xl border-white/30 bg-background/70 text-lg text-white transition hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-violet-400/70 disabled:cursor-not-allowed disabled:opacity-50"
                    aria-label={t('ascendaQuiz.controls.decrease', { level: levelLabel })}
                  >
                    −
                  </Button>
                  <span className="text-lg font-semibold text-white">{level.count ?? 0}</span>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    disabled={!level.enabled}
                    onClick={() =>
                      setLevelCount(
                        level.code,
                        Math.min(MAX_ITEMS_PER_LEVEL, Number(level.count || 0) + 1),
                      )
                    }
                    className="h-9 w-9 rounded-xl border-white/30 bg-background/70 text-lg text-white transition hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-violet-400/70 disabled:cursor-not-allowed disabled:opacity-50"
                    aria-label={t('ascendaQuiz.controls.increase', { level: levelLabel })}
                  >
                    +
                  </Button>
                </div>
                <span className="text-xs uppercase tracking-[0.08em] text-white/60">{itemsLabel}</span>
              </div>
            </motion.article>
          );
        })}
      </div>
    </motion.section>
  );
}
