import { useEffect } from 'react';
import { Toaster, toast } from 'sonner';
import { useNotificationsStore } from '../../state/useNotificationsStore';
import { useAuthStore } from '../../state/useAuthStore';
import { useTranslation } from 'react-i18next';

const Toasts = () => {
  const { t } = useTranslation();
  const user = useAuthStore((state) => state.user);
  const popNotification = useNotificationsStore((state) => state.popNotification);

  useEffect(() => {
    if (!user) return;
    const interval = setInterval(() => {
      const notification = popNotification(user.id);
      if (notification) {
        toast(t(notification.message), {
          description: notification.title
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [popNotification, user, t]);

  return <Toaster position="top-right" richColors theme="dark" />;
};

export default Toasts;
