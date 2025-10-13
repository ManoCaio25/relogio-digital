import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useUsersStore } from '../../state/useUsersStore';
import { useAuthStore } from '../../state/useAuthStore';
import { useForm } from 'react-hook-form';
import { Button } from '../common/ui/Button';
import { useForumStore } from '../../state/useForumStore';

const ForumThread = () => {
  const { threadId } = useParams();
  const { t } = useTranslation();
  const thread = useForumStore((state) => state.threads.find((item) => item.id === threadId));
  const addMessage = useForumStore((state) => state.addMessage);
  const getById = useUsersStore((state) => state.getById);
  const user = useAuthStore((state) => state.user);
  const form = useForm();

  const onSubmit = form.handleSubmit((values) => {
    if (!values.message) return;
    addMessage(threadId, {
      author: user.id,
      content: values.message
    });
    form.reset();
  });

  if (!thread) {
    return <p className="text-slate-300">{t('forum.empty')}</p>;
  }

  return (
    <section className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-white">{thread.title}</h1>
      </header>
      <div className="space-y-4">
        {thread.messages.map((message) => (
          <div key={message.id} className="rounded-3xl border border-white/10 bg-white/5 p-4">
            <p className="text-sm font-semibold text-white">{getById(message.author)?.name}</p>
            <p className="mt-1 text-sm text-slate-200">{message.content}</p>
            <p className="mt-1 text-xs text-slate-400">{new Date(message.createdAt).toLocaleString()}</p>
          </div>
        ))}
      </div>
      <form onSubmit={onSubmit} className="space-y-3 rounded-3xl border border-white/10 bg-white/5 p-4">
        <textarea
          rows={3}
          className="w-full rounded-2xl border border-white/10 bg-dark/60 px-4 py-3 text-sm text-white"
          placeholder={t('forum.newMessage')}
          {...form.register('message')}
        />
        <div className="flex justify-end">
          <Button type="submit">{t('forum.reply')}</Button>
        </div>
      </form>
    </section>
  );
};

export default ForumThread;
