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

  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <div className="w-64 border-r border-white/10 bg-spio-base/50 backdrop-blur-glass-premium overflow-y-auto">
        <div className="p-4 border-b border-white/10">
          <h2 className="text-spio-text font-semibold text-sm flex items-center gap-2">
            <Folder className="w-4 h-4 text-spio-accent" strokeWidth={1.5} />
            SPIO Explorer
          </h2>
        </div>

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
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-spio-base/30 p-6 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-spio-text mb-3">SPIO OS Boilerplate Vault</h1>
            <p className="text-spio-text-subtle">
              Select a component to preview and edit. Changes sync live to UI Canvas.
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

          {/* All Components Grid */}
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
                        {component.componentType && (
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
        </div>
      </div>
    </div>
  );
};

export default SpioExplorer;
