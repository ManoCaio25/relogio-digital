import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from '@/i18n';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { LibraryGrid } from '@/components/library/LibraryGrid';
import TemplateEditor from '@/components/library/TemplateEditor';
import AssignFromTemplateModal from '@/components/library/AssignFromTemplateModal';
import { useQuizzesStore } from './stores/useQuizzesStore';
import { useToast } from '@/components/feedback/Toaster';

const DIFFICULTY_FILTERS = [
  { value: 'all', label: 'All' },
  { value: 'Easy', label: 'Easy' },
  { value: 'Medium', label: 'Medium' },
  { value: 'Hard', label: 'Hard' },
];

function normalizeText(text) {
  return (text ?? '').toLowerCase();
}

export default function CourseLibrary({ focusId }) {
  const { t } = useTranslation();
  const templates = useQuizzesStore((state) => state.templates);
  const updateTemplate = useQuizzesStore((state) => state.updateTemplate);
  const duplicateTemplate = useQuizzesStore((state) => state.duplicateTemplate);
  const archiveTemplate = useQuizzesStore((state) => state.archiveTemplate);
  const assignFromTemplate = useQuizzesStore((state) => state.assignFromTemplate);
  const { pushToast } = useToast();

  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedTags, setSelectedTags] = React.useState([]);
  const [difficultyFilter, setDifficultyFilter] = React.useState('all');
  const [showArchived, setShowArchived] = React.useState(false);
  const [editingTemplate, setEditingTemplate] = React.useState(null);
  const [assigningTemplate, setAssigningTemplate] = React.useState(null);
  const [focus, setFocus] = React.useState(focusId ?? null);

  React.useEffect(() => {
    if (focusId) {
      setFocus(focusId);
    }
  }, [focusId, templates.length]);

  const allTags = React.useMemo(() => {
    const tagSet = new Set();
    templates.forEach((template) => {
      (template.tags ?? []).forEach((tag) => tagSet.add(tag));
    });
    return Array.from(tagSet).sort((a, b) => a.localeCompare(b));
  }, [templates]);

  const filteredTemplates = React.useMemo(() => {
    return templates.filter((template) => {
      if (!showArchived && template.archived) return false;

      if (difficultyFilter !== 'all' && template.difficulty !== difficultyFilter) {
        return false;
      }

      if (selectedTags.length) {
        const templateTags = template.tags ?? [];
        const matchesAll = selectedTags.every((tag) => templateTags.includes(tag));
        if (!matchesAll) return false;
      }

      if (searchTerm.trim()) {
        const term = normalizeText(searchTerm);
        const haystack = [template.title, template.description, ...(template.tags ?? [])]
          .map(normalizeText)
          .join(' ');
        if (!haystack.includes(term)) {
          return false;
        }
      }

      return true;
    });
  }, [difficultyFilter, searchTerm, selectedTags, showArchived, templates]);

  const toggleTag = React.useCallback((tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((item) => item !== tag) : [...prev, tag],
    );
  }, []);

  const handleDuplicate = React.useCallback(
    (template) => {
      const copy = duplicateTemplate(template.id);
      if (copy) {
        pushToast({
          variant: 'success',
          title: t('common.duplicate'),
          description: copy.title,
        });
        setFocus(copy.id);
      }
    },
    [duplicateTemplate, pushToast, t],
  );

  const handleArchive = React.useCallback(
    (template, archive) => {
      if (archive) {
        const confirmed = window.confirm(
          t('ascendaQuiz.library.confirmArchive', { title: template.title }),
        );
        if (!confirmed) return;
      }

      const updated = archiveTemplate(template.id, archive);
      if (!updated) return;

      pushToast({
        variant: archive ? 'default' : 'success',
        title: archive ? t('common.archived') : t('common.unarchive'),
        description: template.title,
        duration: archive ? 5000 : undefined,
        action: archive
          ? {
              label: t('common.unarchive'),
              onClick: () => archiveTemplate(template.id, false),
            }
          : undefined,
      });
    },
    [archiveTemplate, pushToast, t],
  );

  const handleEditSubmit = React.useCallback(
    (payload) => {
      if (!editingTemplate) return;
      const updated = updateTemplate(editingTemplate.id, payload);
      if (updated) {
        pushToast({
          variant: 'success',
          title: t('common.new_version_saved'),
          description: updated.title,
        });
      }
      setEditingTemplate(null);
    },
    [editingTemplate, pushToast, t, updateTemplate],
  );

  const handleAssign = React.useCallback(
    ({ assignees, dueDate, visibility }) => {
      if (!assigningTemplate) return;
      try {
        const assignment = assignFromTemplate(assigningTemplate.id, {
          assignees,
          dueDate,
          visibility,
        });
        pushToast({
          variant: 'success',
          title: t('common.assign_from_template'),
          description: `${assigningTemplate.title} • ${assignees.length} ${t('common.status.assigned').toLowerCase()}`,
        });
        setAssigningTemplate(null);
        setFocus(assigningTemplate.id);
        return assignment;
      } catch (error) {
        pushToast({
          variant: 'error',
          title: t('ascendaQuiz.library.assignError'),
          description: error.message,
        });
      }
      return null;
    },
    [assignFromTemplate, assigningTemplate, pushToast, t],
  );

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="flex flex-col gap-6"
    >
      <div className="rounded-3xl border border-white/10 bg-surface/80 p-6 shadow-e2 backdrop-blur">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="grid gap-2">
            <label className="text-xs font-semibold uppercase tracking-[0.08em] text-white/60">
              {t('ascendaQuiz.library.searchLabel')}
            </label>
            <Input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder={t('ascendaQuiz.library.searchPlaceholder')}
            />
          </div>

          <div className="grid gap-2">
            <label className="text-xs font-semibold uppercase tracking-[0.08em] text-white/60">
              {t('ascendaQuiz.library.difficultyFilter')}
            </label>
            <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
              <SelectTrigger className="rounded-2xl border border-white/20 bg-white/5 text-white">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                {DIFFICULTY_FILTERS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2 md:col-span-2">
            <label className="text-xs font-semibold uppercase tracking-[0.08em] text-white/60">
              {t('ascendaQuiz.library.tagsFilter')}
            </label>
            <div className="flex flex-wrap gap-2">
              {allTags.map((tag) => {
                const active = selectedTags.includes(tag);
                return (
                  <Button
                    key={tag}
                    type="button"
                    variant="ghost"
                    onClick={() => toggleTag(tag)}
                    className={`h-8 rounded-full border px-3 text-xs transition ${
                      active
                        ? 'border-violet-400 bg-violet-500/20 text-violet-100'
                        : 'border-white/15 bg-white/5 text-white/70 hover:bg-white/10'
                    }`}
                  >
                    #{tag}
                  </Button>
                );
              })}
              {!allTags.length && (
                <span className="text-xs text-white/50">{t('ascendaQuiz.library.noTags')}</span>
              )}
            </div>
          </div>

          <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/70">
            <Checkbox checked={showArchived} onCheckedChange={(value) => setShowArchived(Boolean(value))} />
            <span>{t('ascendaQuiz.library.showArchived')}</span>
          </label>
        </div>
      </div>

      <LibraryGrid
        templates={filteredTemplates}
        focusId={focus}
        onEdit={(template) => setEditingTemplate(template)}
        onAssign={(template) => setAssigningTemplate(template)}
        onDuplicate={handleDuplicate}
        onArchive={handleArchive}
        emptyMessage={t('ascendaQuiz.library.empty')}
      />

      <TemplateEditor
        open={Boolean(editingTemplate)}
        template={editingTemplate}
        onClose={() => setEditingTemplate(null)}
        onSubmit={handleEditSubmit}
      />

      <AssignFromTemplateModal
        open={Boolean(assigningTemplate)}
        template={assigningTemplate}
        onClose={() => setAssigningTemplate(null)}
        onAssign={handleAssign}
      />
    </motion.section>
  );
}

