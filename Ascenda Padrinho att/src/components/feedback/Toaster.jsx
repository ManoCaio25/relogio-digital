import React from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useTranslation } from '@/i18n';

const ToastContext = React.createContext({
  toasts: [],
  pushToast: () => {},
  dismissToast: () => {},
});

const TOAST_DURATION = 4200;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = React.useState([]);

  const dismissToast = React.useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const pushToast = React.useCallback(
    ({ id, title, description, variant = 'default', duration = TOAST_DURATION }) => {
      const toastId = id ?? `toast_${Date.now()}_${Math.round(Math.random() * 1000)}`;
      setToasts((prev) => [...prev, { id: toastId, title, description, variant, duration }]);

      if (typeof window !== 'undefined' && duration !== Infinity) {
        window.setTimeout(() => {
          dismissToast(toastId);
        }, duration);
      }

      return toastId;
    },
    [dismissToast],
  );

  const contextValue = React.useMemo(
    () => ({ toasts, pushToast, dismissToast }),
    [toasts, pushToast, dismissToast],
  );

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      <ToastViewport toasts={toasts} onDismiss={dismissToast} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
}

function ToastViewport({ toasts, onDismiss }) {
  const { t } = useTranslation();
  const container = typeof document !== 'undefined' ? document.body : null;
  if (!container || !toasts.length) {
    return null;
  }

  const variants = {
    default: 'border-brand/30 text-white/90',
    success: 'border-emerald-400/40 text-emerald-100',
    error: 'border-rose-400/40 text-rose-100',
  };

  const getVariantClass = (variant) => variants[variant] ?? variants.default;

  return createPortal(
    <div className="pointer-events-none fixed inset-x-0 top-4 z-[9999] flex flex-col items-center gap-3 px-4 sm:items-end sm:px-6">
      <AnimatePresence initial={false}>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            layout
            initial={{ opacity: 0, y: -12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.95 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className={`pointer-events-auto w-full max-w-sm rounded-2xl border bg-surface/90 p-4 shadow-e3 backdrop-blur ${getVariantClass(
              toast.variant,
            )}`}
          >
            <div className="flex items-start gap-3">
              <div className="flex-1 space-y-1">
                {toast.title && <p className="text-sm font-semibold">{toast.title}</p>}
                {toast.description && (
                  <p className="text-xs text-white/70">{toast.description}</p>
                )}
              </div>
              <button
                type="button"
                onClick={() => onDismiss(toast.id)}
                className="rounded-full p-1 text-white/70 transition hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                aria-label={t('common.actions.close')}
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>,
    container,
  );
}
