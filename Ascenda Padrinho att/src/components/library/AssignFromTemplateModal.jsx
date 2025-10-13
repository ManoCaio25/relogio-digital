import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '@/i18n';
import { useUsersStore } from '@/pages/AscendaIA/stores/useUsersStore';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';

const VISIBILITY_OPTIONS = [
  { value: 'Private', translationKey: 'common.private' },
  { value: 'Team', translationKey: 'common.team' },
];

export function AssignFromTemplateModal({ template, open, onClose, onAssign }) {
  const { t } = useTranslation();
  const { users } = useUsersStore();
  const interns = React.useMemo(
    () => users.filter((user) => user.role === 'intern'),
    [users],
  );

  const [assignees, setAssignees] = React.useState([]);
  const [dueDate, setDueDate] = React.useState('');
  const [visibility, setVisibility] = React.useState('Private');

  React.useEffect(() => {
    if (open) {
      setAssignees([]);
      setDueDate('');
      setVisibility('Private');
    }
  }, [open, template?.id]);

  const toggleAssignee = React.useCallback((login) => {
    setAssignees((prev) =>
      prev.includes(login)
        ? prev.filter((item) => item !== login)
        : [...prev, login],
    );
  }, []);

  const handleSubmit = React.useCallback(() => {
    if (!template) return;
    onAssign?.({
      assignees,
      dueDate: dueDate || null,
      visibility,
    });
  }, [assignees, dueDate, onAssign, template, visibility]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[9998] flex items-center justify-center bg-black/50 px-4 py-10 backdrop-blur"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -10 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            className="flex w-full max-w-2xl flex-col gap-6 rounded-3xl border border-white/10 bg-surface/95 p-6 shadow-e3"
          >
            <header className="space-y-2">
              <h2 className="text-2xl font-semibold text-white">
                {t('common.assign_from_template')}
              </h2>
              <p className="text-sm text-white/70">{template?.title}</p>
            </header>

            <section className="space-y-3">
              <h3 className="text-sm font-semibold uppercase tracking-[0.08em] text-white/60">
                {t('common.actions.assignTo')}
              </h3>
              <div className="grid gap-2 max-h-48 overflow-y-auto pr-2">
                {interns.map((intern) => (
                  <label
                    key={intern.login}
                    className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/80"
                  >
                    <div className="flex flex-col">
                      <span className="font-medium">{intern.name}</span>
                      <span className="text-xs text-white/60">{intern.login}</span>
                    </div>
                    <Checkbox
                      checked={assignees.includes(intern.login)}
                      onCheckedChange={() => toggleAssignee(intern.login)}
                      aria-label={t('common.actions.assignTo')}
                    />
                  </label>
                ))}
                {!interns.length && (
                  <p className="text-sm text-white/60">{t('ascendaQuiz.library.noInterns')}</p>
                )}
              </div>
            </section>

            <section className="grid gap-3">
              <div className="grid gap-2">
                <label className="text-sm font-medium text-white/80">{t('common.due_date')}</label>
                <Input type="date" value={dueDate} onChange={(event) => setDueDate(event.target.value)} />
              </div>

              <div className="grid gap-2">
                <label className="text-sm font-medium text-white/80">{t('common.visibility')}</label>
                <Select value={visibility} onValueChange={setVisibility}>
                  <SelectTrigger className="rounded-2xl border border-white/20 bg-white/5 text-white">
                    <SelectValue placeholder={t('common.private')} />
                  </SelectTrigger>
                  <SelectContent>
                    {VISIBILITY_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {t(option.translationKey)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </section>

            <footer className="flex justify-end gap-3">
              <Button
                type="button"
                variant="ghost"
                onClick={onClose}
                className="h-10 rounded-2xl border border-white/10 text-sm text-white hover:bg-white/10"
              >
                {t('common.actions.cancel')}
              </Button>
              <Button
                type="button"
                onClick={handleSubmit}
                disabled={!assignees.length}
                className="h-10 rounded-2xl bg-violet-500/80 px-6 text-sm font-semibold text-white hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {t('common.assign')}
              </Button>
            </footer>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default AssignFromTemplateModal;

