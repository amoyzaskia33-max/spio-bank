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
          code: component.codeSnippet,
        });
        setViewMode('preview');
        setHasError(false);
        setPreviewError(null);
      }
    }
  }, [activeComponentId, setPreviewError]);

  // Validate code syntax (basic check)
  const validateCode = (code: string) => {
    if (!code) return false;
    // Basic validation - check for return statement
    return code.includes('return') || code.includes('<div') || code.includes('<motion');
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
        return 'text-indigo-600 bg-indigo-100';
      case 'Backend':
        return 'text-amber-600 bg-amber-100';
      case 'Prompt':
        return 'text-purple-600 bg-purple-100';
      default:
        return 'text-slate-500 bg-slate-100';
    }
  };

  return (
    <div className="flex h-full font-inter antialiased">
      {/* Components Sidebar - Enhanced Visibility */}
      <div className="w-64 border-r border-white/60 bg-white/70 backdrop-blur-3xl saturate-[1.2] flex flex-col relative z-20">
        <div className="p-4 border-b border-white/60">
          <h2 className="text-slate-800 font-semibold text-sm tracking-tight flex items-center gap-2">
            <LayoutTemplate className="w-4 h-4 text-indigo-600" />
            UI Components
          </h2>
        </div>

        <div className="flex-1 overflow-y-auto py-3 px-2">
          {isLoading ? (
            <div className="flex items-center justify-center py-8 text-slate-400 text-xs">
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
              Loading...
            </div>
          ) : (
            previews.map((preview) => (
              <motion.div
                key={preview.id}
                className={`px-3 py-3 cursor-pointer transition-all rounded-xl ${
                  selectedComponent?.id === preview.id
                    ? 'bg-white/60 border border-slate-100 shadow-sm'
                    : 'hover:bg-white/40 border border-transparent'
                }`}
                onClick={() => {
                  setSelectedComponent(preview);
                  setViewMode('preview');
                }}
                whileHover={{ x: 2 }}
              >
                <div className="flex items-center justify-between mb-1">
                  <p className="text-slate-700 font-medium text-sm">{preview.name}</p>
                  {preview.component && (
                    <span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-semibold rounded-lg border border-emerald-200">
                      Live
                    </span>
                  )}
                </div>
                <p className="text-slate-500 text-xs line-clamp-2 font-medium">{preview.description}</p>
              </motion.div>
            ))
          )}

          <div className="px-3 py-3 mt-2 border-t border-white/60">
            <p className="text-slate-400 text-xs font-medium">
              💡 Edit code in Code Terminal to see live changes
            </p>
          </div>
        </div>
      </div>

      {/* Main Canvas - Crown Glass */}
      <div className="flex-1 flex flex-col bg-transparent">
        {/* Toolbar - Crown Glass */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/60 bg-white/50 backdrop-blur-3xl saturate-[1.2]">
          <div className="flex items-center gap-2">
            {selectedComponent && (
              <>
                <button
                  onClick={() => setViewMode('preview')}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors ${
                    viewMode === 'preview'
                      ? 'bg-indigo-100 text-indigo-700 font-medium'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  <Eye className="w-4 h-4" />
                  <span className="text-sm">Preview</span>
                </button>
                <button
                  onClick={() => setViewMode('code')}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors ${
                    viewMode === 'code'
                      ? 'bg-indigo-100 text-indigo-700 font-medium'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  <Code className="w-4 h-4" />
                  <span className="text-sm">Code</span>
                </button>
              </>
            )}
          </div>

          {selectedComponent && selectedComponent.code && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setDeviceSize('full')}
                className={`p-2 rounded-lg transition-colors ${
                  deviceSize === 'full'
                    ? 'bg-white/60 text-slate-700'
                    : 'text-slate-400 hover:text-slate-600'
                }`}
                title="Full Width"
              >
                <Monitor className="w-4 h-4" />
              </button>
              <button
                onClick={() => setDeviceSize('tablet')}
                className={`p-2 rounded-lg transition-colors ${
                  deviceSize === 'tablet'
                    ? 'bg-white/60 text-slate-700'
                    : 'text-slate-400 hover:text-slate-600'
                }`}
                title="Tablet"
              >
                <Tablet className="w-4 h-4" />
              </button>
              <button
                onClick={() => setDeviceSize('mobile')}
                className={`p-2 rounded-lg transition-colors ${
                  deviceSize === 'mobile'
                    ? 'bg-white/60 text-slate-700'
                    : 'text-slate-400 hover:text-slate-600'
                }`}
                title="Mobile"
              >
                <Smartphone className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Preview/Code Area */}
        <div className="flex-1 overflow-auto bg-slate-100/50 p-6">
          {!selectedComponent ? (
            <div className="h-full flex items-center justify-center text-slate-500">
              <div className="text-center">
                <LayoutTemplate className="w-16 h-16 mx-auto mb-4 opacity-40" />
                <p className="text-slate-600 font-medium text-sm">Select a component to preview</p>
                <p className="text-slate-400 text-xs mt-1">Choose from the sidebar</p>
              </div>
            </div>
          ) : viewMode === 'preview' ? (
            <div className={`mx-auto transition-all duration-300 ${getDeviceWidth()}`}>
              {/* Preview Area - Light background */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                {/* Info Bar */}
                <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-slate-400" />
                    <span className="text-slate-600 text-xs font-medium">{selectedComponent.name}</span>
                  </div>
                  {selectedComponent.category && (
                    <span className={`text-[10px] px-2 py-1 rounded-lg font-medium ${getCategoryColor(selectedComponent.category)}`}>
                      {selectedComponent.category}
                    </span>
                  )}
                </div>

                {/* Live Preview */}
                <div className="p-6 min-h-[400px]">
                  {livePreviewEnabled && selectedComponent.code ? (
                    <LiveProvider
                      code={transformCodeForPreview(selectedComponent.code)}
                      noInline={false}
                    >
                      <div className="transform-gpu">
                        <LivePreview />
                      </div>
                      <LiveError className="text-red-600 text-xs bg-red-50 p-3 rounded-lg border border-red-100" />
                    </LiveProvider>
                  ) : (
                    <div className="flex items-center justify-center h-full text-slate-400">
                      <div className="text-center">
                        <AlertCircle className="w-12 h-12 mx-auto mb-3 opacity-40" />
                        <p className="text-slate-600 font-medium text-sm">Live Preview Disabled</p>
                        <p className="text-slate-400 text-xs mt-1">Enable in Code Terminal</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            /* Code View */
            <div className="max-w-4xl mx-auto">
              <div className="bg-slate-900 rounded-2xl border border-slate-200 shadow-lg overflow-hidden">
                <div className="px-4 py-3 border-b border-slate-700 bg-slate-800/50 flex items-center justify-between">
                  <span className="text-slate-300 text-xs font-mono">{selectedComponent.name}.tsx</span>
                  <span className="text-slate-400 text-xs">TypeScript React</span>
                </div>
                <pre className="p-4 overflow-auto text-sm font-mono text-slate-300">
                  <code>{selectedComponent.code}</code>
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UICanvas;
