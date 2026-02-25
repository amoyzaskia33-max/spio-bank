'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Folder, FileCode, FileJson, FileType, ChevronRight, ChevronDown, FolderOpen } from 'lucide-react';
import useOSStore, { APP_IDS, getAppDefinition } from '@/store/useOSStore';
import { spioRegistry, SpioComponent, getComponentsByCategory, getAllCategories } from '@/data/spio-registry';
import CodeTerminal from './CodeTerminal';
import UICanvas from './UICanvas';

interface CategoryGroup {
  name: string;
  components: SpioComponent[];
}

const SpioExplorer: React.FC = () => {
  const { openWindow, setActiveComponent } = useOSStore();
  const [expandedCategories, setExpandedCategories] = React.useState<Record<string, boolean>>({
    'Frontend': true,
    'Backend': true,
    'Prompt': true,
  });

  const categories: CategoryGroup[] = React.useMemo(() => {
    const allCategories = getAllCategories();
    return allCategories.map((category) => ({
      name: category,
      components: getComponentsByCategory(category),
    }));
  }, []);

  const toggleCategory = (categoryName: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [categoryName]: !prev[categoryName],
    }));
  };

  const handleComponentSelect = (component: SpioComponent) => {
    // Set active component in store
    setActiveComponent(component.id);

    // Open both Code Terminal and UI Canvas windows
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
        return <FileCode className="w-4 h-4 text-blue-400" />;
      case 'Backend':
        return <FileJson className="w-4 h-4 text-yellow-400" />;
      case 'Prompt':
        return <FileType className="w-4 h-4 text-purple-400" />;
      default:
        return <FileCode className="w-4 h-4 text-white/60" />;
    }
  };

  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <div className="w-64 border-r border-white/10 bg-black/30 overflow-y-auto">
        <div className="p-3 border-b border-white/10">
          <h2 className="text-white/90 font-semibold text-sm flex items-center gap-2">
            <Folder className="w-4 h-4 text-green-400" />
            SPIO Explorer
          </h2>
        </div>

        <div className="py-2">
          {categories.map((category) => (
            <div key={category.name}>
              <motion.div
                className="flex items-center gap-2 px-2 py-1.5 cursor-pointer rounded-md hover:bg-white/5 transition-colors"
                onClick={() => toggleCategory(category.name)}
                whileHover={{ x: 2 }}
              >
                {expandedCategories[category.name] ? (
                  <ChevronDown className="w-4 h-4 text-white/40" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-white/40" />
                )}
                <FolderOpen className="w-4 h-4 text-yellow-400" />
                <span className="text-white/80 text-sm">{category.name}</span>
                <span className="ml-auto text-white/40 text-xs">{category.components.length}</span>
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
                      className="flex items-center gap-2 px-2 py-1.5 ml-4 cursor-pointer rounded-md hover:bg-white/5 transition-colors"
                      onClick={() => handleComponentSelect(component)}
                      whileHover={{ x: 2, backgroundColor: 'rgba(255,255,255,0.08)' }}
                    >
                      {getFileIcon(category.name)}
                      <span className="text-white/80 text-sm truncate">{component.title}</span>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Main Content - Preview Panel */}
      <div className="flex-1 bg-black/20 p-6 overflow-y-auto">
        <div className="max-w-2xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-white mb-2">SPIO OS Boilerplate Vault</h1>
            <p className="text-white/60">
              Select a component from the sidebar to preview and copy its code.
              Double-click to open in Code Terminal and UI Canvas.
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            {categories.map((category) => (
              <div
                key={category.name}
                className="bg-black/50 backdrop-blur-xl border border-white/10 rounded-xl p-4"
              >
                <div className="flex items-center gap-2 mb-2">
                  {getFileIcon(category.name)}
                  <span className="text-white/60 text-sm">{category.name}</span>
                </div>
                <p className="text-2xl font-bold text-white">{category.components.length}</p>
                <p className="text-white/40 text-xs">components</p>
              </div>
            ))}
          </div>

          {/* All Components Grid */}
          <div className="space-y-6">
            {categories.map((category) => (
              <div key={category.name}>
                <h3 className="text-white/80 font-semibold mb-3 flex items-center gap-2">
                  {getFileIcon(category.name)}
                  {category.name}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {category.components.map((component) => (
                    <motion.div
                      key={component.id}
                      className="bg-black/50 backdrop-blur-xl border border-white/10 rounded-xl p-4 cursor-pointer hover:border-green-500/30 transition-colors"
                      onClick={() => handleComponentSelect(component)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="text-white font-medium">{component.title}</h4>
                        {component.componentType && (
                          <span className="px-2 py-0.5 bg-green-500/20 text-green-400 text-xs rounded">
                            Live
                          </span>
                        )}
                      </div>
                      {component.description && (
                        <p className="text-white/60 text-sm mb-3">{component.description}</p>
                      )}
                      <p className="text-white/40 text-xs">
                        Click to open in Code Terminal & UI Canvas
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpioExplorer;
