import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useUsersStore } from '../../state/useUsersStore';
import { useForumStore } from '../../state/useForumStore';

const ForumList = () => {
  const { t } = useTranslation();
  const threads = useForumStore((state) => state.threads);
  const getById = useUsersStore((state) => state.getById);

  return (
    <section className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-white">{t('forum.title')}</h1>
      </header>
      <div className="space-y-4">
        {threads.map((thread) => (
          <Link
            key={thread.id}
            to={`/estagiario/forum/${thread.id}`}
            className="block rounded-3xl border border-white/10 bg-white/5 p-5 transition hover:border-primary-500 hover:bg-primary-600/10"
          >
            <h3 className="text-lg font-semibold text-white">{thread.title}</h3>
            <p className="mt-1 text-xs text-slate-300">
              {t('forum.participants')}: {thread.participants.map((id) => getById(id)?.name).join(', ')}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default ForumList;
