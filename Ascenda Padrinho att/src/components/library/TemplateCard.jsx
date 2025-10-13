import React from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/i18n';
import { formatDistanceToNow } from 'date-fns';

function formatRelativeTime(timestamp) {
  if (!timestamp) return '';
  try {
    return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
  } catch (error) {
    return '';
  }
}

export function TemplateCard({ template, onEdit, onAssign, onDuplicate, onArchive }) {
  const { t } = useTranslation();
  const updatedRelative = formatRelativeTime(template.updatedAt);

  return (
    <motion.article
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ type: 'spring', stiffness: 220, damping: 18 }}
      className={`flex h-full flex-col justify-between rounded-3xl border border-white/10 bg-surface/80 p-6 shadow-e2 backdrop-blur ${
        template.archived ? 'opacity-70' : ''
      }`}
    >
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-white">{template.title}</h3>
            {template.description && (
              <p className="text-sm text-white/70 line-clamp-2">{template.description}</p>
            )}
          </div>
          {template.archived && (
            <Badge variant="outline" className="border-amber-400/60 text-amber-300">
              {t('common.archived')}
            </Badge>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs text-white/60">
          <Badge className="bg-violet-500/20 text-violet-200">{template.difficulty}</Badge>
          <Badge variant="outline">v{template.version}</Badge>
          {updatedRelative && <span>{updatedRelative}</span>}
        </div>

        {template.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {template.tags.map((tag) => (
              <Badge key={tag} className="bg-white/10 text-white/80">
                #{tag}
              </Badge>
            ))}
          </div>
        )}
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        <Button
          type="button"
          onClick={() => onEdit?.(template)}
          className="h-9 flex-1 rounded-2xl bg-white/90 text-sm font-semibold text-surface hover:brightness-110"
        >
          {t('common.edit')}
        </Button>
        <Button
          type="button"
          variant="ghost"
          onClick={() => onDuplicate?.(template)}
          className="h-9 flex-1 rounded-2xl border border-white/15 text-sm text-white hover:bg-white/10"
        >
          {t('common.duplicate')}
        </Button>
        <Button
          type="button"
          variant="ghost"
          onClick={() => onAssign?.(template)}
          className="h-9 flex-1 rounded-2xl border border-emerald-400/30 text-sm text-emerald-200 hover:bg-emerald-400/10"
        >
          {t('common.assign')}
        </Button>
        <Button
          type="button"
          variant="ghost"
          onClick={() => onArchive?.(template, !template.archived)}
          className="h-9 flex-1 rounded-2xl border border-white/15 text-sm text-white/80 hover:bg-white/10"
        >
          {template.archived ? t('common.unarchive') : t('common.archived')}
        </Button>
      </div>
    </motion.article>
  );
}

