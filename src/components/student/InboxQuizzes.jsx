import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { quizService } from '../../services/quiz.service.mock';
import { useAuthStore } from '../../state/useAuthStore';
import { useQuizzesStore } from '../../state/useQuizzesStore';
import { Button } from '../common/ui/Button';

const InboxQuizzes = () => {
  const { t } = useTranslation();
  const user = useAuthStore((state) => state.user);
  const [tagFilter, setTagFilter] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('');
  const inbox = useQuizzesStore((state) => state.inboxByUser[user.id] || []);

  const filtered = useMemo(() => {
    return inbox.filter((quiz) => {
      if (tagFilter && !quiz.tags.some((tag) => tag.toLowerCase().includes(tagFilter.toLowerCase()))) {
        return false;
      }
      if (difficultyFilter && quiz.difficulty !== difficultyFilter) {
        return false;
      }
      return true;
    });
  }, [inbox, tagFilter, difficultyFilter]);

  return (
    <section className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-white">{t('quizzes.title')}</h1>
      </header>
      <div className="flex flex-wrap gap-4">
        <input
          value={tagFilter}
          onChange={(event) => setTagFilter(event.target.value)}
          placeholder={t('app.tags')}
          className="w-full max-w-xs rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white"
        />
        <input
          value={difficultyFilter}
          onChange={(event) => setDifficultyFilter(event.target.value)}
          placeholder={t('app.difficulty')}
          className="w-full max-w-xs rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white"
        />
      </div>
      <div className="space-y-4">
        {filtered.length === 0 && (
          <p className="rounded-3xl border border-dashed border-white/10 bg-white/5 p-10 text-center text-slate-400">
            {t('quizzes.empty')}
          </p>
        )}
        {filtered.map((quiz) => (
          <div key={quiz.id} className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-soft">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-xs text-primary-200">{quiz.difficulty}</p>
                <h3 className="text-lg font-semibold text-white">{quiz.title}</h3>
                <p className="text-xs text-slate-400">{t('quizzes.assignedBy')} Paulo</p>
              </div>
              {quiz.status !== 'done' ? (
                <Button onClick={() => quizService.markDone(user.id, quiz.id)}>{t('quizzes.markDone')}</Button>
              ) : (
                <span className="rounded-full bg-primary-600/20 px-4 py-2 text-sm text-primary-100">{t('app.done')}</span>
              )}
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {quiz.tags.map((tag) => (
                <span key={tag} className="rounded-full bg-primary-600/20 px-3 py-1 text-xs text-primary-200">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default InboxQuizzes;
