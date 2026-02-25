'use client';

import React, { useCallback } from 'react';
import { motion, PanInfo } from 'framer-motion';
import { X, Minus, Square, Copy } from 'lucide-react';
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
    icon: IconName,
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

      // Constrain to viewport
      const maxX = typeof window !== 'undefined' ? window.innerWidth - size.width : 0;
      const maxY = typeof window !== 'undefined' ? window.innerHeight - size.height - 60 : 0; // 60px for taskbar

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
      className="fixed rounded-lg overflow-hidden shadow-2xl border border-white/10 bg-black/90 backdrop-blur-xl"
      style={{
        width: isMaximized ? '100%' : size.width,
        height: isMaximized ? 'calc(100% - 60px)' : size.height,
        left: isMaximized ? 0 : position.x,
        top: isMaximized ? 0 : position.y,
        zIndex,
      }}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.15, ease: 'easeOut' }}
      drag={!isMaximized}
      dragMomentum={false}
      dragElastic={0}
      onDragEnd={handleDragEnd}
      onMouseDown={() => focusWindow(id)}
    >
      {/* Title Bar */}
      <div
        className="flex items-center justify-between h-10 px-3 bg-gradient-to-r from-white/5 to-transparent cursor-move select-none border-b border-white/10"
        onClick={handleTitleBarClick}
        onDoubleClick={handleMaximizeToggle}
      >
        <div className="flex items-center gap-2">
          <span className="text-white/70 text-xs uppercase tracking-wider">{title}</span>
        </div>

        {/* Window Controls */}
        <div className="flex items-center gap-1">
          <button
            onClick={handleMinimize}
            className="p-1.5 rounded-md hover:bg-white/10 transition-colors group"
            title="Minimize"
          >
            <Minus className="w-3.5 h-3.5 text-white/60 group-hover:text-white" />
          </button>

          <button
            onClick={handleMaximizeToggle}
            className="p-1.5 rounded-md hover:bg-white/10 transition-colors group"
            title={isMaximized ? 'Restore' : 'Maximize'}
          >
            {isMaximized ? (
              <Copy className="w-3.5 h-3.5 text-white/60 group-hover:text-white" />
            ) : (
              <Square className="w-3.5 h-3.5 text-white/60 group-hover:text-white" />
            )}
          </button>

          <button
            onClick={handleClose}
            className="p-1.5 rounded-md hover:bg-red-500/80 transition-colors group"
            title="Close"
          >
            <X className="w-3.5 h-3.5 text-white/60 group-hover:text-white" />
          </button>
        </div>
      </div>

      {/* Window Content */}
      <div className="h-[calc(100%-40px)] overflow-auto bg-black/50">{children}</div>
    </motion.div>
  );
};

export default Window;
