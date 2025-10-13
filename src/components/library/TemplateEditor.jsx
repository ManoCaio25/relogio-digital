import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import { Button } from '../common/ui/Button';

const schema = z.object({
  title: z.string().min(3),
  description: z.string().min(5),
  tags: z.string().optional(),
  difficulty: z.string().min(1),
  content: z.string().min(5)
});

const TemplateEditor = ({ defaultValues, onSubmit, onCancel }) => {
  const { t } = useTranslation();
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      title: defaultValues?.title || '',
      description: defaultValues?.description || '',
      tags: defaultValues?.tags?.join(', ') || '',
      difficulty: defaultValues?.difficulty || 'Médio',
      content: defaultValues?.content || ''
    }
  });

  const handleSubmit = form.handleSubmit((values) => {
    onSubmit({
      ...values,
      tags: values.tags
        ? values.tags
            .split(',')
            .map((tag) => tag.trim())
            .filter(Boolean)
        : []
    });
  });

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="text-sm text-slate-300">{t('library.name')}</label>
        <input
          className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white"
          {...form.register('title')}
        />
      </div>
      <div>
        <label className="text-sm text-slate-300">{t('library.description')}</label>
        <textarea
          rows={3}
          className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white"
          {...form.register('description')}
        />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="text-sm text-slate-300">{t('app.tags')}</label>
          <input
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white"
            {...form.register('tags')}
          />
        </div>
        <div>
          <label className="text-sm text-slate-300">{t('app.difficulty')}</label>
          <input
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white"
            {...form.register('difficulty')}
          />
        </div>
      </div>
      <div>
        <label className="text-sm text-slate-300">{t('library.content')}</label>
        <textarea
          rows={4}
          className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white"
          {...form.register('content')}
        />
      </div>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="ghost" onClick={onCancel}>
          {t('app.cancel')}
        </Button>
        <Button type="submit">{t('app.save')}</Button>
      </div>
    </form>
  );
};

export default TemplateEditor;
