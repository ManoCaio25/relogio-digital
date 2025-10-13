import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import { vacationService } from '../../services/vacation.service.mock';
import { useAuthStore } from '../../state/useAuthStore';
import { Button } from '../common/ui/Button';

const schema = z.object({
  startDate: z.string().min(1),
  endDate: z.string().min(1),
  reason: z.string().min(5)
});

const VacationRequestForm = () => {
  const { t } = useTranslation();
  const user = useAuthStore((state) => state.user);
  const form = useForm({ resolver: zodResolver(schema) });

  const onSubmit = form.handleSubmit((values) => {
    vacationService.request(user.id, values);
    form.reset();
  });

  return (
    <section className="space-y-4">
      <h2 className="text-lg font-semibold text-white">{t('vacations.request')}</h2>
      <form onSubmit={onSubmit} className="grid gap-4 rounded-3xl border border-white/10 bg-white/5 p-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="text-sm text-slate-300">{t('vacations.start')}</label>
            <input type="date" className="w-full rounded-2xl border border-white/10 bg-dark/60 px-4 py-3 text-sm text-white" {...form.register('startDate')} />
          </div>
          <div>
            <label className="text-sm text-slate-300">{t('vacations.end')}</label>
            <input type="date" className="w-full rounded-2xl border border-white/10 bg-dark/60 px-4 py-3 text-sm text-white" {...form.register('endDate')} />
          </div>
        </div>
        <div>
          <label className="text-sm text-slate-300">{t('vacations.reason')}</label>
          <textarea rows={3} className="w-full rounded-2xl border border-white/10 bg-dark/60 px-4 py-3 text-sm text-white" {...form.register('reason')} />
        </div>
        <div className="flex justify-end">
          <Button type="submit">{t('vacations.submit')}</Button>
        </div>
      </form>
    </section>
  );
};

export default VacationRequestForm;
