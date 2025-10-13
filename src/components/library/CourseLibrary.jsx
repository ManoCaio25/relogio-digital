import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLibraryStore } from '../../state/useLibraryStore';
import LibraryGrid from './LibraryGrid';
import TemplateEditor from './TemplateEditor';
import { Button } from '../common/ui/Button';

const CourseLibrary = () => {
  const { t } = useTranslation();
  const templates = useLibraryStore((state) => state.templates);
  const updateTemplate = useLibraryStore((state) => state.updateTemplate);
  const duplicateTemplate = useLibraryStore((state) => state.duplicateTemplate);
  const archiveTemplate = useLibraryStore((state) => state.archiveTemplate);
  const addTemplateFromGenerator = useLibraryStore((state) => state.addTemplateFromGenerator);

  const [search, setSearch] = useState('');
  const [showArchived, setShowArchived] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [isCreating, setIsCreating] = useState(false);

  const filteredTemplates = useMemo(() => {
    return templates.filter((template) => {
      if (showArchived ? !template.archived : template.archived) return false;
      if (search) {
        const term = search.toLowerCase();
        if (!template.title.toLowerCase().includes(term) && !template.description.toLowerCase().includes(term)) {
          return false;
        }
      }
      return true;
    });
  }, [search, showArchived, templates]);

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-white">{t('library.title')}</h1>
          <p className="text-sm text-slate-300">{t('library.subtitle')}</p>
        </div>
        <Button
          onClick={() => {
            setEditingTemplate({
              title: t('library.newTemplate'),
              description: '',
              tags: [],
              difficulty: 'Médio',
              content: ''
            });
            setIsCreating(true);
          }}
        >
          {t('library.newTemplate')}
        </Button>
      </div>

      <div className="flex flex-wrap gap-4">
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder={t('app.search')}
          className="w-full max-w-sm rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white"
        />
        <label className="flex items-center gap-2 text-sm text-slate-300">
          <input type="checkbox" checked={showArchived} onChange={(event) => setShowArchived(event.target.checked)} />
          {t('app.archived')}
        </label>
      </div>

      <LibraryGrid
        templates={filteredTemplates}
        onEdit={(template) => {
          setEditingTemplate(template);
          setIsCreating(false);
        }}
        onDuplicate={(id) => duplicateTemplate(id)}
        onArchive={(id, flag) => archiveTemplate(id, flag)}
      />

      {editingTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-6">
          <div className="w-full max-w-2xl rounded-3xl border border-white/10 bg-dark/95 p-6 shadow-soft">
            <h2 className="mb-4 text-xl font-semibold text-white">
              {isCreating ? t('library.newTemplate') : t('library.editTemplate')}
            </h2>
            <TemplateEditor
              defaultValues={editingTemplate}
              onSubmit={(values) => {
                if (isCreating) {
                  addTemplateFromGenerator(values);
                } else {
                  updateTemplate(editingTemplate.id, values);
                }
                setEditingTemplate(null);
                setIsCreating(false);
              }}
              onCancel={() => {
                setEditingTemplate(null);
                setIsCreating(false);
              }}
            />
          </div>
        </div>
      )}
    </section>
  );
};

export default CourseLibrary;
