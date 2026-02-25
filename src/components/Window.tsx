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
      className="absolute overflow-hidden bg-white/50 backdrop-blur-[40px] saturate-[1.2] border border-white/80 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] rounded-3xl z-50"
      style={{
        width: isMaximized ? '100%' : size.width,
        height: isMaximized ? 'calc(100% - 80px)' : size.height,
        left: isMaximized ? 0 : position.x,
        top: isMaximized ? 0 : position.y,
        zIndex: zIndex + 50, // Ensure windows are above background blobs
      }}
      initial={{ opacity: 0, scale: 0.97, y: 12 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97, y: 12 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      drag={!isMaximized}
      dragMomentum={false}
      dragElastic={0}
      onDragEnd={handleDragEnd}
      onMouseDown={() => focusWindow(id)}
    >
      {/* Title Bar */}
      <div
        className="flex items-center justify-between h-12 px-4 bg-gradient-to-b from-white/40 via-white/20 to-transparent backdrop-blur-xl cursor-move select-none border-b border-white/60"
        onClick={handleTitleBarClick}
        onDoubleClick={handleMaximizeToggle}
      >
        {/* macOS Window Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleClose}
            className="group w-3 h-3 rounded-full bg-rose-400 flex items-center justify-center transition-all hover:bg-rose-500 shadow-sm"
            title="Close"
          >
            <X className="w-2 h-2 text-white/90 opacity-0 group-hover:opacity-100" />
          </button>

          <button
            onClick={handleMinimize}
            className="group w-3 h-3 rounded-full bg-amber-400 flex items-center justify-center transition-all hover:bg-amber-500 shadow-sm"
            title="Minimize"
          >
            <Minus className="w-2 h-2 text-white/90 opacity-0 group-hover:opacity-100" />
          </button>

          <button
            onClick={handleMaximizeToggle}
            className="group w-3 h-3 rounded-full bg-emerald-400 flex items-center justify-center transition-all hover:bg-emerald-500 shadow-sm"
            title={isMaximized ? 'Restore' : 'Maximize'}
          >
            <Square className="w-2 h-2 text-white/90 opacity-0 group-hover:opacity-100" />
          </button>
        </div>

        {/* Window Title */}
        <div className="flex-1 text-center">
          <span className="text-slate-500 text-[11px] font-medium tracking-wide uppercase">{title}</span>
        </div>

        {/* Right spacer */}
        <div className="w-12" />
      </div>

      {/* Window Content */}
      <div className="h-[calc(100%-48px)] overflow-auto">{children}</div>
    </motion.div>
  );
});

Window.displayName = 'Window';

export default Window;
