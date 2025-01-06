import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface AnimatedValueProps {
  value: number | string;
  direction: 'up' | 'down' | null;
  className?: string;
}

export const AnimatedValue: React.FC<AnimatedValueProps> = ({ value, direction, className }) => {
  return (
    <AnimatePresence>
      <motion.span
        key={value}
        initial={{ y: direction === 'up' ? 20 : -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: direction === 'up' ? -20 : 20, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className={className}
      >
        {value}
      </motion.span>
    </AnimatePresence>
  );
};

