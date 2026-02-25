'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const bootLogs = [
  '[OK] Booting SPIO Core...',
  '[OK] Loading Boilerplate Vault...',
  '[OK] Initializing Window Manager...',
  '[OK] Mounting Desktop Environment...',
];

const BootScreen: React.FC = () => {
  const [visibleLogs, setVisibleLogs] = useState<string[]>([]);

  useEffect(() => {
    bootLogs.forEach((log, index) => {
      setTimeout(() => {
        setVisibleLogs((prev) => [...prev, log]);
      }, index * 300);
    });
  }, []);

  return (
    <div className="fixed inset-0 bg-spio-base flex items-center justify-center font-mono text-sm">
      <div className="w-full max-w-md px-8">
        {/* SPIO Logo */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-spio-accent to-spio-purple mb-4 shadow-lg">
            <span className="text-2xl font-bold text-white">S</span>
          </div>
          <h1 className="text-2xl font-semibold text-spio-text mb-2">SPIO OS</h1>
          <p className="text-spio-text-subtle text-sm">Auto-Vault System</p>
        </motion.div>

        {/* Boot Logs */}
        <div className="space-y-2">
          {visibleLogs.map((log, index) => (
            <motion.div
              key={index}
              className="flex items-center gap-3 text-spio-text-subtle"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2 }}
            >
              <span className="text-spio-mint text-xs">✓</span>
              <span className="text-spio-text/80">{log}</span>
            </motion.div>
          ))}
        </div>

        {/* Loading Bar */}
        <motion.div
          className="mt-8 h-1 bg-spio-overlay rounded-full overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="h-full bg-gradient-to-r from-spio-accent to-spio-mint"
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: 1.5, ease: 'easeInOut' }}
          />
        </motion.div>
      </div>
    </div>
  );
};

export default BootScreen;
