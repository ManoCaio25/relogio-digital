import React from 'react';
import { motion } from 'framer-motion';
import { Edit3 } from 'lucide-react';
import { useTranslation } from '@/i18n';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/utils';

export function QuizPreviewCard({ quiz, selected, onToggle, onUpdateMeta }) {
  const { t } = useTranslation();
  const [open, setOpen] = React.useState(false);
  const [title, setTitle] = React.useState(quiz.title);
  const [difficulty, setDifficulty] = React.useState(quiz.difficulty ?? 'medium');
  const [tagsValue, setTagsValue] = React.useState(() => (quiz.tags ?? []).join(', '));

  React.useEffect(() => {
    setTitle(quiz.title);
    setDifficulty(quiz.difficulty ?? 'medium');
    setTagsValue((quiz.tags ?? []).join(', '));
  }, [quiz]);

  const difficultyKey = (quiz.difficulty ?? 'medium').toLowerCase();
  const difficultyLabel = t(`ascendaQuiz.assign.difficulties.${difficultyKey}`);

  const handleSubmit = React.useCallback(
    (event) => {
      event.preventDefault();
      const normalizedTags = tagsValue
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean);
      onUpdateMeta(quiz.id, {
        title: title.trim() || quiz.title,
        difficulty,
        tags: normalizedTags,
      });
      setOpen(false);
    },
    [difficulty, onUpdateMeta, quiz.id, quiz.title, tagsValue, title],
  );

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className={cn(
        'group relative flex flex-col gap-4 rounded-2xl border border-border/60 bg-surface/80 p-5 shadow-e1 backdrop-blur-sm transition hover:border-brand/60',
        selected && 'border-brand/70 bg-brand/10',
      )}
    >
      <div className="flex items-start gap-3">
        <Checkbox
          checked={selected}
          onCheckedChange={() => onToggle(quiz.id)}
          aria-label={t('ascendaQuiz.assign.cards.selectAria', { title: quiz.title })}
        />
        <div className="flex-1 space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h4 className="text-base font-semibold text-white" title={quiz.title}>
                {quiz.title}
              </h4>
              <p className="text-xs text-white/60">
                {t('ascendaQuiz.assign.cards.items', { count: quiz.itemsCount })}
              </p>
            </div>
            <Badge
              variant="outline"
              className="border-brand/60 text-xs uppercase tracking-wide text-brand"
              aria-label={t('ascendaQuiz.assign.cards.difficultyAria', { difficulty: difficultyLabel })}
            >
              {difficultyLabel}
            </Badge>
          </div>

          {quiz.contentPreview && (
            <p className="line-clamp-3 text-sm text-white/70" title={quiz.contentPreview} role="tooltip">
              {quiz.contentPreview}
            </p>
          )}

          {quiz.tags?.length ? (
            <div className="flex flex-wrap gap-2">
              {quiz.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="border-white/20 text-white/70">
                  #{tag}
                </Badge>
              ))}
            </div>
          ) : null}
        </div>
      </div>

      <div className="flex justify-end">
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={() => setOpen(true)}
          className="gap-2 text-xs text-white/70 hover:text-white"
          aria-label={t('ascendaQuiz.assign.cards.editMetaAria', { title: quiz.title })}
        >
          <Edit3 className="h-4 w-4" aria-hidden="true" />
          {t('ascendaQuiz.assign.cards.editMeta')}
        </Button>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-xl bg-surface/95 backdrop-blur">
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>{t('ascendaQuiz.assign.editModal.title')}</DialogTitle>
              <DialogDescription>{t('ascendaQuiz.assign.editModal.subtitle')}</DialogDescription>
            </DialogHeader>

            <div className="space-y-4 p-6 pt-4">
              <label className="flex flex-col gap-2 text-sm text-white/80">
                <span>{t('ascendaQuiz.assign.editModal.fields.title')}</span>
                <Input
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  placeholder={t('ascendaQuiz.assign.editModal.fields.titlePlaceholder')}
                />
              </label>

              <label className="flex flex-col gap-2 text-sm text-white/80">
                <span>{t('ascendaQuiz.assign.editModal.fields.difficulty')}</span>
                <Select value={difficulty} onValueChange={setDifficulty}>
                  <SelectTrigger aria-label={t('ascendaQuiz.assign.editModal.fields.difficulty')}>
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
                <span>{t('ascendaQuiz.assign.editModal.fields.tags')}</span>
                <Input
                  value={tagsValue}
                  onChange={(event) => setTagsValue(event.target.value)}
                  placeholder={t('ascendaQuiz.assign.editModal.fields.tagsPlaceholder')}
                />
                <span className="text-xs text-white/50">
                  {t('ascendaQuiz.assign.editModal.fields.tagsHelper')}
                </span>
              </label>
            </div>

            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
                {t('common.actions.cancel')}
              </Button>
              <Button type="submit" variant="default">
                {t('common.actions.save')}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </motion.article>
  );
}
