import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../state/useAuthStore';
import { Button } from './ui/Button';

const Topbar = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);

  const handleLogout = () => {
    navigate('/logout', { replace: true });
  };

  return (
    <header className="flex items-center justify-between border-b border-white/10 bg-dark/80 px-6 py-4 backdrop-blur-xl">
      <div>
        <p className="text-sm uppercase tracking-[0.3em] text-primary-200">{t('app.name')}</p>
        <h1 className="text-xl font-semibold text-white">{user?.name}</h1>
      </div>
      <Button onClick={handleLogout} variant="ghost">
        {t('app.logout')}
      </Button>
    </header>
  );
};

export default Topbar;
