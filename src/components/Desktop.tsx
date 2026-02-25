'use client';

import React, { useEffect, useState, useCallback, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';
import useOSStore, { APP_IDS, getAppDefinition } from '@/store/useOSStore';
import Window from './Window';
import Taskbar from './Taskbar';
import BootScreen from './BootScreen';
import SpioExplorer from './apps/SpioExplorer';

// Lazy load heavy components with SSR disabled
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
    <div className="relative w-screen h-screen overflow-hidden">
      {/* Soft Light Pastel Background */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(135deg, #F8FAFC 0%, #F1F5F9 50%, #E8F0F6 100%)',
        }}
      />

      {/* Decorative Pastel Blur Shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Indigo shape - top left */}
        <div
          className="absolute -top-1/2 -left-1/4 w-full h-full pastel-shape-1 opacity-60"
          style={{
            background: 'radial-gradient(circle, rgba(99, 102, 241, 0.08) 0%, transparent 70%)',
            filter: 'blur(100px)',
          }}
        />
        
        {/* Teal shape - bottom right */}
        <div
          className="absolute -bottom-1/2 -right-1/4 w-full h-full pastel-shape-2 opacity-60"
          style={{
            background: 'radial-gradient(circle, rgba(16, 185, 129, 0.08) 0%, transparent 70%)',
            filter: 'blur(100px)',
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
