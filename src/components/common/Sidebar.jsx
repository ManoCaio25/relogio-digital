import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../../state/useAuthStore';

const LinkItem = ({ to, label }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `block rounded-2xl px-4 py-2 text-sm font-medium transition-all ${
        isActive ? 'bg-primary-600 text-white shadow-soft' : 'text-slate-300 hover:bg-white/5'
      }`
    }
  >
    {label}
  </NavLink>
);

const Sidebar = () => {
  const { t } = useTranslation();
  const user = useAuthStore((state) => state.user);
  if (!user) return null;

  const internLinks = [
    { to: '/estagiario', label: t('nav.dashboard') },
    { to: '/estagiario/quizzes', label: t('nav.quizzes') },
    { to: '/estagiario/atividades', label: t('nav.tasks') },
    { to: '/estagiario/videos', label: t('nav.videos') },
    { to: '/estagiario/ferias', label: t('nav.vacations') },
    { to: '/estagiario/forum', label: t('nav.forum') }
  ];

  const mentorLinks = [{ to: '/padrinho', label: t('nav.mentor') }];

  return (
    <aside className="hidden w-64 flex-shrink-0 border-r border-white/10 bg-dark/70 p-6 backdrop-blur-xl lg:block">
      <div className="space-y-3">
        {(user.role === 'intern' ? internLinks : mentorLinks).map((item) => (
          <LinkItem key={item.to} {...item} />
        ))}
      </div>
      <div className="mt-10 space-y-3">
        <p className="text-xs uppercase tracking-widest text-primary-200">{t('nav.ascendaIA')}</p>
        <LinkItem to="/ascenda-ia/generator" label={t('nav.generator')} />
        <LinkItem to="/ascenda-ia/library" label={t('nav.library')} />
        <LinkItem to="/ascenda-ia/assign" label={t('nav.assign')} />
      </div>
    </aside>
  );
};

export default Sidebar;
