import React from 'react';
import { Users, UserRound } from 'lucide-react';
import { useTranslation } from '@/i18n';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/utils';

export function AssigneePicker({
  interns,
  mentors,
  selectedAssignees,
  selectedGroup,
  onAssigneesChange,
  onGroupChange,
}) {
  const { t } = useTranslation();
  const internsCount = interns.length;
  const mentorsCount = mentors.length;

  const toggleAssignee = React.useCallback(
    (login) => {
      onAssigneesChange((prev) => {
        const current = new Set(prev);
        if (current.has(login)) {
          current.delete(login);
        } else {
          current.add(login);
        }
        return Array.from(current);
      });
    },
    [onAssigneesChange],
  );

  const handleGroupChange = React.useCallback(
    (event) => {
      onGroupChange(event.target.value || 'none');
    },
    [onGroupChange],
  );

  const groupOptions = React.useMemo(
    () => [
      {
        id: 'none',
        label: t('ascendaQuiz.assign.groups.none'),
        description: t('ascendaQuiz.assign.groups.noneHint'),
      },
      {
        id: 'allInterns',
        label: t('ascendaQuiz.assign.groups.allInterns'),
        description: t('ascendaQuiz.assign.groups.allInternsHint', { count: internsCount }),
      },
      {
        id: 'mentors',
        label: t('ascendaQuiz.assign.groups.padrinhos'),
        description: t('ascendaQuiz.assign.groups.padrinhosHint', { count: mentorsCount }),
      },
    ],
    [t, internsCount, mentorsCount],
  );

  return (
    <section className="rounded-2xl border border-border/60 bg-surface/80 p-6 shadow-e1 backdrop-blur-sm">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-white">{t('ascendaQuiz.assign.assignees.title')}</h3>
          <p className="text-xs text-white/60">{t('ascendaQuiz.assign.assignees.subtitle')}</p>
        </div>
        <Badge variant="outline" aria-label={t('ascendaQuiz.assign.assignees.selectedAria', { count: selectedAssignees.length })}>
          {t('ascendaQuiz.assign.assignees.selected', { count: selectedAssignees.length })}
        </Badge>
      </div>

      <div className="space-y-5">
        <div>
          <div className="mb-2 flex items-center gap-2 text-sm font-medium text-white">
            <Users className="h-4 w-4 text-primary" aria-hidden="true" />
            <span>{t('ascendaQuiz.assign.assignees.internsTitle')}</span>
          </div>
          <ul className="grid gap-2 sm:grid-cols-2">
            {interns.map((intern) => {
              const checked = selectedAssignees.includes(intern.login);
              return (
                <li
                  key={intern.login}
                  className={cn(
                    'flex items-center gap-3 rounded-xl border border-border/50 bg-background/40 px-3 py-3 transition hover:border-brand/60',
                    checked && 'border-brand/70 bg-brand/10',
                  )}
                >
                  <Checkbox
                    checked={checked}
                    onCheckedChange={() => toggleAssignee(intern.login)}
                    aria-label={t('ascendaQuiz.assign.assignees.checkboxAria', { name: intern.name })}
                  />
                  <div className="flex flex-1 flex-col">
                    <span className="text-sm font-medium text-white">{intern.name}</span>
                    <span className="text-xs text-white/50">{intern.email}</span>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        <div>
          <div className="mb-2 flex items-center gap-2 text-sm font-medium text-white">
            <UserRound className="h-4 w-4 text-primary" aria-hidden="true" />
            <span>{t('ascendaQuiz.assign.assignees.groupsTitle')}</span>
          </div>
          <div className="space-y-2">
            {groupOptions.map((option) => (
              <label
                key={option.id}
                className={cn(
                  'flex cursor-pointer items-start gap-3 rounded-xl border border-border/50 bg-background/40 px-3 py-3 transition hover:border-brand/60',
                  selectedGroup === option.id && 'border-brand/70 bg-brand/10',
                )}
              >
                <input
                  type="radio"
                  name="assign-group"
                  value={option.id}
                  checked={selectedGroup === option.id}
                  onChange={handleGroupChange}
                  className="mt-1 h-4 w-4 border border-border text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                />
                <div>
                  <p className="text-sm font-medium text-white">{option.label}</p>
                  <p className="text-xs text-white/50">{option.description}</p>
                </div>
              </label>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
