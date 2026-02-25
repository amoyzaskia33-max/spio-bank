'use client';

import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { Folder, FileCode, FileJson, FileType, ChevronRight, ChevronDown, FolderOpen, RefreshCw, Loader2 } from 'lucide-react';
import useOSStore, { APP_IDS, getAppDefinition } from '@/store/useOSStore';
import CodeTerminal from './CodeTerminal';
import UICanvas from './UICanvas';

interface VaultComponent {
  id: string;
  title: string;
  category: 'Frontend' | 'Backend' | 'Prompt';
  description: string;
  codeSnippet: string;
  fileName: string;
  filePath: string;
  isLive: boolean;
  tags: string[];
}

interface CategoryGroup {
  name: string;
  components: VaultComponent[];
}

const SpioExplorer: React.FC = memo(() => {
  const { openWindow, setActiveComponent } = useOSStore();
  const [expandedCategories, setExpandedCategories] = React.useState<Record<string, boolean>>({
    'Frontend': true,
    'Backend': true,
    'Prompt': true,
  });
  const [components, setComponents] = React.useState<VaultComponent[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  // Fetch vault components from API
  const loadVaultComponents = React.useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/vault');
      const data = await response.json();
      
      if (data.success) {
        setComponents(data.data);
      } else {
        setError(data.error || 'Failed to load vault');
      }
    } catch (err) {
      setError('Failed to connect to vault API');
      console.error('Vault API error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadVaultComponents();
  }, [loadVaultComponents]);

  const categories: CategoryGroup[] = React.useMemo(() => {
    const allCategories = ['Frontend', 'Backend', 'Prompt'];
    return allCategories.map((category) => ({
      name: category,
      components: components.filter((comp) => comp.category === category),
    }));
  }, [components]);

  const toggleCategory = React.useCallback((categoryName: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [categoryName]: !prev[categoryName],
    }));
  }, []);

  const handleComponentSelect = React.useCallback((component: VaultComponent) => {
    setActiveComponent(component.id);

    const terminalAppDef = getAppDefinition(APP_IDS.CODE_TERMINAL);
    const canvasAppDef = getAppDefinition(APP_IDS.UI_CANVAS);

    if (terminalAppDef) {
      openWindow(APP_IDS.CODE_TERMINAL, terminalAppDef, <CodeTerminal />);
    }

    if (canvasAppDef) {
      openWindow(APP_IDS.UI_CANVAS, canvasAppDef, <UICanvas />);
    }
  }, [openWindow, setActiveComponent]);

  const getFileIcon = React.useCallback((category: string) => {
    switch (category) {
      case 'Frontend':
        return <FileCode className="w-4 h-4 text-indigo-500" />;
      case 'Backend':
        return <FileJson className="w-4 h-4 text-amber-500" />;
      case 'Prompt':
        return <FileType className="w-4 h-4 text-purple-500" />;
      default:
        return <FileCode className="w-4 h-4 text-slate-400" />;
    }
  }, []);

  const stats = {
    Frontend: components.filter(c => c.category === 'Frontend').length,
    Backend: components.filter(c => c.category === 'Backend').length,
    Prompt: components.filter(c => c.category === 'Prompt').length,
  };

  return (
    <div className="flex h-full">
      {/* Sidebar - Light Styling */}
      <div className="w-64 border-r border-slate-200/60 bg-white/60 backdrop-blur-2xl overflow-y-auto">
        <div className="p-4 border-b border-slate-200/60 flex items-center justify-between">
          <h2 className="text-slate-700 font-medium text-[13px] flex items-center gap-2">
            <Folder className="w-4 h-4 text-slate-400" strokeWidth={1.5} />
            SPIO Explorer
          </h2>
          <button
            onClick={loadVaultComponents}
            disabled={isLoading}
            className="p-1.5 hover:bg-slate-100/60 rounded-lg transition-colors disabled:opacity-50"
            title="Refresh vault"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-slate-400 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {isLoading && components.length === 0 ? (
          <div className="p-4 flex items-center justify-center text-slate-400 text-[12px]">
            <Loader2 className="w-3.5 h-3.5 animate-spin mr-2" />
            Scanning vault...
          </div>
        ) : error ? (
          <div className="p-4 text-red-500 text-[12px]">
            <p>{error}</p>
            <button 
              onClick={loadVaultComponents}
              className="mt-2 text-slate-500 hover:text-slate-700 underline"
            >
              Try again
            </button>
          </div>
        ) : (
          <div className="py-3">
            {categories.map((category) => (
              <div key={category.name}>
                <motion.div
                  className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-slate-100/40 transition-colors"
                  onClick={() => toggleCategory(category.name)}
                  whileHover={{ x: 2 }}
                >
                  {expandedCategories[category.name] ? (
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  ) : (
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                  )}
                  <FolderOpen className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-slate-600 text-[13px]">{category.name}</span>
                  <span className="ml-auto text-slate-400 text-[11px]">{category.components.length}</span>
                </motion.div>

                {expandedCategories[category.name] && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    {category.components.map((component) => (
                      <motion.div
                        key={component.id}
                        className="flex items-center gap-2 px-3 py-1.5 ml-4 cursor-pointer hover:bg-slate-100/50 transition-colors"
                        onClick={() => handleComponentSelect(component)}
                        whileHover={{ x: 2 }}
                      >
                        {getFileIcon(category.name)}
                        <span className="text-slate-500 text-[13px] truncate">{component.title}</span>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Main Content - Light Spacing */}
      <div className="flex-1 bg-transparent p-8 overflow-y-auto">
        <div className="max-w-5xl mx-auto">
          <div className="mb-10">
            <div className="flex items-center justify-between mb-3">
              <h1 className="text-2xl font-semibold text-slate-700 tracking-tight">SPIO OS Vault</h1>
              {isLoading && (
                <div className="flex items-center gap-2 text-slate-400 text-[12px]">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Scanning...
                </div>
              )}
            </div>
            <p className="text-slate-500 text-[13px]">
              Auto-discovered components from <code className="px-1.5 py-0.5 bg-slate-100 rounded border border-slate-200/60">src/vault-data/</code>
            </p>
          </div>

          {/* Quick Stats - Light Cards */}
          <div className="grid grid-cols-3 gap-3 mb-10">
            {categories.map((category) => (
              <div
                key={category.name}
                className="glass-premium rounded-xl p-4 border border-slate-200/60 bg-white/70"
              >
                <div className="flex items-center gap-2 mb-2">
                  {getFileIcon(category.name)}
                  <span className="text-slate-400 text-[11px] uppercase tracking-wide">{category.name}</span>
                </div>
                <p className="text-2xl font-semibold text-slate-700">{category.components.length}</p>
                <p className="text-slate-400 text-[11px] mt-0.5">components</p>
              </div>
            ))}
          </div>

          {/* Loading State */}
          {isLoading && components.length === 0 && (
            <div className="text-center py-16 text-slate-400">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-3 opacity-50" />
              <p className="text-[13px]">Scanning vault-data folder...</p>
            </div>
          )}

          {/* Error State */}
          {error && !isLoading && (
            <div className="text-center py-16">
              <p className="text-red-500 mb-4 text-[13px]">{error}</p>
              <button
                onClick={loadVaultComponents}
                className="px-4 py-2 bg-white hover:bg-slate-50 border border-slate-200/60 rounded-lg text-slate-600 text-[13px] transition-colors"
              >
                Retry
              </button>
            </div>
          )}

          {/* Empty State */}
          {!isLoading && !error && components.length === 0 && (
            <div className="text-center py-16 text-slate-400">
              <Folder className="w-10 h-10 mx-auto mb-3 opacity-40" />
              <p className="text-[13px] mb-1">No components found in vault</p>
              <p className="text-[12px]">Add .tsx files to src/vault-data/frontend/</p>
            </div>
          )}

          {/* All Components Grid - Better Spacing */}
          {!isLoading && !error && components.length > 0 && (
            <div className="space-y-8">
              {categories.map((category) => (
                <div key={category.name}>
                  <h3 className="text-slate-600 font-medium text-[13px] mb-4 flex items-center gap-2 uppercase tracking-wide">
                    {getFileIcon(category.name)}
                    {category.name}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {category.components.map((component) => (
                      <motion.div
                        key={component.id}
                        className="glass-premium rounded-xl p-5 cursor-pointer hover:bg-white/80 hover:border-indigo-200/60 transition-all border border-slate-200/60"
                        onClick={() => handleComponentSelect(component)}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                      >
                        <div className="flex items-start justify-between mb-2.5">
                          <h4 className="text-slate-700 font-medium text-[14px]">{component.title}</h4>
                          {component.isLive && (
                            <span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] rounded border border-emerald-200/60">
                              Live
                            </span>
                          )}
                        </div>
                        {component.description && (
                          <p className="text-slate-500 text-[12px] mb-3 line-clamp-2">{component.description}</p>
                        )}
                        <p className="text-slate-400 text-[11px]">
                          Click to open
                        </p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

SpioExplorer.displayName = 'SpioExplorer';

export default SpioExplorer;
