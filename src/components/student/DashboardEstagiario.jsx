import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../../state/useAuthStore';
import { useQuizzesStore } from '../../state/useQuizzesStore';
import { useTasksStore } from '../../state/useTasksStore';
import { useVideosStore } from '../../state/useVideosStore';

const StatCard = ({ title, value }) => (
  <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-soft">
    <p className="text-sm text-slate-300">{title}</p>
    <p className="mt-3 text-3xl font-semibold text-white">{value}</p>
  </div>
);

const DashboardEstagiario = () => {
  const { t } = useTranslation();
  const user = useAuthStore((state) => state.user);
  const inbox = useQuizzesStore((state) => state.inboxByUser[user.id] || []);
  const tasks = useTasksStore((state) => state.tasksByUser[user.id] || []);
  const videos = useVideosStore((state) => state.videos);
  const progressByUser = useVideosStore((state) => state.progressByUser[user.id] || {});

  const score = useMemo(() => {
    const totalQuizzes = inbox.length;
    const quizzesDone = inbox.filter((quiz) => quiz.status === 'done').length;
    const totalTasks = tasks.length;
    const tasksDone = tasks.filter((task) => task.status === 'done').length;
    const avgVideoProgress =
      videos.reduce((acc, video) => acc + (progressByUser[video.id] || 0) / video.duration, 0) / (videos.length || 1);
    const value =
      0.4 * (totalQuizzes ? quizzesDone / totalQuizzes : 0) +
      0.3 * (totalTasks ? tasksDone / totalTasks : 0) +
      0.3 * avgVideoProgress;
    return Math.round(value * 100);
  }, [inbox, tasks, progressByUser]);

  return (
    <section className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-white">{t('dashboard.intern.title')}</h1>
        <p className="text-sm text-slate-300">{user.name}</p>
      </header>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard title={t('dashboard.intern.pendingTasks')} value={tasks.filter((task) => task.status !== 'done').length} />
        <StatCard title={t('dashboard.intern.pendingQuizzes')} value={inbox.filter((quiz) => quiz.status !== 'done').length} />
        <StatCard title={t('dashboard.intern.videosInProgress')} value={Object.keys(progressByUser).length} />
        <StatCard title={t('dashboard.intern.overallScore')} value={`${score}%`} />
      </div>
    </section>
  );
};

export default DashboardEstagiario;
