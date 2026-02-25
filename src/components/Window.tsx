'use client';

import React, { useCallback, memo } from 'react';
import { motion, PanInfo } from 'framer-motion';
import { X, Minus, Square } from 'lucide-react';
import useOSStore, { WindowState } from '@/store/useOSStore';

interface WindowProps {
  windowState: WindowState;
  children: React.ReactNode;
}

const Window: React.FC<WindowProps> = memo(({ windowState, children }) => {
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
      className="fixed rounded-2xl overflow-hidden border border-white/5 bg-white/[0.02] backdrop-blur-2xl"
      style={{
        width: isMaximized ? '100%' : size.width,
        height: isMaximized ? 'calc(100% - 80px)' : size.height,
        left: isMaximized ? 0 : position.x,
        top: isMaximized ? 0 : position.y,
        zIndex,
        boxShadow: isMaximized 
          ? '0 0 0 1px rgba(255, 255, 255, 0.06), 0 16px 64px rgba(0, 0, 0, 0.5)'
          : '0 0 0 1px rgba(255, 255, 255, 0.05), 0 8px 32px rgba(0, 0, 0, 0.4), 0 0 60px rgba(99, 102, 241, 0.08)',
      }}
      initial={{ opacity: 0, scale: 0.96, y: 16 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96, y: 16 }}
      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
      drag={!isMaximized}
      dragMomentum={false}
      dragElastic={0}
      onDragEnd={handleDragEnd}
      onMouseDown={() => focusWindow(id)}
    >
      {/* Title Bar - Premium macOS Style */}
      <div
        className="flex items-center justify-between h-11 px-4 bg-gradient-to-b from-white/[0.03] to-transparent cursor-move select-none border-b border-white/5"
        onClick={handleTitleBarClick}
        onDoubleClick={handleMaximizeToggle}
      >
        {/* macOS Window Controls (LEFT side) */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleClose}
            className="group w-3 h-3 rounded-full bg-[#ff5f57] flex items-center justify-center transition-all hover:bg-[#ff5f57]/80"
            title="Close"
          >
            <X className="w-2 h-2 text-black/60 opacity-0 group-hover:opacity-100" />
          </button>

          <button
            onClick={handleMinimize}
            className="group w-3 h-3 rounded-full bg-[#febc2e] flex items-center justify-center transition-all hover:bg-[#febc2e]/80"
            title="Minimize"
          >
            <Minus className="w-2 h-2 text-black/60 opacity-0 group-hover:opacity-100" />
          </button>

          <button
            onClick={handleMaximizeToggle}
            className="group w-3 h-3 rounded-full bg-[#28c840] flex items-center justify-center transition-all hover:bg-[#28c840]/80"
            title={isMaximized ? 'Restore' : 'Maximize'}
          >
            <Square className="w-2 h-2 text-black/60 opacity-0 group-hover:opacity-100" />
          </button>
        </div>

        {/* Window Title (CENTER) */}
        <div className="flex-1 text-center">
          <span className="text-white/50 text-[11px] font-medium tracking-wide uppercase">{title}</span>
        </div>

        {/* Empty space on RIGHT for balance */}
        <div className="w-12" />
      </div>

      {/* Window Content */}
      <div className="h-[calc(100%-44px)] overflow-auto bg-transparent">{children}</div>
    </motion.div>
  );
});

Window.displayName = 'Window';

export default Window;
