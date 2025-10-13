import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/i18n';

function normalizeTags(input) {
  return input
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean);
}

const DIFFICULTY_OPTIONS = [
  { value: 'Easy', label: 'Easy' },
  { value: 'Medium', label: 'Medium' },
  { value: 'Hard', label: 'Hard' },
];

export function TemplateEditor({ template, open, onClose, onSubmit }) {
  const { t } = useTranslation();
  const [title, setTitle] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [tagsInput, setTagsInput] = React.useState('');
  const [difficulty, setDifficulty] = React.useState('Medium');
  const [items, setItems] = React.useState([]);

  React.useEffect(() => {
    if (!template) return;
    setTitle(template.title ?? '');
    setDescription(template.description ?? '');
    setTagsInput((template.tags ?? []).join(', '));
    setDifficulty(template.difficulty ?? 'Medium');
    setItems(
      (template.items ?? []).map((item) => ({
        id: item.id,
        question: item.question ?? '',
        options: Array.isArray(item.options) ? item.options : [],
        answer: item.answer ?? '',
      })),
    );
  }, [template]);

  const handleItemChange = React.useCallback((index, patch) => {
    setItems((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], ...patch };
      return next;
    });
  }, []);

  const handleOptionsChange = React.useCallback((index, value) => {
    const options = value
      .split('\n')
      .map((option) => option.trim())
      .filter(Boolean);
    handleItemChange(index, { options });
  }, [handleItemChange]);

  const handleAddItem = React.useCallback(() => {
    setItems((prev) => [
      ...prev,
      {
        id: `qitm_editor_${Date.now()}_${prev.length}`,
        question: '',
        options: [],
        answer: '',
      },
    ]);
  }, []);

  const handleRemoveItem = React.useCallback((index) => {
    setItems((prev) => prev.filter((_, itemIndex) => itemIndex !== index));
  }, []);

  const handleSubmit = React.useCallback(() => {
    if (!template) return;
    onSubmit?.({
      title,
      description,
      difficulty,
      tags: normalizeTags(tagsInput),
      items: items.map((item) => ({
        id: item.id,
        question: item.question,
        options: item.options,
        answer: item.answer,
      })),
    });
  }, [description, difficulty, items, onSubmit, tagsInput, template, title]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[9998] flex items-center justify-center bg-black/40 px-4 py-10 backdrop-blur"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -12 }}
            transition={{ type: 'spring', stiffness: 220, damping: 22 }}
            className="relative flex max-h-[90vh] w-full max-w-3xl flex-col gap-6 overflow-y-auto rounded-3xl border border-white/10 bg-surface/95 p-6 shadow-e3"
          >
            <header className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-semibold text-white">{t('common.edit')}</h2>
                <p className="text-sm text-white/70">{template?.title}</p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="rounded-full border border-white/10 px-4 py-2 text-sm text-white/70 transition hover:bg-white/10"
              >
                {t('common.actions.close')}
              </button>
            </header>

            <div className="grid gap-4">
              <div className="grid gap-2">
                <label className="text-sm font-medium text-white/80">{t('common.placeholders.courseTitleExample')}</label>
                <Input value={title} onChange={(event) => setTitle(event.target.value)} />
              </div>

              <div className="grid gap-2">
                <label className="text-sm font-medium text-white/80">{t('common.labels.descriptionOptional')}</label>
                <Textarea
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  rows={3}
                />
              </div>

              <div className="grid gap-2">
                <label className="text-sm font-medium text-white/80">Tags</label>
                <Input
                  value={tagsInput}
                  onChange={(event) => setTagsInput(event.target.value)}
                  placeholder="frontend, react, hooks"
                />
              </div>

              <div className="grid gap-2">
                <label className="text-sm font-medium text-white/80">{t('common.filters.level')}</label>
                <Select value={difficulty} onValueChange={setDifficulty}>
                  <SelectTrigger className="rounded-2xl border border-white/20 bg-white/5 text-white">
                    <SelectValue placeholder="Medium" />
                  </SelectTrigger>
                  <SelectContent>
                    {DIFFICULTY_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <section className="space-y-4">
                <header className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold uppercase tracking-[0.08em] text-white/60">
                    {t('ascendaQuiz.preview.title')}
                  </h3>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={handleAddItem}
                    className="h-9 rounded-2xl border border-white/15 text-sm text-white hover:bg-white/10"
                  >
                    {t('ascendaQuiz.library.addQuestion')}
                  </Button>
                </header>

                <div className="space-y-3">
                  {items.map((item, index) => (
                    <div key={item.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      <div className="flex items-start justify-between gap-3">
                        <span className="text-xs font-semibold uppercase tracking-[0.08em] text-white/60">
                          #{index + 1}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(index)}
                          className="text-xs text-white/60 transition hover:text-white"
                        >
                          {t('common.actions.cancel')}
                        </button>
                      </div>

                      <div className="mt-3 grid gap-2">
                        <label className="text-xs font-medium text-white/70">
                          {t('ascendaQuiz.library.questionLabel')}
                        </label>
                        <Textarea
                          rows={2}
                          value={item.question}
                          onChange={(event) => handleItemChange(index, { question: event.target.value })}
                        />
                      </div>

                      <div className="mt-3 grid gap-2">
                        <label className="text-xs font-medium text-white/70">
                          {t('ascendaQuiz.library.optionsLabel')}
                        </label>
                        <Textarea
                          rows={3}
                          value={item.options.join('\n')}
                          onChange={(event) => handleOptionsChange(index, event.target.value)}
                          placeholder="Option A\nOption B\nOption C"
                        />
                      </div>

                      <div className="mt-3 grid gap-2">
                        <label className="text-xs font-medium text-white/70">
                          {t('ascendaQuiz.library.answerLabel')}
                        </label>
                        <Input
                          value={item.answer}
                          onChange={(event) => handleItemChange(index, { answer: event.target.value })}
                        />
                      </div>
                    </div>
                  ))}
                  {items.length === 0 && (
                    <p className="rounded-2xl border border-dashed border-white/10 bg-white/5 p-6 text-center text-sm text-white/60">
                      {t('ascendaQuiz.library.emptyItems')}
                    </p>
                  )}
                </div>
              </section>
            </div>

            <footer className="flex justify-end gap-3">
              <Button
                type="button"
                variant="ghost"
                onClick={onClose}
                className="h-10 rounded-2xl border border-white/10 text-sm text-white hover:bg-white/10"
              >
                {t('common.actions.cancel')}
              </Button>
              <Button
                type="button"
                onClick={handleSubmit}
                className="h-10 rounded-2xl bg-emerald-500/80 px-6 text-sm font-semibold text-emerald-950 hover:brightness-110"
              >
                {t('common.actions.saveChanges')}
              </Button>
            </footer>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default TemplateEditor;

