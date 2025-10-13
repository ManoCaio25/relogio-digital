import { useTranslation } from 'react-i18next';
import { Button } from '../common/ui/Button';

const TemplateCard = ({ template, onEdit, onDuplicate, onArchive }) => {
  const { t } = useTranslation();
  return (
    <div className="flex h-full flex-col justify-between rounded-3xl border border-white/10 bg-white/5 p-5 shadow-soft">
      <div className="space-y-2">
        <p className="text-xs text-primary-200">
          {t('app.version')} {template.version}
        </p>
        <h3 className="text-lg font-semibold text-white">{template.title}</h3>
        <p className="text-sm text-slate-300">{template.description}</p>
        <div className="flex flex-wrap gap-2 pt-2">
          {template.tags?.map((tag) => (
            <span key={tag} className="rounded-full bg-primary-600/20 px-3 py-1 text-xs text-primary-200">
              #{tag}
            </span>
          ))}
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <Button variant="ghost" onClick={() => onEdit(template)}>
          {t('app.edit')}
        </Button>
        <Button variant="ghost" onClick={() => onDuplicate(template.id)}>
          {t('app.duplicate')}
        </Button>
        <Button variant="ghost" onClick={() => onArchive(template.id, !template.archived)}>
          {template.archived ? t('app.archived') : t('app.archive')}
        </Button>
      </div>
    </div>
  );
};

export default TemplateCard;
