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
      }, index * 200);
    });
  }, []);

  return (
    <div className="fixed inset-0 bg-[#FAFAFA] flex items-center justify-center font-mono text-sm">
      {/* Subtle mesh gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-slate-100" />
      
      {/* Decorative blur */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-1/4 left-1/4 w-1/2 h-1/2 rounded-full opacity-40"
          style={{
            background: 'radial-gradient(circle, rgba(99, 102, 241, 0.08) 0%, transparent 70%)',
            filter: 'blur(100px)',
          }}
        />
      </div>
      
      <div className="w-full max-w-md px-8 relative z-10">
        {/* SPIO Logo - Premium Minimal */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white border border-slate-200/80 mb-5 shadow-sm"
            whileHover={{ scale: 1.02 }}
          >
            <span className="text-2xl font-semibold text-slate-800 tracking-tight">S</span>
          </motion.div>
          <h1 className="text-xl font-semibold text-slate-800 tracking-tight">SPIO OS</h1>
          <p className="text-slate-500 text-[12px] mt-1.5 font-medium">Auto-Vault System</p>
        </motion.div>

        {/* Boot Logs - Premium Card */}
        <motion.div
          className="bg-white/80 backdrop-blur-xl rounded-2xl p-5 border border-slate-200/80 shadow-soft-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <div className="space-y-2.5">
            {visibleLogs.map((log, index) => (
              <motion.div
                key={index}
                className="flex items-center gap-2.5 text-slate-600"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2 }}
              >
                <span className="text-emerald-500 text-[10px] font-medium">✓</span>
                <span className="text-slate-600 text-[12px] font-mono">{log}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Loading Bar - Premium */}
        <motion.div
          className="mt-10 h-1 bg-slate-200 rounded-full overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <motion.div
            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: 1.2, ease: 'easeInOut', delay: 0.3 }}
          />
        </motion.div>
      </div>
    </div>
  );
};

export default BootScreen;
