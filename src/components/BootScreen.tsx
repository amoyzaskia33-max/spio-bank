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
    <div className="fixed inset-0 bg-slate-50 flex items-center justify-center font-mono text-sm">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/30 to-teal-50/30" />
      
      <div className="w-full max-w-md px-8 relative z-10">
        {/* SPIO Logo - Light Premium Style */}
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-100 to-white border border-slate-200 mb-5 shadow-sm"
            whileHover={{ scale: 1.05 }}
          >
            <span className="text-xl font-semibold text-indigo-600">S</span>
          </motion.div>
          <h1 className="text-xl font-medium text-slate-700 tracking-tight">SPIO OS</h1>
          <p className="text-slate-400 text-[12px] mt-1.5">Auto-Vault System</p>
        </motion.div>

        {/* Boot Logs - Light Minimal Style */}
        <div className="space-y-2.5 bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-slate-200/60 shadow-sm">
          {visibleLogs.map((log, index) => (
            <motion.div
              key={index}
              className="flex items-center gap-2.5 text-slate-500"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2 }}
            >
              <span className="text-emerald-500 text-[10px]">✓</span>
              <span className="text-slate-500 text-[12px]">{log}</span>
            </motion.div>
          ))}
        </div>

        {/* Loading Bar - Light Minimal */}
        <motion.div
          className="mt-10 h-0.5 bg-slate-200 rounded-full overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="h-full bg-gradient-to-r from-indigo-400 to-teal-400"
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
