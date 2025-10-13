import { useUsersStore } from '../../state/useUsersStore';
import { useTranslation } from 'react-i18next';

const AssigneePicker = ({ value, onChange }) => {
  const interns = useUsersStore((state) => state.getInterns());
  const { t } = useTranslation();

  const toggle = (id) => {
    if (value.includes(id)) {
      onChange(value.filter((item) => item !== id));
    } else {
      onChange([...value, id]);
    }
  };

  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
      <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-primary-200">{t('app.assignees')}</p>
      <div className="flex flex-wrap gap-2">
        {interns.map((intern) => {
          const active = value.includes(intern.id);
          return (
            <button
              type="button"
              key={intern.id}
              onClick={() => toggle(intern.id)}
              className={`rounded-full px-4 py-2 text-sm transition ${
                active ? 'bg-primary-600 text-white shadow-soft' : 'bg-white/5 text-slate-300 hover:bg-white/10'
              }`}
            >
              {intern.name}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default AssigneePicker;
