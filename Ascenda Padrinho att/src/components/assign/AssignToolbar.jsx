import React from 'react';
import { CalendarDays, Eye, Tag, ShieldCheck } from 'lucide-react';
import { useTranslation } from '@/i18n';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export function AssignToolbar({
  dueDate,
  onDueDateChange,
  difficulty,
  onDifficultyChange,
  visibility,
  onVisibilityChange,
  tags,
  onTagsChange,
  selectedCount,
  disabled,
  onAssign,
}) {
  const { t } = useTranslation();
  const assignDisabled = disabled || selectedCount === 0;

  return (
    <section className="rounded-2xl border border-border/60 bg-surface/80 p-6 shadow-e1 backdrop-blur-sm">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-white">{t('ascendaQuiz.assign.toolbar.title')}</h3>
          <p className="text-xs text-white/60">{t('ascendaQuiz.assign.toolbar.subtitle')}</p>
        </div>
        <Badge variant="outline" aria-label={t('ascendaQuiz.assign.toolbar.selectionAria', { count: selectedCount })}>
          {t('ascendaQuiz.assign.toolbar.selection', { count: selectedCount })}
        </Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <label className="flex flex-col gap-2 text-sm text-white/80">
          <span className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-primary" aria-hidden="true" />
            {t('ascendaQuiz.assign.toolbar.dueDate')}
          </span>
          <Input
            type="date"
            value={dueDate}
            onChange={(event) => onDueDateChange(event.target.value)}
            aria-label={t('ascendaQuiz.assign.toolbar.dueDate')}
          />
        </label>

        <label className="flex flex-col gap-2 text-sm text-white/80">
          <span className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-primary" aria-hidden="true" />
            {t('ascendaQuiz.assign.toolbar.difficulty')}
          </span>
          <Select value={difficulty} onValueChange={onDifficultyChange}>
            <SelectTrigger aria-label={t('ascendaQuiz.assign.toolbar.difficulty')}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="easy">{t('ascendaQuiz.assign.difficulties.easy')}</SelectItem>
              <SelectItem value="medium">{t('ascendaQuiz.assign.difficulties.medium')}</SelectItem>
              <SelectItem value="hard">{t('ascendaQuiz.assign.difficulties.hard')}</SelectItem>
            </SelectContent>
          </Select>
        </label>

        <label className="flex flex-col gap-2 text-sm text-white/80">
          <span className="flex items-center gap-2">
            <Eye className="h-4 w-4 text-primary" aria-hidden="true" />
            {t('ascendaQuiz.assign.toolbar.visibility')}
          </span>
          <Select value={visibility} onValueChange={onVisibilityChange}>
            <SelectTrigger aria-label={t('ascendaQuiz.assign.toolbar.visibility')}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="private">{t('ascendaQuiz.assign.toolbar.visibilityPrivate')}</SelectItem>
              <SelectItem value="team">{t('ascendaQuiz.assign.toolbar.visibilityTeam')}</SelectItem>
            </SelectContent>
          </Select>
        </label>

        <label className="flex flex-col gap-2 text-sm text-white/80 md:col-span-2 xl:col-span-1">
          <span className="flex items-center gap-2">
            <Tag className="h-4 w-4 text-primary" aria-hidden="true" />
            {t('ascendaQuiz.assign.toolbar.tags')}
          </span>
          <Input
            value={tags}
            onChange={(event) => onTagsChange(event.target.value)}
            placeholder={t('ascendaQuiz.assign.toolbar.tagsPlaceholder')}
          />
          <span className="text-xs text-white/50">{t('ascendaQuiz.assign.toolbar.tagsHelper')}</span>
        </label>
      </div>

      <div className="mt-6 flex justify-end">
        <Button
          type="button"
          onClick={onAssign}
          disabled={assignDisabled}
          aria-label={t('ascendaQuiz.assign.toolbar.assignAria')}
        >
          {t('ascendaQuiz.assign.toolbar.assignSelected')}
        </Button>
      </div>
    </section>
  );
}
