'use client';

import React from 'react';
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

const SpioExplorer: React.FC = () => {
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

  const toggleCategory = (categoryName: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [categoryName]: !prev[categoryName],
    }));
  };

  const handleComponentSelect = (component: VaultComponent) => {
    setActiveComponent(component.id);

    const terminalAppDef = getAppDefinition(APP_IDS.CODE_TERMINAL);
    const canvasAppDef = getAppDefinition(APP_IDS.UI_CANVAS);

    if (terminalAppDef) {
      openWindow(APP_IDS.CODE_TERMINAL, terminalAppDef, <CodeTerminal />);
    }

    if (canvasAppDef) {
      openWindow(APP_IDS.UI_CANVAS, canvasAppDef, <UICanvas />);
    }
  };

  const getFileIcon = (category: string) => {
    switch (category) {
      case 'Frontend':
        return <FileCode className="w-4 h-4 text-spio-blue" />;
      case 'Backend':
        return <FileJson className="w-4 h-4 text-spio-yellow" />;
      case 'Prompt':
        return <FileType className="w-4 h-4 text-spio-purple" />;
      default:
        return <FileCode className="w-4 h-4 text-spio-text-subtle" />;
    }
  };

  const totalComponents = components.length;
  const stats = {
    Frontend: components.filter(c => c.category === 'Frontend').length,
    Backend: components.filter(c => c.category === 'Backend').length,
    Prompt: components.filter(c => c.category === 'Prompt').length,
  };

  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <div className="w-64 border-r border-white/10 bg-spio-base/50 backdrop-blur-glass-premium overflow-y-auto">
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <h2 className="text-spio-text font-semibold text-sm flex items-center gap-2">
            <Folder className="w-4 h-4 text-spio-accent" strokeWidth={1.5} />
            SPIO Explorer
          </h2>
          <button
            onClick={loadVaultComponents}
            disabled={isLoading}
            className="p-1.5 hover:bg-white/10 rounded-lg transition-colors disabled:opacity-50"
            title="Refresh vault"
          >
            <RefreshCw className={`w-4 h-4 text-spio-text-subtle ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {isLoading && components.length === 0 ? (
          <div className="p-4 flex items-center justify-center text-spio-text-subtle text-xs">
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
            Scanning vault...
          </div>
        ) : error ? (
          <div className="p-4 text-red-400 text-xs">
            <p>{error}</p>
            <button 
              onClick={loadVaultComponents}
              className="mt-2 text-spio-accent hover:underline"
            >
              Try again
            </button>
          </div>
        ) : (
          <div className="py-2">
            {categories.map((category) => (
              <div key={category.name}>
                <motion.div
                  className="flex items-center gap-2 px-4 py-2 cursor-pointer rounded-xl hover:bg-white/5 transition-colors"
                  onClick={() => toggleCategory(category.name)}
                  whileHover={{ x: 2 }}
                >
                  {expandedCategories[category.name] ? (
                    <ChevronDown className="w-4 h-4 text-spio-text-subtle" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-spio-text-subtle" />
                  )}
                  <FolderOpen className="w-4 h-4 text-spio-mint" />
                  <span className="text-spio-text text-sm">{category.name}</span>
                  <span className="ml-auto text-spio-text-subtle text-xs">{category.components.length}</span>
                </motion.div>

                {expandedCategories[category.name] && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {category.components.map((component) => (
                      <motion.div
                        key={component.id}
                        className="flex items-center gap-2 px-4 py-2 ml-4 cursor-pointer rounded-xl hover:bg-white/5 transition-colors"
                        onClick={() => handleComponentSelect(component)}
                        whileHover={{ x: 2, backgroundColor: 'rgba(255,255,255,0.08)' }}
                      >
                        {getFileIcon(category.name)}
                        <span className="text-spio-text text-sm truncate">{component.title}</span>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-spio-base/30 p-6 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <div className="flex items-center justify-between mb-3">
              <h1 className="text-3xl font-bold text-spio-text">SPIO OS Vault</h1>
              {isLoading && (
                <div className="flex items-center gap-2 text-spio-text-subtle text-sm">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Scanning...
                </div>
              )}
            </div>
            <p className="text-spio-text-subtle">
              Auto-discovered components from <code className="px-2 py-0.5 bg-white/10 rounded">src/vault-data/</code>
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            {categories.map((category) => (
              <div
                key={category.name}
                className="glass-premium rounded-2xl p-5 border border-white/15"
              >
                <div className="flex items-center gap-2 mb-2">
                  {getFileIcon(category.name)}
                  <span className="text-spio-text-subtle text-sm">{category.name}</span>
                </div>
                <p className="text-3xl font-bold text-spio-text">{category.components.length}</p>
                <p className="text-spio-text-subtle text-xs mt-1">components</p>
              </div>
            ))}
          </div>

          {/* Loading State */}
          {isLoading && components.length === 0 && (
            <div className="text-center py-12 text-spio-text-subtle">
              <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 opacity-50" />
              <p>Scanning vault-data folder...</p>
            </div>
          )}

          {/* Error State */}
          {error && !isLoading && (
            <div className="text-center py-12">
              <p className="text-red-400 mb-4">{error}</p>
              <button
                onClick={loadVaultComponents}
                className="px-4 py-2 bg-spio-accent text-black rounded-lg hover:bg-spio-accent/90"
              >
                Retry
              </button>
            </div>
          )}

          {/* Empty State */}
          {!isLoading && !error && components.length === 0 && (
            <div className="text-center py-12 text-spio-text-subtle">
              <Folder className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="mb-2">No components found in vault</p>
              <p className="text-sm">Add .tsx files to src/vault-data/frontend/</p>
            </div>
          )}

          {/* All Components Grid */}
          {!isLoading && !error && components.length > 0 && (
            <div className="space-y-8">
              {categories.map((category) => (
                <div key={category.name}>
                  <h3 className="text-spio-text font-semibold mb-4 flex items-center gap-2">
                    {getFileIcon(category.name)}
                    {category.name}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {category.components.map((component) => (
                      <motion.div
                        key={component.id}
                        className="glass-premium rounded-2xl p-5 cursor-pointer hover:border-spio-accent/50 transition-colors border border-white/15"
                        onClick={() => handleComponentSelect(component)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <h4 className="text-spio-text font-medium">{component.title}</h4>
                          {component.isLive && (
                            <span className="px-2 py-1 bg-spio-mint/20 text-spio-mint text-xs rounded-lg">
                              Live
                            </span>
                          )}
                        </div>
                        {component.description && (
                          <p className="text-spio-text-subtle text-sm mb-3">{component.description}</p>
                        )}
                        <p className="text-spio-text-subtle text-xs">
                          Click to open in Code Terminal & UI Canvas
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
};

export default SpioExplorer;
