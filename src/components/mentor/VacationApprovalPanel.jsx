import { useTranslation } from 'react-i18next';
import { vacationService } from '../../services/vacation.service.mock';
import { useVacationsStore } from '../../state/useVacationsStore';
import { useUsersStore } from '../../state/useUsersStore';
import { Button } from '../common/ui/Button';

const VacationApprovalPanel = () => {
  const { t } = useTranslation();
  const pending = useVacationsStore((state) => state.requests.filter((request) => request.status === 'pending'));
  const getById = useUsersStore((state) => state.getById);

  if (!pending.length) {
    return <p className="rounded-3xl border border-dashed border-white/10 bg-white/5 p-6 text-center text-slate-300">{t('vacations.empty')}</p>;
  }

  return (
    <div className="space-y-4">
      {pending.map((request) => (
        <div key={request.id} className="rounded-3xl border border-white/10 bg-white/5 p-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-white">{getById(request.userId)?.name}</p>
              <p className="text-xs text-slate-300">
                {t('vacations.start')}: {request.startDate} · {t('vacations.end')}: {request.endDate}
              </p>
              <p className="mt-1 text-sm text-slate-100">{request.reason}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" onClick={() => vacationService.updateStatus(request.id, 'rejected')}>
                {t('vacations.reject')}
              </Button>
              <Button onClick={() => vacationService.updateStatus(request.id, 'approved')}>
                {t('vacations.approve')}
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default VacationApprovalPanel;
