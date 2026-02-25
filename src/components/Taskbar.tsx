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
      className="absolute bottom-0 left-0 right-0 h-[60px] bg-black/80 backdrop-blur-xl border-t border-white/10 flex items-center justify-center px-4"
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      <div className="flex items-center gap-2">
        {apps.map((app) => {
          const isOpen = windows[app.id]?.isOpen;
          const isActive = windows[app.id] && !windows[app.id].isMinimized;

          return (
            <motion.button
              key={app.id}
              onClick={() => handleAppClick(app.id, app.component)}
              className={`relative flex flex-col items-center justify-center w-14 h-14 rounded-xl transition-all duration-200 ${
                isActive
                  ? 'bg-white/10'
                  : 'hover:bg-white/5'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title={app.label}
            >
              <app.icon
                className={`w-6 h-6 ${
                  isActive ? 'text-white' : 'text-white/60'
                }`}
              />
              
              {/* Indicator dot for open apps */}
              {isOpen && (
                <motion.div
                  className="absolute bottom-1 w-1 h-1 rounded-full bg-white/60"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                />
              )}
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
};

export default Taskbar;
