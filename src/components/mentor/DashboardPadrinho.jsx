import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../../state/useAuthStore';
import VacationApprovalPanel from './VacationApprovalPanel';
import { useQuizzesStore } from '../../state/useQuizzesStore';

const DashboardPadrinho = () => {
  const { t } = useTranslation();
  const user = useAuthStore((state) => state.user);
  const assignments = useQuizzesStore((state) => state.assignments);

  return (
    <section className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-white">{t('dashboard.mentor.title')}</h1>
        <p className="text-sm text-slate-300">{user.name}</p>
      </header>
      <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-soft">
        <h2 className="text-lg font-semibold text-white">{t('dashboard.mentor.openAssignments')}</h2>
        <p className="mt-1 text-3xl font-bold text-primary-200">{assignments.length}</p>
      </div>
      <div>
        <h2 className="mb-4 text-lg font-semibold text-white">{t('vacations.mentorPanel')}</h2>
        <VacationApprovalPanel />
      </div>
    </section>
  );
};

export default DashboardPadrinho;
