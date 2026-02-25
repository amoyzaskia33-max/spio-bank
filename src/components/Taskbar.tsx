'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Folder, Terminal, LayoutTemplate } from 'lucide-react';
import useOSStore, { APP_IDS, getAppDefinition } from '@/store/useOSStore';
import SpioExplorer from './apps/SpioExplorer';
import CodeTerminal from './apps/CodeTerminal';
import UICanvas from './apps/UICanvas';

const Taskbar: React.FC = () => {
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
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      {/* macOS-style Floating Dock */}
      <div className="glass-heavy rounded-dock px-3 py-2 shadow-dock">
        <div className="flex items-center gap-2">
          {apps.map((app) => {
            const isOpen = windows[app.id]?.isOpen;
            const isActive = windows[app.id] && !windows[app.id].isMinimized;

            return (
              <motion.button
                key={app.id}
                onClick={() => handleAppClick(app.id, app.component)}
                className={`relative flex flex-col items-center justify-center w-14 h-14 rounded-2xl transition-all duration-200 ${
                  isActive
                    ? 'bg-white/10 shadow-lg'
                    : 'hover:bg-white/5'
                }`}
                whileHover={{ scale: 1.1, y: -4 }}
                whileTap={{ scale: 0.95 }}
                title={app.label}
              >
                <app.icon
                  className={`w-7 h-7 ${
                    isActive ? 'text-spio-accent' : 'text-spio-text-subtle'
                  }`}
                  strokeWidth={1.5}
                />
                
                {/* Active indicator dot */}
                {isOpen && (
                  <motion.div
                    className="absolute -bottom-1 w-1 h-1 rounded-full bg-spio-accent"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                  />
                )}
              </motion.button>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};

export default Taskbar;
