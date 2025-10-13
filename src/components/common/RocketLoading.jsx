import { motion } from 'framer-motion';
import { Rocket } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const variants = {
  postLogin: {
    gradient: 'from-primary-500 via-purple-500 to-fuchsia-500',
    messageKey: 'loading.postLogin'
  },
  preLogin: {
    gradient: 'from-fuchsia-500 via-primary-500 to-cyan-400',
    messageKey: 'loading.preLogin'
  }
};

const RocketLoading = ({ variant = 'postLogin' }) => {
  const { t } = useTranslation();
  const config = variants[variant];

  return (
    <div className="flex flex-col items-center gap-6">
      <motion.div
        className={`h-44 w-44 rounded-full bg-gradient-to-r ${config.gradient} p-6 shadow-soft`}
        animate={{
          y: [0, -20, 0],
          rotate: [0, 5, -5, 0]
        }}
        transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
      >
        <Rocket className="h-full w-full text-white" />
      </motion.div>
      <motion.p className="text-lg font-semibold text-slate-200" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        {t(config.messageKey)}
      </motion.p>
    </div>
  );
};

export default RocketLoading;
