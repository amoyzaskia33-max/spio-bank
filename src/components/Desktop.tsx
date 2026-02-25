'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';
import useOSStore, { APP_IDS, getAppDefinition } from '@/store/useOSStore';
import Window from './Window';
import Taskbar from './Taskbar';
import BootScreen from './BootScreen';
import SpioExplorer from './apps/SpioExplorer';

// Lazy load heavy components
const CodeTerminal = dynamic(() => import('./apps/CodeTerminal'), { 
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full text-slate-400">
      <div className="text-center">
        <div className="w-6 h-6 border-2 border-slate-200 border-t-slate-400 rounded-full animate-spin mx-auto mb-3" />
        <p className="text-sm">Loading Code Terminal...</p>
      </div>
    </div>
  )
});

const UICanvas = dynamic(() => import('./apps/UICanvas'), { 
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full text-slate-400">
      <div className="text-center">
        <div className="w-6 h-6 border-2 border-slate-200 border-t-slate-400 rounded-full animate-spin mx-auto mb-3" />
        <p className="text-sm">Loading UI Canvas...</p>
      </div>
    </div>
  )
});

const Desktop: React.FC = () => {
  const { windows, isBooted, setBootComplete } = useOSStore();
  const [showBoot, setShowBoot] = useState(true);

  useEffect(() => {
    const bootTimer = setTimeout(() => {
      setBootComplete();
      setShowBoot(false);
    }, 1500);

    return () => clearTimeout(bootTimer);
  }, [setBootComplete]);

  if (showBoot) {
    return <BootScreen />;
  }

  const renderAppContent = (appId: string) => {
    switch (appId) {
      case APP_IDS.SPIO_EXPLORER:
        return <SpioExplorer />;
      case APP_IDS.CODE_TERMINAL:
        return <CodeTerminal />;
      case APP_IDS.UI_CANVAS:
        return <UICanvas />;
      default:
        return <div className="p-4 text-slate-500">Unknown App</div>;
    }
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#F8F9FA]">
      {/* MESH GRADIENT BACKGROUNDS - Decorative Light Patches */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Blue light patch - top left */}
        <div
          className="absolute -top-1/3 -left-1/4 w-[800px] h-[800px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(96, 165, 250, 0.15) 0%, transparent 70%)',
            filter: 'blur(120px)',
          }}
        />
        
        {/* Purple light patch - bottom right */}
        <div
          className="absolute -bottom-1/3 -right-1/4 w-[800px] h-[800px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(168, 85, 247, 0.12) 0%, transparent 70%)',
            filter: 'blur(120px)',
          }}
        />
      </div>

      {/* Windows */}
      <AnimatePresence>
        {Object.values(windows).map((windowState) => (
          <Window key={windowState.id} windowState={windowState}>
            {windowState.content || renderAppContent(windowState.id)}
          </Window>
        ))}
      </AnimatePresence>

      {/* Taskbar */}
      <Taskbar />
    </div>
  );
};

export default Desktop;
