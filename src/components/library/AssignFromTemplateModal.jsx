import { Button } from '../common/ui/Button';
import { useTranslation } from 'react-i18next';

const AssignFromTemplateModal = ({ template, onConfirm, onCancel }) => {
  const { t } = useTranslation();
  if (!template) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-6">
      <div className="w-full max-w-lg rounded-3xl border border-white/10 bg-dark/95 p-6 shadow-soft">
        <h3 className="text-lg font-semibold text-white">{template.title}</h3>
        <p className="mt-2 text-sm text-slate-300">{template.description}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {template.tags?.map((tag) => (
            <span key={tag} className="rounded-full bg-primary-600/20 px-3 py-1 text-xs text-primary-200">
              #{tag}
            </span>
          ))}
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <Button variant="ghost" onClick={onCancel}>
            {t('app.cancel')}
          </Button>
          <Button onClick={onConfirm}>{t('app.confirm')}</Button>
        </div>
      </div>
    </div>
  );
};

export default AssignFromTemplateModal;
