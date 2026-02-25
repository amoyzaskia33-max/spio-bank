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
    <div className="fixed inset-0 bg-black flex items-start justify-start p-8 font-mono text-sm">
      <div className="flex flex-col gap-2">
        {visibleLogs.map((log, index) => (
          <motion.div
            key={index}
            className="text-green-400"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2 }}
          >
            {log}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default BootScreen;
