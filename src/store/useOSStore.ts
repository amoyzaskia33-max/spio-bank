import { create } from 'zustand';

export interface WindowState {
  id: string;
  title: string;
  icon: string;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  position: { x: number; y: number };
  size: { width: number; height: number };
  zIndex: number;
  content: React.ReactNode | null;
}

export interface AppDefinition {
  id: string;
  name: string;
  icon: string;
  defaultPosition: { x: number; y: number };
  defaultSize: { width: number; height: number };
}

interface OSState {
  windows: Record<string, WindowState>;
  activeWindowId: string | null;
  topZIndex: number;
  isBooted: boolean;
  bootLogs: string[];
  
  // Phase 2: Active Component State
  activeComponentId: string | null;
  
  // Phase 5: Live Preview Engine
  draftCode: string | null;
  livePreviewEnabled: boolean;
  previewError: string | null;

  // Actions
  openWindow: (appId: string, appDef: AppDefinition, content?: React.ReactNode) => void;
  closeWindow: (windowId: string) => void;
  minimizeWindow: (windowId: string) => void;
  maximizeWindow: (windowId: string) => void;
  restoreWindow: (windowId: string) => void;
  focusWindow: (windowId: string) => void;
  updateWindowPosition: (windowId: string, position: { x: number; y: number }) => void;
  updateWindowContent: (windowId: string, content: React.ReactNode) => void;
  setBootComplete: () => void;
  
  // Phase 2: Component Actions
  setActiveComponent: (id: string | null) => void;
  clearActiveComponent: () => void;
  
  // Phase 5: Live Preview Actions
  setDraftCode: (code: string | null) => void;
  setLivePreviewEnabled: (enabled: boolean) => void;
  setPreviewError: (error: string | null) => void;
}

const APP_REGISTRY: Record<string, AppDefinition> = {
  'spio-explorer': {
    id: 'spio-explorer',
    name: 'SPIO Explorer',
    icon: 'Folder',
    defaultPosition: { x: 100, y: 100 },
    defaultSize: { width: 900, height: 600 },
  },
  'code-terminal': {
    id: 'code-terminal',
    name: 'Code Terminal',
    icon: 'Terminal',
    defaultPosition: { x: 150, y: 150 },
    defaultSize: { width: 800, height: 500 },
  },
  'ui-canvas': {
    id: 'ui-canvas',
    name: 'UI Canvas',
    icon: 'LayoutTemplate',
    defaultPosition: { x: 200, y: 200 },
    defaultSize: { width: 700, height: 550 },
  },
};

export const useOSStore = create<OSState>((set, get) => ({
  windows: {},
  activeWindowId: null,
  topZIndex: 10,
  isBooted: false,
  bootLogs: [],
  activeComponentId: null,
  draftCode: null,
  livePreviewEnabled: true,
  previewError: null,

  openWindow: (appId: string, appDef: AppDefinition, content?: React.ReactNode) => {
    const { windows, topZIndex } = get();

    // Jika window sudah terbuka, fokuskan dan restore jika diminimize
    if (windows[appId]) {
      if (windows[appId].isMinimized) {
        get().restoreWindow(appId);
      }
      get().focusWindow(appId);
      return;
    }

    const newWindow: WindowState = {
      id: appId,
      title: appDef.name,
      icon: appDef.icon,
      isOpen: true,
      isMinimized: false,
      isMaximized: false,
      position: { ...appDef.defaultPosition },
      size: { ...appDef.defaultSize },
      zIndex: topZIndex + 1,
      content: content || null,
    };

    set((state) => ({
      windows: { ...state.windows, [appId]: newWindow },
      activeWindowId: appId,
      topZIndex: topZIndex + 1,
    }));
  },

  closeWindow: (windowId: string) => {
    set((state) => {
      const { [windowId]: removed, ...remainingWindows } = state.windows;
      return {
        windows: remainingWindows,
        activeWindowId: Object.keys(remainingWindows).length > 0
          ? Object.keys(remainingWindows)[Object.keys(remainingWindows).length - 1]
          : null,
      };
    });
  },

  minimizeWindow: (windowId: string) => {
    set((state) => ({
      windows: {
        ...state.windows,
        [windowId]: { ...state.windows[windowId], isMinimized: true },
      },
      activeWindowId: null,
    }));
  },

  maximizeWindow: (windowId: string) => {
    set((state) => ({
      windows: {
        ...state.windows,
        [windowId]: { ...state.windows[windowId], isMaximized: true },
      },
    }));
  },

  restoreWindow: (windowId: string) => {
    const { topZIndex } = get();
    set((state) => ({
      windows: {
        ...state.windows,
        [windowId]: {
          ...state.windows[windowId],
          isMinimized: false,
          isMaximized: false,
          zIndex: topZIndex + 1,
        },
      },
      activeWindowId: windowId,
      topZIndex: topZIndex + 1,
    }));
  },

  focusWindow: (windowId: string) => {
    const { topZIndex } = get();
    set((state) => ({
      windows: {
        ...state.windows,
        [windowId]: {
          ...state.windows[windowId],
          isMinimized: false,
          zIndex: topZIndex + 1,
        },
      },
      activeWindowId: windowId,
      topZIndex: topZIndex + 1,
    }));
  },

  updateWindowPosition: (windowId: string, position: { x: number; y: number }) => {
    set((state) => ({
      windows: {
        ...state.windows,
        [windowId]: { ...state.windows[windowId], position },
      },
    }));
  },

  updateWindowContent: (windowId: string, content: React.ReactNode) => {
    set((state) => ({
      windows: {
        ...state.windows,
        [windowId]: { ...state.windows[windowId], content },
      },
    }));
  },

  setBootComplete: () => {
    set({ isBooted: true });
  },

  // Phase 2: Component Actions
  setActiveComponent: (id: string | null) => {
    set({ activeComponentId: id });
  },

  clearActiveComponent: () => {
    set({ activeComponentId: null });
  },
  
  // Phase 5: Live Preview Actions
  setDraftCode: (code: string | null) => {
    set({ draftCode: code });
  },
  
  setLivePreviewEnabled: (enabled: boolean) => {
    set({ livePreviewEnabled: enabled });
  },
  
  setPreviewError: (error: string | null) => {
    set({ previewError: error });
  },
}));

// Export helper untuk mendapatkan definisi app
export const getAppDefinition = (appId: string): AppDefinition | undefined => {
  return APP_REGISTRY[appId];
};

export const APP_IDS = {
  SPIO_EXPLORER: 'spio-explorer',
  CODE_TERMINAL: 'code-terminal',
  UI_CANVAS: 'ui-canvas',
} as const;

export default useOSStore;
