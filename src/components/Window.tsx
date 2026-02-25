'use client';

import React, { useCallback } from 'react';
import { motion, PanInfo } from 'framer-motion';
import { X, Minus, Square } from 'lucide-react';
import useOSStore, { WindowState } from '@/store/useOSStore';

interface WindowProps {
  windowState: WindowState;
  children: React.ReactNode;
}

const Window: React.FC<WindowProps> = ({ windowState, children }) => {
  const {
    id,
    position,
    size,
    isMaximized,
    isMinimized,
    zIndex,
    title,
  } = windowState;

  const {
    closeWindow,
    minimizeWindow,
    maximizeWindow,
    restoreWindow,
    focusWindow,
    updateWindowPosition,
  } = useOSStore();

  const handleDragEnd = useCallback(
    (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      if (isMaximized) return;

      const newX = Math.max(0, position.x + info.delta.x);
      const newY = Math.max(0, position.y + info.delta.y);

      const maxX = typeof window !== 'undefined' ? window.innerWidth - size.width : 0;
      const maxY = typeof window !== 'undefined' ? window.innerHeight - size.height - 80 : 0;

      updateWindowPosition(id, {
        x: Math.min(Math.max(0, newX), maxX),
        y: Math.min(Math.max(0, newY), maxY),
      });
    },
    [id, isMaximized, position.x, position.y, size.width, size.height, updateWindowPosition]
  );

  const handleTitleBarClick = useCallback(() => {
    focusWindow(id);
  }, [id, focusWindow]);

  const handleMaximizeToggle = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (isMaximized) {
        restoreWindow(id);
      } else {
        maximizeWindow(id);
      }
    },
    [id, isMaximized, maximizeWindow, restoreWindow]
  );

  const handleMinimize = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      minimizeWindow(id);
    },
    [id, minimizeWindow]
  );

  const handleClose = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      closeWindow(id);
    },
    [id, closeWindow]
  );

  if (isMinimized) {
    return null;
  }

  return (
    <motion.div
      className="fixed rounded-3xl overflow-hidden shadow-window border border-white/10 bg-spio-surface/95 backdrop-blur-glass-heavy"
      style={{
        width: isMaximized ? '100%' : size.width,
        height: isMaximized ? 'calc(100% - 80px)' : size.height,
        left: isMaximized ? 0 : position.x,
        top: isMaximized ? 0 : position.y,
        zIndex,
      }}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      drag={!isMaximized}
      dragMomentum={false}
      dragElastic={0}
      onDragEnd={handleDragEnd}
      onMouseDown={() => focusWindow(id)}
    >
      {/* Title Bar - macOS Style (controls on LEFT) */}
      <div
        className="flex items-center justify-between h-12 px-4 bg-gradient-to-b from-white/5 to-transparent cursor-move select-none border-b border-white/5"
        onClick={handleTitleBarClick}
        onDoubleClick={handleMaximizeToggle}
      >
        {/* macOS Window Controls (LEFT side) */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleClose}
            className="group w-3 h-3 rounded-full bg-spio-red flex items-center justify-center transition-all hover:bg-spio-red/80"
            title="Close"
          >
            <X className="w-2 h-2 text-black/60 opacity-0 group-hover:opacity-100" />
          </button>
          
          <button
            onClick={handleMinimize}
            className="group w-3 h-3 rounded-full bg-spio-yellow flex items-center justify-center transition-all hover:bg-spio-yellow/80"
            title="Minimize"
          >
            <Minus className="w-2 h-2 text-black/60 opacity-0 group-hover:opacity-100" />
          </button>
          
          <button
            onClick={handleMaximizeToggle}
            className="group w-3 h-3 rounded-full bg-spio-green flex items-center justify-center transition-all hover:bg-spio-green/80"
            title={isMaximized ? 'Restore' : 'Maximize'}
          >
            <Square className="w-2 h-2 text-black/60 opacity-0 group-hover:opacity-100" />
          </button>
        </div>

        {/* Window Title (CENTER) */}
        <div className="flex-1 text-center">
          <span className="text-spio-text/70 text-xs font-medium tracking-wide uppercase">{title}</span>
        </div>

        {/* Empty space on RIGHT for balance */}
        <div className="w-16" />
      </div>

      {/* Window Content */}
      <div className="h-[calc(100%-48px)] overflow-auto bg-spio-base/30">{children}</div>
    </motion.div>
  );
};

export default Window;
