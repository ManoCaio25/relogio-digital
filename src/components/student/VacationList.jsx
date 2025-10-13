import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../../state/useAuthStore';
import { useVacationsStore } from '../../state/useVacationsStore';

const statusColors = {
  pending: 'text-amber-300',
  approved: 'text-emerald-300',
  rejected: 'text-rose-300'
};

const VacationList = () => {
  const { t } = useTranslation();
  const user = useAuthStore((state) => state.user);
  const requests = useVacationsStore((state) => state.requests.filter((request) => request.userId === user.id));

  return (
    <section className="space-y-4">
      <h2 className="text-lg font-semibold text-white">{t('vacations.title')}</h2>
      <div className="space-y-3">
        {requests.map((request) => (
          <div key={request.id} className="rounded-3xl border border-white/10 bg-white/5 p-5">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-xs text-slate-300">
                  {t('vacations.start')}: {request.startDate} · {t('vacations.end')}: {request.endDate}
                </p>
                <p className="mt-1 text-sm text-slate-100">{request.reason}</p>
              </div>
              <span className={`${statusColors[request.status]} text-sm font-semibold uppercase`}>
                {t(`vacations.${request.status}`)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default VacationList;
