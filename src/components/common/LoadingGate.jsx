import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const LoadingGate = ({ durationMs = 2000, overlay = false, children }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), durationMs);
    return () => clearTimeout(timer);
  }, [durationMs]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className={`${overlay ? 'fixed inset-0 z-50 flex items-center justify-center bg-dark/95 backdrop-blur-xl' : ''}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoadingGate;
