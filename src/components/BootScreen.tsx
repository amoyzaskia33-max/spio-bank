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
    <div className="fixed inset-0 bg-[#F8F9FA] flex items-center justify-center font-mono text-sm">
      {/* Mesh Gradient Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute -top-1/3 -left-1/4 w-[800px] h-[800px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(96, 165, 250, 0.15) 0%, transparent 70%)',
            filter: 'blur(120px)',
          }}
        />
        <div
          className="absolute -bottom-1/3 -right-1/4 w-[800px] h-[800px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(168, 85, 247, 0.12) 0%, transparent 70%)',
            filter: 'blur(120px)',
          }}
        />
      </div>
      
      <div className="w-full max-w-md px-8 relative z-10">
        {/* Logo - Crown Glass Card */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-white/50 backdrop-blur-3xl border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04),0_1px_3px_rgb(0,0,0,0.02)] mb-5"
            whileHover={{ scale: 1.02 }}
          >
            <span className="text-2xl font-semibold text-slate-800 tracking-tight">S</span>
          </motion.div>
          <h1 className="text-2xl font-semibold text-slate-800 tracking-tight">SPIO OS</h1>
          <p className="text-slate-500 text-[13px] font-medium mt-2">Auto-Vault System</p>
        </motion.div>

        {/* Boot Logs - Crown Glass Card */}
        <motion.div
          className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 border border-slate-100 shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <div className="space-y-3">
            {visibleLogs.map((log, index) => (
              <motion.div
                key={index}
                className="flex items-center gap-3"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2 }}
              >
                <span className="text-emerald-500 text-[11px] font-semibold">✓</span>
                <span className="text-slate-600 text-[13px] font-mono font-medium">{log}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Loading Bar */}
        <motion.div
          className="mt-10 h-1.5 bg-white/60 rounded-full overflow-hidden backdrop-blur-xl border border-white/50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <motion.div
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
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
