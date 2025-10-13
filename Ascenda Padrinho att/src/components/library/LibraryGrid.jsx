import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '@/i18n';
import { TemplateCard } from './TemplateCard';

export function LibraryGrid({
  templates,
  focusId,
  onEdit,
  onAssign,
  onDuplicate,
  onArchive,
  emptyMessage,
}) {
  const { t } = useTranslation();

  React.useEffect(() => {
    if (!focusId) return;
    const element = document.getElementById(`library-card-${focusId}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      element.classList.add('ring-2', 'ring-violet-300/60');
      const timeout = window.setTimeout(() => {
        element.classList.remove('ring-2', 'ring-violet-300/60');
      }, 1600);
      return () => window.clearTimeout(timeout);
    }
    return undefined;
  }, [focusId, templates]);

  if (!templates.length) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center text-sm text-white/70">
        {emptyMessage ?? t('ascendaQuiz.library.empty')}
      </div>
    );
  }

  return (
    <AnimatePresence mode="popLayout">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {templates.map((template) => (
          <motion.div
            key={template.id}
            layout
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2 }}
            id={`library-card-${template.id}`}
            className="h-full"
          >
            <TemplateCard
              template={template}
              onEdit={onEdit}
              onAssign={onAssign}
              onDuplicate={onDuplicate}
              onArchive={onArchive}
            />
          </motion.div>
        ))}
      </div>
    </AnimatePresence>
  );
}

