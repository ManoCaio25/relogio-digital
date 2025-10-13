import { useTranslation } from 'react-i18next';

const QuizPreviewCard = ({ template, selected, onSelect }) => {
  const { t } = useTranslation();
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`w-full rounded-3xl border px-5 py-4 text-left transition ${
        selected ? 'border-primary-500 bg-primary-600/20 text-white shadow-soft' : 'border-white/10 bg-white/5 text-slate-200'
      }`}
    >
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold">{template.title}</h3>
          <p className="text-sm text-slate-300">{template.description}</p>
        </div>
        {selected && <span className="rounded-full bg-primary-500 px-3 py-1 text-xs">{t('assign.selected')}</span>}
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {template.tags?.map((tag) => (
          <span key={tag} className="rounded-full bg-primary-600/20 px-3 py-1 text-xs text-primary-200">
            #{tag}
          </span>
        ))}
      </div>
    </button>
  );
};

export default QuizPreviewCard;
