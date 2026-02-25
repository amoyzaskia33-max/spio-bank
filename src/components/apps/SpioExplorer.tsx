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

  return (
    <div className="flex h-full" style={{ borderRadius: '255px 15px 225px 15px / 15px 225px 15px 255px' }}>
      {/* Sidebar - Enhanced Visibility */}
      <div className="w-64 border-r border-white/60 bg-white/60 backdrop-blur-3xl saturate-[1.2] overflow-y-auto relative z-20">
        <div className="p-6 border-b border-white/60">
          <h2 className="text-slate-800 font-semibold text-[13px] tracking-tight flex items-center gap-2">
            <Folder className="w-4 h-4 text-slate-600" strokeWidth={1.5} />
            SPIO Explorer
          </h2>
        </div>

        {isLoading && components.length === 0 ? (
          <div className="p-6 flex items-center justify-center text-slate-600 text-[12px]">
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
            Scanning vault...
          </div>
        ) : (
          <div className="py-4 px-3">
            {categories.map((category) => (
              <div key={category.name}>
                <motion.div
                  className="flex items-center gap-2 px-3 py-2 cursor-pointer rounded-xl hover:bg-white/60 transition-colors"
                  onClick={() => toggleCategory(category.name)}
                  whileHover={{ x: 2 }}
                >
                  {expandedCategories[category.name] ? (
                    <ChevronDown className="w-4 h-4 text-slate-600" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-slate-600" />
                  )}
                  <FolderOpen className="w-4 h-4 text-slate-600" />
                  <span className="text-slate-800 text-[13px] font-medium">{category.name}</span>
                  <span className="ml-auto text-slate-600 text-[11px] font-medium">{category.components.length}</span>
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
                        className="flex items-center gap-2 px-3 py-2 ml-4 cursor-pointer rounded-xl hover:bg-indigo-100/60 transition-colors"
                        onClick={() => handleComponentSelect(component)}
                        whileHover={{ x: 2 }}
                      >
                        {getFileIcon(category.name)}
                        <span className="text-slate-800 text-[13px] truncate font-medium">{component.title}</span>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Refresh button */}
        <div className="p-4 border-t border-white/60">
          <button
            onClick={loadVaultComponents}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-white/70 hover:bg-white rounded-xl border border-slate-200 text-slate-700 text-[12px] font-medium transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            {isLoading ? 'Scanning...' : 'Refresh Vault'}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-transparent p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-10">
            <h1 className="text-3xl font-semibold text-slate-800 tracking-tight mb-3">SPIO OS Vault</h1>
            <p className="text-slate-500 text-[14px] font-medium">
              Auto-discovered components from <code className="px-2 py-0.5 bg-white/50 rounded-lg border border-white/60 text-slate-600">src/vault-data/</code>
            </p>
          </div>

          {/* Loading State */}
          {isLoading && components.length === 0 && (
            <div className="text-center py-20">
              <Loader2 className="w-10 h-10 animate-spin mx-auto mb-4 text-slate-300" />
              <p className="text-slate-400 text-[14px] font-medium">Scanning vault-data folder...</p>
            </div>
          )}

          {/* Stats Grid */}
          {!isLoading && components.length > 0 && (
            <>
              <div className="grid grid-cols-3 gap-4 mb-10">
                {categories.map((category) => (
                  <div
                    key={category.name}
                    className="bg-white/40 backdrop-blur-[40px] saturate-[1.2] rounded-2xl p-6 border border-white/60 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)]"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      {getFileIcon(category.name)}
                      <span className="text-slate-500 text-[12px] font-medium uppercase tracking-wide">{category.name}</span>
                    </div>
                    <p className="text-3xl font-semibold text-slate-800 tracking-tight">{category.components.length}</p>
                    <p className="text-slate-400 text-[12px] font-medium mt-1">components</p>
                  </div>
                ))}
              </div>

              {/* Components Grid */}
              <div className="space-y-10">
                {categories.map((category) => (
                  <div key={category.name}>
                    <div className="flex items-center gap-3 mb-5">
                      {getFileIcon(category.name)}
                      <h3 className="text-slate-700 font-semibold text-[14px] uppercase tracking-wide">{category.name}</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {category.components.map((component) => (
                        <motion.div
                          key={component.id}
                          className="bg-white/50 backdrop-blur-[40px] saturate-[1.2] border border-white/60 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] hover:shadow-[0_12px_40px_0_rgba(31,38,135,0.1)] hover:-translate-y-1 transition-all duration-300 rounded-2xl p-6 cursor-pointer"
                          onClick={() => handleComponentSelect(component)}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div className="flex items-start justify-between mb-3">
                            <h4 className="text-slate-800 font-semibold text-[15px] tracking-tight">{component.title}</h4>
                            {component.isLive && (
                              <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-semibold rounded-lg border border-emerald-200">
                                LIVE
                              </span>
                            )}
                          </div>
                          {component.description && (
                            <p className="text-slate-500 text-[13px] font-medium leading-relaxed mb-4 line-clamp-2">
                              {component.description}
                            </p>
                          )}
                          <div className="flex items-center gap-2 text-slate-400 text-[11px] font-medium">
                            <span>Click to open</span>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Empty State */}
          {!isLoading && !error && components.length === 0 && (
            <div className="text-center py-20">
              <Folder className="w-12 h-12 mx-auto mb-4 text-slate-300" />
              <p className="text-slate-500 text-[14px] font-medium mb-1">No components found</p>
              <p className="text-slate-400 text-[13px]">Add .tsx files to src/vault-data/frontend/</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

SpioExplorer.displayName = 'SpioExplorer';

export default SpioExplorer;
