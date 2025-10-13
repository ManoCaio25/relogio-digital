import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../state/useAuthStore';
import { Button } from '../components/common/ui/Button';

const Login = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const [error, setError] = useState(null);
  const form = useForm();

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      setError(null);
      await login(values.email, values.password);
      navigate('/', { replace: true });
    } catch (err) {
      setError(t('login.error'));
    }
  });

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-purple-900 via-indigo-950 to-black">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(124,58,237,0.35),_transparent_55%)]" />
      <div className="relative z-10 grid w-full max-w-5xl grid-cols-1 overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/5 shadow-[0_40px_120px_-20px_rgba(124,58,237,0.45)] lg:grid-cols-2">
        <div className="hidden bg-gradient-to-br from-primary-600 via-purple-600 to-fuchsia-500 p-10 text-white lg:flex lg:flex-col lg:justify-between">
          <div>
            <h2 className="text-3xl font-bold">Ascenda</h2>
            <p className="mt-4 max-w-xs text-sm text-white/80">{t('login.subtitle')}</p>
          </div>
          <div className="rounded-3xl bg-white/10 p-6 backdrop-blur">
            <p className="text-sm text-white/80">{t('loading.postLogin')}</p>
          </div>
        </div>
        <div className="flex flex-col justify-center p-10">
          <h1 className="text-3xl font-semibold text-white">{t('login.title')}</h1>
          <form onSubmit={onSubmit} className="mt-8 space-y-5">
            <div>
              <label className="text-sm text-slate-300">{t('login.email')}</label>
              <input
                type="email"
                className="mt-2 w-full rounded-2xl border border-white/10 bg-dark/60 px-4 py-3 text-sm text-white"
                {...form.register('email')}
              />
            </div>
            <div>
              <label className="text-sm text-slate-300">{t('login.password')}</label>
              <input
                type="password"
                className="mt-2 w-full rounded-2xl border border-white/10 bg-dark/60 px-4 py-3 text-sm text-white"
                {...form.register('password')}
              />
            </div>
            {error && <p className="text-sm text-rose-300">{error}</p>}
            <Button type="submit" className="w-full justify-center">
              {t('login.submit')}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
