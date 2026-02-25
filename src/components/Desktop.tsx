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
    <div className="flex items-center justify-center h-full text-white/40">
      <div className="text-center">
        <div className="w-6 h-6 border-2 border-white/20 border-t-white/80 rounded-full animate-spin mx-auto mb-3" />
        <p className="text-sm">Loading Code Terminal...</p>
      </div>
    </div>
  )
});

const UICanvas = dynamic(() => import('./apps/UICanvas'), { 
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full text-white/40">
      <div className="text-center">
        <div className="w-6 h-6 border-2 border-white/20 border-t-white/80 rounded-full animate-spin mx-auto mb-3" />
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
        return <div className="p-4 text-white/50">Unknown App</div>;
    }
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      {/* Premium Dark Gradient Background */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(135deg, #0a0a0a 0%, #121212 50%, #0f0f0f 100%)',
        }}
      />

      {/* Subtle radial glow */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(circle at 50% 0%, rgba(100, 100, 120, 0.08) 0%, transparent 60%)',
        }}
      />

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
