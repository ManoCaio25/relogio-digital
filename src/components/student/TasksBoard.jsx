import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../../state/useAuthStore';
import { tasksService } from '../../services/tasks.service.mock';
import { useTasksStore } from '../../state/useTasksStore';

const Column = ({ title, tasks, onMove, translateStatus }) => (
  <div className="flex-1 space-y-4 rounded-3xl border border-white/10 bg-white/5 p-4">
    <h3 className="text-sm font-semibold text-white">{title}</h3>
    <div className="space-y-3">
      {tasks.map((task) => (
        <div key={task.id} className="rounded-2xl border border-white/10 bg-dark/60 p-4">
          <h4 className="text-sm font-semibold text-white">{task.title}</h4>
          <p className="mt-2 text-xs text-slate-300">{task.description}</p>
          <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-400">
            {['todo', 'doing', 'done'].map((status) => (
              <button
                key={status}
                onClick={() => onMove(task.id, status)}
                className={`rounded-full px-3 py-1 ${task.status === status ? 'bg-primary-600 text-white' : 'bg-white/10 text-slate-300'}`}
              >
                {translateStatus(status)}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);

const TasksBoard = () => {
  const { t } = useTranslation();
  const user = useAuthStore((state) => state.user);
  const tasks = useTasksStore((state) => state.tasksByUser[user.id] || []);
  const label = (status) => t(`tasks.${status === 'todo' ? 'todo' : status === 'doing' ? 'doing' : 'done'}`);

  const moveTask = (taskId, status) => {
    tasksService.moveTask(user.id, taskId, status);
  };

  return (
    <section className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-white">{t('tasks.title')}</h1>
      </header>
      <div className="grid gap-4 md:grid-cols-3">
        <Column title={t('tasks.todo')} tasks={tasks.filter((task) => task.status === 'todo')} onMove={moveTask} translateStatus={label} />
        <Column title={t('tasks.doing')} tasks={tasks.filter((task) => task.status === 'doing')} onMove={moveTask} translateStatus={label} />
        <Column title={t('tasks.done')} tasks={tasks.filter((task) => task.status === 'done')} onMove={moveTask} translateStatus={label} />
      </div>
    </section>
  );
};

export default TasksBoard;
