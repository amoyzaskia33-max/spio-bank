'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutTemplate, Eye, Code, Monitor, Smartphone, Tablet, Cpu } from 'lucide-react';
import useOSStore from '@/store/useOSStore';
import { spioRegistry, getComponentById } from '@/data/spio-registry';

interface ComponentPreview {
  id: string;
  name: string;
  description: string;
  category: string;
  component?: React.ComponentType<any>;
  code: string;
}

const UICanvas: React.FC = () => {
  const { activeComponentId } = useOSStore();
  const [selectedPreview, setSelectedPreview] = useState<ComponentPreview | null>(null);
  const [viewMode, setViewMode] = useState<'preview' | 'code'>('preview');
  const [deviceSize, setDeviceSize] = useState<'full' | 'tablet' | 'mobile'>('full');
  const [previews, setPreviews] = useState<ComponentPreview[]>([]);

  // Load previews from registry
  useEffect(() => {
    const frontendComponents = spioRegistry
      .filter((comp) => comp.category === 'Frontend' && comp.componentType)
      .map((comp) => ({
        id: comp.id,
        name: comp.title,
        description: comp.description || '',
        category: comp.category,
        component: comp.componentType,
        code: comp.codeSnippet,
      }));
    setPreviews(frontendComponents);
  }, []);

  // Listen to activeComponentId changes
  useEffect(() => {
    if (activeComponentId) {
      const component = getComponentById(activeComponentId);
      if (component && component.componentType) {
        setSelectedPreview({
          id: component.id,
          name: component.title,
          description: component.description || '',
          category: component.category,
          component: component.componentType,
          code: component.codeSnippet,
        });
        setViewMode('preview');
      } else if (component) {
        // Backend or Prompt - show code only
        setSelectedPreview({
          id: component.id,
          name: component.title,
          description: component.description || '',
          category: component.category,
          code: component.codeSnippet,
        });
        setViewMode('code');
      }
    }
  }, [activeComponentId]);

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
          {previews.map((preview) => (
            <motion.div
              key={preview.id}
              className={`px-3 py-3 cursor-pointer transition-colors ${
                selectedPreview?.id === preview.id
                  ? 'bg-white/10 border-l-2 border-green-400'
                  : 'hover:bg-white/5 border-l-2 border-transparent'
              }`}
              onClick={() => {
                setSelectedPreview(preview);
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
          ))}

          {/* Non-frontend components info */}
          <div className="px-3 py-2 mt-2 border-t border-white/10">
            <p className="text-white/40 text-xs">
              💡 Tip: Select components in SPIO Explorer to view Backend scripts and Prompts
            </p>
          </div>
        </div>
      </div>

      {/* Main Canvas */}
      <div className="flex-1 flex flex-col bg-black/20">
        {/* Toolbar */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-black/30">
          <div className="flex items-center gap-2">
            {selectedPreview?.component && (
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

          {selectedPreview?.component && (
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
          {selectedPreview ? (
            <motion.div
              key={selectedPreview.id + viewMode}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className={`${getDeviceWidth()} w-full`}
            >
              {/* Component Info Bar */}
              <div className="mb-4 flex items-center gap-3">
                <h3 className="text-white font-semibold">{selectedPreview.name}</h3>
                <span className={`text-xs px-2 py-0.5 rounded ${getCategoryColor(selectedPreview.category)}`}>
                  {selectedPreview.category}
                </span>
                {selectedPreview.component && (
                  <span className="flex items-center gap-1 text-xs text-green-400">
                    <Cpu className="w-3 h-3" />
                    Interactive
                  </span>
                )}
              </div>

              {viewMode === 'preview' && selectedPreview.component ? (
                <div className="bg-black/30 rounded-xl border border-white/10 p-8 min-h-[300px] flex items-center justify-center">
                  <div className="w-full flex items-center justify-center">
                    <selectedPreview.component />
                  </div>
                </div>
              ) : (
                <pre className="bg-black/50 rounded-xl border border-white/10 p-4 overflow-x-auto max-h-[500px]">
                  <code className="text-sm text-green-400/90 font-mono whitespace-pre">
                    {selectedPreview.code}
                  </code>
                </pre>
              )}
            </motion.div>
          ) : (
            <div className="text-center text-white/30">
              <LayoutTemplate className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p className="text-sm">Select a component from SPIO Explorer</p>
              <p className="text-xs mt-1">to preview it here</p>
            </div>
          )}
        </div>

        {/* Info Bar */}
        {selectedPreview && (
          <div className="px-4 py-2 border-t border-white/10 bg-black/30 flex items-center justify-between">
            <span className="text-white/40 text-xs">
              {selectedPreview.name} • {selectedPreview.id}
            </span>
            <span className="text-white/40 text-xs">
              {viewMode === 'preview' && selectedPreview.component ? deviceSize : 'code'} view
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default UICanvas;
