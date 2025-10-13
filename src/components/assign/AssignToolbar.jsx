import { useTranslation } from 'react-i18next';

const AssignToolbar = ({ dueDate, visibility, onDueDateChange, onVisibilityChange }) => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-wrap items-center gap-4 rounded-3xl border border-white/10 bg-white/5 p-4">
      <div className="flex flex-col">
        <label className="text-xs uppercase tracking-widest text-primary-200">{t('app.dueDate')}</label>
        <input
          type="date"
          value={dueDate}
          onChange={(event) => onDueDateChange(event.target.value)}
          className="rounded-2xl border border-white/10 bg-dark/60 px-4 py-2 text-sm text-white"
        />
      </div>
      <div className="flex flex-col">
        <label className="text-xs uppercase tracking-widest text-primary-200">{t('app.visibility')}</label>
        <select
          value={visibility}
          onChange={(event) => onVisibilityChange(event.target.value)}
          className="rounded-2xl border border-white/10 bg-dark/60 px-4 py-2 text-sm text-white"
        >
          <option value="public">{t('app.public')}</option>
          <option value="private">{t('app.private')}</option>
        </select>
      </div>
    </div>
  );
};

export default AssignToolbar;
