---
title: Alert Banner
description: A dismissible alert banner with variant support
category: Frontend
---
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertCircle, CheckCircle, Info } from 'lucide-react';

interface AlertBannerProps {
  variant?: 'info' | 'success' | 'warning' | 'error';
  message: string;
  dismissible?: boolean;
}

export function AlertBanner({
  variant = 'info',
  message,
  dismissible = true,
}: AlertBannerProps) {
  const [isVisible, setIsVisible] = useState(true);

  const variants = {
    info: 'bg-blue-500/20 border-blue-500/50 text-blue-400',
    success: 'bg-green-500/20 border-green-500/50 text-green-400',
    warning: 'bg-yellow-500/20 border-yellow-500/50 text-yellow-400',
    error: 'bg-red-500/20 border-red-500/50 text-red-400',
  };

  const icons = {
    info: <Info className="w-5 h-5" />,
    success: <CheckCircle className="w-5 h-5" />,
    warning: <AlertCircle className="w-5 h-5" />,
    error: <AlertCircle className="w-5 h-5" />,
  };

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`flex items-center gap-3 p-4 rounded-lg border ${variants[variant]}`}
    >
      {icons[variant]}
      <p className="flex-1">{message}</p>
      {dismissible && (
        <button
          onClick={() => setIsVisible(false)}
          className="p-1 hover:bg-white/10 rounded transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </motion.div>
  );
}
