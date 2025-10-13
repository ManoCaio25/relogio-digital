import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { assignService } from '../../services/assign.service.mock';
import { useLibraryStore } from '../../state/useLibraryStore';
import AssigneePicker from './AssigneePicker';
import QuizPreviewCard from './QuizPreviewCard';
import AssignToolbar from './AssignToolbar';
import AssignFromTemplateModal from '../library/AssignFromTemplateModal';
import { Button } from '../common/ui/Button';
import { toast } from 'sonner';

const AssignQuizzesPanel = () => {
  const { t } = useTranslation();
  const templates = useLibraryStore((state) => state.templates.filter((template) => !template.archived));
  const [selectedTemplateId, setSelectedTemplateId] = useState(templates[0]?.id || null);
  const [assignees, setAssignees] = useState([]);
  const [dueDate, setDueDate] = useState('');
  const [visibility, setVisibility] = useState('public');
  const [showModal, setShowModal] = useState(false);

  const selectedTemplate = useMemo(() => templates.find((template) => template.id === selectedTemplateId), [templates, selectedTemplateId]);

  useEffect(() => {
    if (!templates.length) {
      setSelectedTemplateId(null);
      return;
    }
    if (!templates.find((template) => template.id === selectedTemplateId)) {
      setSelectedTemplateId(templates[0].id);
    }
  }, [templates, selectedTemplateId]);

  const handleAssign = () => {
    if (!selectedTemplateId || !assignees.length) {
      toast.error(t('assign.missingSelection'));
      return;
    }
    setShowModal(true);
  };

  const confirmAssign = () => {
    assignService.assignFromTemplate(selectedTemplateId, {
      assignees,
      dueDate,
      visibility
    });
    toast.success(t('assign.success'));
    setShowModal(false);
    setAssignees([]);
  };

  return (
    <section className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-white">{t('assign.title')}</h1>
          <p className="text-sm text-slate-300">{t('assign.subtitle')}</p>
        </div>
        <Button onClick={handleAssign}>{t('app.assign')}</Button>
      </header>

      <AssignToolbar
        dueDate={dueDate}
        visibility={visibility}
        onDueDateChange={setDueDate}
        onVisibilityChange={setVisibility}
      />

      <AssigneePicker value={assignees} onChange={setAssignees} />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {templates.map((template) => (
          <QuizPreviewCard
            key={template.id}
            template={template}
            selected={template.id === selectedTemplateId}
            onSelect={() => setSelectedTemplateId(template.id)}
          />
        ))}
      </div>

      {showModal && selectedTemplate && (
        <AssignFromTemplateModal
          template={selectedTemplate}
          onConfirm={confirmAssign}
          onCancel={() => setShowModal(false)}
        />
      )}
    </section>
  );
};

export default AssignQuizzesPanel;
