'use client';

import React, { memo } from 'react';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import { Folder, Terminal, LayoutTemplate } from 'lucide-react';
import useOSStore, { APP_IDS, getAppDefinition } from '@/store/useOSStore';

// Lazy load app components
const SpioExplorer = dynamic(() => import('./apps/SpioExplorer'), { ssr: false });
const CodeTerminal = dynamic(() => import('./apps/CodeTerminal'), { ssr: false });
const UICanvas = dynamic(() => import('./apps/UICanvas'), { ssr: false });

const Taskbar: React.FC = memo(() => {
  const { openWindow, windows } = useOSStore();

  const apps = [
    {
      id: APP_IDS.SPIO_EXPLORER,
      icon: Folder,
      label: 'SPIO Explorer',
      component: <SpioExplorer />
    },
    {
      id: APP_IDS.CODE_TERMINAL,
      icon: Terminal,
      label: 'Code Terminal',
      component: <CodeTerminal />
    },
    {
      id: APP_IDS.UI_CANVAS,
      icon: LayoutTemplate,
      label: 'UI Canvas',
      component: <UICanvas />
    },
  ];

  const handleAppClick = (appId: string, component: React.ReactNode) => {
    const appDef = getAppDefinition(appId);
    if (appDef) {
      openWindow(appId, appDef, component);
    }
  };

  return (
    <motion.div
      className="absolute bottom-4 left-0 right-0 flex items-center justify-center px-4"
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Floating Dock */}
      <div className="overflow-hidden bg-white/30 backdrop-blur-[40px] saturate-[1.2] border border-white/80 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] rounded-3xl px-3 py-3">
        <div className="flex items-center gap-2">
          {apps.map((app) => {
            const isOpen = windows[app.id]?.isOpen;
            const isActive = windows[app.id] && !windows[app.id].isMinimized;

            return (
              <motion.button
                key={app.id}
                onClick={() => handleAppClick(app.id, app.component)}
                className={`relative flex items-center justify-center w-14 h-14 rounded-2xl transition-all duration-200 ${
                  isActive
                    ? 'bg-white/50'
                    : 'hover:bg-white/40'
                }`}
                whileHover={{ scale: 1.06, y: -2 }}
                whileTap={{ scale: 0.96 }}
                title={app.label}
              >
                <app.icon
                  className={`w-6 h-6 ${
                    isActive ? 'text-slate-800' : 'text-slate-500'
                  }`}
                  strokeWidth={1.5}
                />

                {/* Active indicator */}
                {isOpen && (
                  <motion.div
                    className="absolute -bottom-1.5 w-1.5 h-1.5 rounded-full bg-slate-400"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                  />
                )}
              </motion.button>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
});

Taskbar.displayName = 'Taskbar';

export default Taskbar;
