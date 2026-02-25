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
    <div className="relative h-screen w-screen bg-[#F8FAFC] overflow-hidden selection:bg-purple-100 font-inter">
      {/* Abstract Pastel Blobs - Generated via CSS */}
      
      {/* Blob 1: Soft Rose (Top Left) */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-rose-300/40 blur-[130px] mix-blend-multiply animate-pulse-slow" />
      
      {/* Blob 2: Soft Sky Blue (Bottom Right) */}
      <div className="absolute bottom-[-20%] right-[-10%] w-[700px] h-[700px] rounded-full bg-sky-300/40 blur-[150px] mix-blend-multiply animate-pulse-slow" style={{ animationDelay: '1s' }} />
      
      {/* Blob 3: Soft Lavender (Center area) */}
      <div className="absolute top-[30%] left-[40%] w-[500px] h-[500px] rounded-full bg-purple-300/30 blur-[120px] mix-blend-multiply" />

      {/* Main Content Container */}
      <div className="relative z-10 h-full w-full">
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

      {/* Paper Texture Overlay - Art Brut Noise Effect */}
      <div 
        className="pointer-events-none fixed inset-0 z-[100] opacity-[0.15] mix-blend-overlay" 
        style={{ 
          backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' 
        }}
      />
    </div>
  );
};

export default Desktop;
