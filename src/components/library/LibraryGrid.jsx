import { useTranslation } from 'react-i18next';
import TemplateCard from './TemplateCard';

const LibraryGrid = ({ templates, onEdit, onDuplicate, onArchive }) => {
  const { t } = useTranslation();
  if (!templates.length) {
    return (
      <p className="rounded-3xl border border-dashed border-white/10 bg-white/5 p-10 text-center text-slate-400">
        {t('library.empty')}
      </p>
    );
  }
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {templates.map((template) => (
        <TemplateCard
          key={template.id}
          template={template}
          onEdit={onEdit}
          onDuplicate={onDuplicate}
          onArchive={onArchive}
        />
      ))}
    </div>
  );
};

export default LibraryGrid;
