'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useOSStore, { APP_IDS, getAppDefinition } from '@/store/useOSStore';
import Window from './Window';
import Taskbar from './Taskbar';
import BootScreen from './BootScreen';
import SpioExplorer from './apps/SpioExplorer';
import CodeTerminal from './apps/CodeTerminal';
import UICanvas from './apps/UICanvas';

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
        return <div className="p-4 text-spio-text-subtle">Unknown App</div>;
    }
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-spio-base">
      {/* macOS-style Dark Pastel Background */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(135deg, #1e1e2e 0%, #24283b 50%, #1a1a28 100%)',
        }}
      />
      
      {/* Subtle gradient overlay */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          background: 'radial-gradient(circle at 30% 50%, rgba(129, 140, 248, 0.15) 0%, transparent 50%)',
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
