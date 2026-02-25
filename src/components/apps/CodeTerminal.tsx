'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Terminal, Copy, Check, Code2, X, FileCode } from 'lucide-react';
import useOSStore from '@/store/useOSStore';
import { spioRegistry, getComponentById } from '@/data/spio-registry';

interface CodeSnippet {
  id: string;
  name: string;
  language: string;
  code: string;
  category?: string;
}

const CodeTerminal: React.FC = () => {
  const { activeComponentId } = useOSStore();
  const [snippets, setSnippets] = useState<CodeSnippet[]>([]);
  const [selectedSnippet, setSelectedSnippet] = useState<CodeSnippet | null>(null);
  const [copied, setCopied] = useState(false);

  // Initialize snippets from registry
  useEffect(() => {
    const registrySnippets: CodeSnippet[] = spioRegistry.map((comp) => ({
      id: comp.id,
      name: comp.title,
      language: comp.category === 'Frontend' ? 'tsx' : comp.category === 'Backend' ? 'ts' : 'md',
      code: comp.codeSnippet,
      category: comp.category,
    }));
    setSnippets(registrySnippets);
  }, []);

  // Listen to activeComponentId changes
  useEffect(() => {
    if (activeComponentId) {
      const component = getComponentById(activeComponentId);
      if (component) {
        const snippet: CodeSnippet = {
          id: component.id,
          name: component.title,
          language: component.category === 'Frontend' ? 'tsx' : component.category === 'Backend' ? 'ts' : 'md',
          code: component.codeSnippet,
          category: component.category,
        };
        setSelectedSnippet(snippet);
      }
    }
  }, [activeComponentId]);

  const handleCopy = useCallback(async () => {
    if (!selectedSnippet?.code) return;
    
    await navigator.clipboard.writeText(selectedSnippet.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [selectedSnippet?.code]);

  const getCategoryColor = (category?: string) => {
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
      {/* Snippets Sidebar */}
      <div className="w-64 border-r border-white/10 bg-black/30 flex flex-col">
        <div className="p-3 border-b border-white/10">
          <h2 className="text-white/90 font-semibold text-sm flex items-center gap-2">
            <Code2 className="w-4 h-4 text-green-400" />
            Code Library
          </h2>
        </div>

        <div className="flex-1 overflow-y-auto py-2">
          {/* Group by category */}
          {['Frontend', 'Backend', 'Prompt'].map((category) => {
            const categorySnippets = snippets.filter((s) => s.category === category);
            if (categorySnippets.length === 0) return null;

            return (
              <div key={category}>
                <div className="px-3 py-2 text-xs font-semibold text-white/40 uppercase tracking-wider">
                  {category}
                </div>
                {categorySnippets.map((snippet) => (
                  <motion.div
                    key={snippet.id}
                    className={`group flex items-center gap-3 px-3 py-2 cursor-pointer transition-colors ${
                      selectedSnippet?.id === snippet.id
                        ? 'bg-white/10 border-l-2 border-green-400'
                        : 'hover:bg-white/5 border-l-2 border-transparent'
                    }`}
                    onClick={() => setSelectedSnippet(snippet)}
                    whileHover={{ x: 2 }}
                  >
                    <FileCode className="w-4 h-4 text-white/40" />
                    <div className="flex-1 min-w-0">
                      <p className="text-white/80 text-sm truncate">{snippet.name}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            );
          })}
        </div>
      </div>

      {/* Code Display */}
      <div className="flex-1 flex flex-col bg-black/20">
        {/* Header */}
        {selectedSnippet && (
          <>
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-black/30">
              <div className="flex items-center gap-3">
                <Terminal className="w-4 h-4 text-green-400" />
                <span className="text-white/90 font-semibold text-sm">
                  {selectedSnippet.name}
                </span>
                {selectedSnippet.category && (
                  <span className={`text-xs px-2 py-0.5 rounded ${getCategoryColor(selectedSnippet.category)}`}>
                    {selectedSnippet.category}
                  </span>
                )}
              </div>

              <button
                onClick={handleCopy}
                className="flex items-center gap-2 px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-green-400" />
                    <span className="text-white/80 text-sm">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-white/60" />
                    <span className="text-white/60 text-sm">Copy</span>
                  </>
                )}
              </button>
            </div>

            {/* Code Block */}
            <div className="flex-1 overflow-auto p-4">
              <pre className="bg-black/50 rounded-lg p-4 border border-white/10 h-full">
                <code className="text-sm text-green-400/90 font-mono whitespace-pre">
                  {selectedSnippet.code}
                </code>
              </pre>
            </div>
          </>
        )}

        {/* Empty State */}
        {!selectedSnippet && (
          <div className="flex-1 flex items-center justify-center text-white/30">
            <div className="text-center">
              <Code2 className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p className="text-sm">Select a component from SPIO Explorer</p>
              <p className="text-xs mt-1">or choose from the library</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CodeTerminal;
