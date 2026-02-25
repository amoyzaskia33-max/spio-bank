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
      }, index * 250);
    });
  }, []);

  return (
    <div className="fixed inset-0 bg-[#0a0a0a] flex items-center justify-center font-mono text-sm">
      {/* Subtle background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent" />
      
      <div className="w-full max-w-md px-8 relative z-10">
        {/* SPIO Logo - Premium Style */}
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 mb-5"
            whileHover={{ scale: 1.05 }}
          >
            <span className="text-xl font-semibold text-white/80">S</span>
          </motion.div>
          <h1 className="text-xl font-medium text-white/70 tracking-tight">SPIO OS</h1>
          <p className="text-white/30 text-[12px] mt-1.5">Auto-Vault System</p>
        </motion.div>

        {/* Boot Logs - Minimal Style */}
        <div className="space-y-2.5">
          {visibleLogs.map((log, index) => (
            <motion.div
              key={index}
              className="flex items-center gap-2.5 text-white/40"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2 }}
            >
              <span className="text-white/30 text-[10px]">✓</span>
              <span className="text-white/40 text-[12px]">{log}</span>
            </motion.div>
          ))}
        </div>

        {/* Loading Bar - Premium Minimal */}
        <motion.div
          className="mt-10 h-0.5 bg-white/5 rounded-full overflow-hidden border border-white/5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="h-full bg-gradient-to-r from-white/20 to-white/10"
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: 1.2, ease: 'easeInOut' }}
          />
        </motion.div>
      </div>
    </div>
  );
};

export default BootScreen;
