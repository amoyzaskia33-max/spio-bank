'use client';

import React, { useEffect, useState } from 'react';
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
        return <div className="p-4 text-white/60">Unknown App</div>;
    }
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-nexus-black">
      {/* Background Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: 'radial-gradient(circle at center, rgba(0, 255, 136, 0.05) 0%, transparent 70%)',
        }}
      />
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: 'linear-gradient(to right, rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.02) 1px, transparent 1px)',
          backgroundSize: '50px 50px',
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
