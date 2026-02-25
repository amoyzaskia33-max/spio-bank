'use client';

import React, { useState, useEffect } from 'react';
import { LiveProvider, LivePreview, LiveError } from 'react-live';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutTemplate, Eye, Code, Monitor, Smartphone, Tablet, Cpu, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import useOSStore from '@/store/useOSStore';
import { getComponentById } from '@/data/spio-registry';

interface VaultComponent {
  id: string;
  title: string;
  category: 'Frontend' | 'Backend' | 'Prompt';
  codeSnippet: string;
  description?: string;
}

const UICanvas: React.FC = () => {
  const {
    activeComponentId,
    draftCode,
    livePreviewEnabled,
    previewError,
    setPreviewError
  } = useOSStore();

  const [selectedComponent, setSelectedComponent] = useState<any>(null);
  const [viewMode, setViewMode] = useState<'preview' | 'code'>('preview');
  const [deviceSize, setDeviceSize] = useState<'full' | 'tablet' | 'mobile'>('full');
  const [previews, setPreviews] = useState<any[]>([]);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load vault components from API
  useEffect(() => {
    const loadPreviews = async () => {
      try {
        const response = await fetch('/api/vault');
        const data = await response.json();
        
        if (data.success) {
          const frontendComponents = data.data
            .filter((comp: VaultComponent) => comp.category === 'Frontend')
            .map((comp: VaultComponent) => ({
              id: comp.id,
              name: comp.title,
              description: comp.description || '',
              category: comp.category,
              code: comp.codeSnippet,
            }));
          setPreviews(frontendComponents);
        }
      } catch (error) {
        console.error('Failed to load vault components:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadPreviews();
  }, []);

  // Listen to activeComponentId and draftCode changes
  useEffect(() => {
    if (activeComponentId) {
      const component = getComponentById(activeComponentId);
      if (component) {
        setSelectedComponent({
          id: component.id,
          name: component.title,
          description: component.description || '',
          category: component.category,
          component: component.componentType,
          code: component.codeSnippet,
        });
        setViewMode('preview');
        setHasError(false);
        setPreviewError(null);
      }
    }
  }, [activeComponentId, setPreviewError]);

  // Validate code syntax (basic check)
  useEffect(() => {
    if (draftCode && livePreviewEnabled) {
      try {
        // Basic syntax validation
        if (draftCode.includes('import') || draftCode.includes('export')) {
          setHasError(false);
          setPreviewError(null);
        }
      } catch (err) {
        setHasError(true);
        setPreviewError(err instanceof Error ? err.message : 'Syntax error');
      }
    }
  }, [draftCode, livePreviewEnabled, setPreviewError]);

  const getDeviceWidth = () => {
    switch (deviceSize) {
      case 'mobile':
        return 'max-w-[375px]';
      case 'tablet':
        return 'max-w-[768px]';
      default:
        return 'max-w-full';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Frontend':
        return 'text-blue-400 bg-blue-500/20';
      case 'Backend':
        return 'text-yellow-400 bg-yellow-500/20';
      case 'Prompt':
        return 'text-purple-400 bg-purple-500/20';
      default:
        return 'text-white/60 bg-white/5';
    }
  };

  // Transform code for react-live
  const transformCodeForPreview = (code: string) => {
    try {
      // Remove imports for react-live (it provides React globally)
      let transformed = code
        .replace(/import\s+.*?from\s+['"].*?['"];?/g, '')
        .replace(/export\s+(default\s+)?(function|const|class)\s+/g, '$2 ')
        .trim();
      
      // Wrap in function component if needed
      if (!transformed.includes('return')) {
        return `function Preview() { return null; }`;
      }
      
      return transformed;
    } catch (err) {
      setHasError(true);
      setPreviewError(err instanceof Error ? err.message : 'Transform error');
      return `function Preview() { return null; }`;
    }
  };

  return (
    <div className="flex h-full">
      {/* Components Sidebar */}
      <div className="w-60 border-r border-white/10 bg-black/30 flex flex-col">
        <div className="p-3 border-b border-white/10">
          <h2 className="text-white/90 font-semibold text-sm flex items-center gap-2">
            <LayoutTemplate className="w-4 h-4 text-green-400" />
            UI Components
          </h2>
        </div>

        <div className="flex-1 overflow-y-auto py-2">
          {isLoading ? (
            <div className="flex items-center justify-center py-8 text-white/40 text-xs">
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
              Loading...
            </div>
          ) : (
            previews.map((preview) => (
              <motion.div
                key={preview.id}
                className={`px-3 py-3 cursor-pointer transition-colors ${
                  selectedComponent?.id === preview.id
                    ? 'bg-white/10 border-l-2 border-green-400'
                    : 'hover:bg-white/5 border-l-2 border-transparent'
                }`}
                onClick={() => {
                  setSelectedComponent(preview);
                  setViewMode('preview');
                }}
                whileHover={{ x: 2 }}
              >
                <div className="flex items-center justify-between mb-1">
                  <p className="text-white/80 font-medium text-sm">{preview.name}</p>
                  {preview.component && (
                    <span className="px-1.5 py-0.5 bg-green-500/20 text-green-400 text-xs rounded">
                      Live
                    </span>
                  )}
                </div>
                <p className="text-white/40 text-xs line-clamp-2">{preview.description}</p>
              </motion.div>
            ))
          )}

          <div className="px-3 py-2 mt-2 border-t border-white/10">
            <p className="text-white/40 text-xs">
              💡 Edit code in Code Terminal to see live changes
            </p>
          </div>
        </div>
      </div>

      {/* Main Canvas */}
      <div className="flex-1 flex flex-col bg-black/20">
        {/* Toolbar */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-black/30">
          <div className="flex items-center gap-2">
            {selectedComponent && (
              <>
                <button
                  onClick={() => setViewMode('preview')}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors ${
                    viewMode === 'preview'
                      ? 'bg-white/10 text-white'
                      : 'text-white/40 hover:text-white/80'
                  }`}
                >
                  <Eye className="w-4 h-4" />
                  <span className="text-sm">Preview</span>
                </button>
                <button
                  onClick={() => setViewMode('code')}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors ${
                    viewMode === 'code'
                      ? 'bg-white/10 text-white'
                      : 'text-white/40 hover:text-white/80'
                  }`}
                >
                  <Code className="w-4 h-4" />
                  <span className="text-sm">Code</span>
                </button>
              </>
            )}
          </div>

          {selectedComponent && selectedComponent.component && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setDeviceSize('full')}
                className={`p-2 rounded-lg transition-colors ${
                  deviceSize === 'full'
                    ? 'bg-white/10 text-white'
                    : 'text-white/40 hover:text-white/80'
                }`}
                title="Full Width"
              >
                <Monitor className="w-4 h-4" />
              </button>
              <button
                onClick={() => setDeviceSize('tablet')}
                className={`p-2 rounded-lg transition-colors ${
                  deviceSize === 'tablet'
                    ? 'bg-white/10 text-white'
                    : 'text-white/40 hover:text-white/80'
                }`}
                title="Tablet View"
              >
                <Tablet className="w-4 h-4" />
              </button>
              <button
                onClick={() => setDeviceSize('mobile')}
                className={`p-2 rounded-lg transition-colors ${
                  deviceSize === 'mobile'
                    ? 'bg-white/10 text-white'
                    : 'text-white/40 hover:text-white/80'
                }`}
                title="Mobile View"
              >
                <Smartphone className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Canvas Content */}
        <div className="flex-1 overflow-auto p-6 flex items-center justify-center">
          {selectedComponent ? (
            <motion.div
              key={selectedComponent.id + viewMode}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className={`${getDeviceWidth()} w-full`}
            >
              {/* Component Info Bar */}
              <div className="mb-4 flex items-center gap-3">
                <h3 className="text-white font-semibold">{selectedComponent.name}</h3>
                <span className={`text-xs px-2 py-0.5 rounded ${getCategoryColor(selectedComponent.category)}`}>
                  {selectedComponent.category}
                </span>
                {livePreviewEnabled && (
                  <span className="flex items-center gap-1 text-xs text-green-400">
                    <CheckCircle className="w-3 h-3" />
                    Live Sync Active
                  </span>
                )}
              </div>

              {viewMode === 'preview' ? (
                <div className="bg-black/30 rounded-xl border border-white/10 p-8 min-h-[300px] flex items-center justify-center relative">
                  {/* Error Overlay */}
                  {hasError && previewError && (
                    <motion.div
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute top-0 left-0 right-0 bg-red-500/20 border border-red-500/50 rounded-lg p-3 mb-4"
                    >
                      <div className="flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <p className="text-red-400 font-semibold text-sm">Compilation Error</p>
                          <p className="text-red-300/80 text-xs mt-1">{previewError}</p>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Live Preview with react-live */}
                  {livePreviewEnabled && draftCode ? (
                    <LiveProvider
                      code={transformCodeForPreview(draftCode)}
                      noInline={false}
                    >
                      <div className="w-full flex items-center justify-center">
                        <LiveError className="text-red-400 text-sm bg-red-500/10 p-4 rounded-lg" />
                        <LivePreview className="w-full flex items-center justify-center" />
                      </div>
                    </LiveProvider>
                  ) : selectedComponent.component ? (
                    // Fallback to static component
                    <div className="w-full flex items-center justify-center">
                      <selectedComponent.component />
                    </div>
                  ) : (
                    <div className="text-white/30 text-center">
                      <p>No preview available</p>
                      <p className="text-xs mt-1">This is a backend/prompt component</p>
                    </div>
                  )}
                </div>
              ) : (
                <pre className="bg-black/50 rounded-xl border border-white/10 p-4 overflow-x-auto max-h-[500px]">
                  <code className="text-sm text-green-400/90 font-mono whitespace-pre">
                    {draftCode || selectedComponent.code}
                  </code>
                </pre>
              )}
            </motion.div>
          ) : (
            <div className="text-center text-white/30">
              <LayoutTemplate className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p className="text-sm">Select a component to preview</p>
              <p className="text-xs mt-1">Edit in Code Terminal for live changes</p>
            </div>
          )}
        </div>

        {/* Info Bar */}
        {selectedComponent && (
          <div className="px-4 py-2 border-t border-white/10 bg-black/30 flex items-center justify-between">
            <span className="text-white/40 text-xs">
              {selectedComponent.name} • {selectedComponent.id}
            </span>
            <span className="text-white/40 text-xs">
              {viewMode === 'preview' && selectedComponent.component ? deviceSize : 'code'} view
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default UICanvas;
