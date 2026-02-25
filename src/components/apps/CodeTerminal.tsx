'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import Editor from '@monaco-editor/react';
import { LiveProvider, LivePreview, LiveError } from 'react-live';
import { motion } from 'framer-motion';
import { Terminal, Copy, Check, Code2, Send, Sparkles, Loader2, Play, Save, RotateCcw } from 'lucide-react';
import useOSStore from '@/store/useOSStore';
import { getComponentById } from '@/data/spio-registry';

interface VaultComponent {
  id: string;
  title: string;
  category: 'Frontend' | 'Backend' | 'Prompt';
  codeSnippet: string;
  description?: string;
}

interface CodeSnippet {
  id: string;
  name: string;
  language: string;
  code: string;
  category?: string;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  isLoading?: boolean;
}

const API_CONFIG = {
  baseUrl: process.env.NEXT_PUBLIC_SPIO_API_URL || 'http://localhost:8000',
  apiKey: process.env.NEXT_PUBLIC_SPIO_API_KEY || 'spio-secret-key-2024',
};

const CodeTerminal: React.FC = () => {
  const { activeComponentId, draftCode, setDraftCode, livePreviewEnabled, setLivePreviewEnabled } = useOSStore();
  const [snippets, setSnippets] = useState<CodeSnippet[]>([]);
  const [selectedSnippet, setSelectedSnippet] = useState<CodeSnippet | null>(null);
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Interactive Mode State
  const [isInteractiveMode, setIsInteractiveMode] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load vault components from API
  const loadVaultComponents = useCallback(async () => {
    try {
      const response = await fetch('/api/vault');
      const data = await response.json();
      
      if (data.success) {
        const vaultSnippets: CodeSnippet[] = data.data.map((comp: VaultComponent) => ({
          id: comp.id,
          name: comp.title,
          language: comp.category === 'Frontend' ? 'tsx' : comp.category === 'Backend' ? 'ts' : 'md',
          code: comp.codeSnippet,
          category: comp.category,
        }));
        setSnippets(vaultSnippets);
      }
    } catch (error) {
      console.error('Failed to load vault components:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initialize snippets from vault API
  useEffect(() => {
    loadVaultComponents();
  }, [loadVaultComponents]);

  // Listen to activeComponentId changes and sync to draft code
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
        setDraftCode(component.codeSnippet);
      }
    }
  }, [activeComponentId, setDraftCode]);

  // Auto-scroll messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when interactive mode opens
  useEffect(() => {
    if (isInteractiveMode && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isInteractiveMode]);

  const handleCopy = useCallback(async () => {
    if (!draftCode && !selectedSnippet?.code) return;
    
    await navigator.clipboard.writeText(draftCode || selectedSnippet!.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [draftCode, selectedSnippet?.code]);

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      setDraftCode(value);
    }
  };

  const handleResetCode = () => {
    if (selectedSnippet) {
      setDraftCode(selectedSnippet.code);
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isGenerating) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage('');
    setIsGenerating(true);

    // Add loading message
    const loadingMessage: ChatMessage = {
      id: 'loading',
      role: 'assistant',
      content: '',
      timestamp: new Date(),
      isLoading: true,
    };
    setMessages((prev) => [...prev, loadingMessage]);

    try {
      const response = await fetch(`${API_CONFIG.baseUrl}/v1/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_CONFIG.apiKey}`,
        },
        body: JSON.stringify({
          message: inputMessage,
        }),
      });

      const data = await response.json();

      // Remove loading message
      setMessages((prev) => prev.filter((m) => m.id !== 'loading'));

      if (data.success) {
        const assistantMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: data.response,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, assistantMessage]);

        // If code was generated, refresh snippets
        if (data.code_generated) {
          const systemMessage: ChatMessage = {
            id: (Date.now() + 2).toString(),
            role: 'system',
            content: `✨ Code generated and saved to vault!`,
            timestamp: new Date(),
          };
          setMessages((prev) => [...prev, systemMessage]);
          
          setTimeout(() => {
            // Refresh snippets from vault API
            loadVaultComponents();
          }, 2000);
        }
      } else {
        throw new Error(data.response || 'Unknown error');
      }
    } catch (error: any) {
      setMessages((prev) => prev.filter((m) => m.id !== 'loading'));

      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'system',
        content: `❌ System Error: ${error.message || 'Failed to connect to AI backend'}`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getCategoryColor = (category?: string) => {
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

  const toggleInteractiveMode = () => {
    setIsInteractiveMode(!isInteractiveMode);
    if (!isInteractiveMode) {
      const welcomeMessage: ChatMessage = {
        id: 'welcome',
        role: 'assistant',
        content: "👋 Hi! I'm SPIO AI. Describe what you want to create!",
        timestamp: new Date(),
      };
      setMessages([welcomeMessage]);
    }
  };

  return (
    <div className="flex h-full font-inter antialiased">
      {/* Sidebar - Enhanced Visibility */}
      <div className={`border-r border-white/60 bg-white/70 backdrop-blur-3xl saturate-[1.2] flex flex-col transition-all duration-300 relative z-20 ${
        isInteractiveMode ? 'w-48' : 'w-64'
      }`}>
        <div className="p-4 border-b border-white/60 flex items-center justify-between">
          <h2 className="text-slate-800 font-semibold text-sm tracking-tight flex items-center gap-2">
            <Code2 className="w-4 h-4 text-indigo-500" />
            {!isInteractiveMode && 'Code Library'}
          </h2>

          <button
            onClick={toggleInteractiveMode}
            className={`p-1.5 rounded-lg transition-colors ${
              isInteractiveMode
                ? 'bg-indigo-100 text-indigo-600'
                : 'hover:bg-white/50 text-slate-400'
            }`}
            title="Toggle Interactive Mode"
          >
            <Sparkles className="w-4 h-4" />
          </button>
        </div>

        {!isInteractiveMode && (
          <div className="flex-1 overflow-y-auto py-3 px-2">
            {isLoading ? (
              <div className="flex items-center justify-center py-8 text-slate-400 text-xs">
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Loading...
              </div>
            ) : (
              ['Frontend', 'Backend', 'Prompt'].map((category) => {
                const categorySnippets = snippets.filter((s) => s.category === category);
                if (categorySnippets.length === 0) return null;

                return (
                  <div key={category}>
                    <div className="px-3 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      {category}
                    </div>
                    {categorySnippets.map((snippet) => (
                      <motion.div
                        key={snippet.id}
                        className={`group flex items-center gap-3 px-3 py-2 cursor-pointer transition-all rounded-xl ${
                          selectedSnippet?.id === snippet.id
                            ? 'bg-white/60 border border-slate-100 shadow-sm'
                            : 'hover:bg-white/40 border border-transparent'
                        }`}
                        onClick={() => {
                          setSelectedSnippet(snippet);
                          setDraftCode(snippet.code);
                        }}
                        whileHover={{ x: 2 }}
                      >
                        <Code2 className="w-4 h-4 text-slate-400" />
                        <div className="flex-1 min-w-0">
                          <p className="text-slate-700 text-sm truncate font-medium">{snippet.name}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* Interactive Mode Chat */}
        {isInteractiveMode && (
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="flex-1 overflow-y-auto p-3 space-y-3">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div
                    className={`max-w-[85%] rounded-lg px-3 py-2 text-xs ${
                      message.role === 'user'
                        ? 'bg-indigo-100 text-indigo-700 border border-indigo-200'
                        : message.role === 'system'
                        ? 'bg-red-50 text-red-600 border border-red-200'
                        : 'bg-white text-slate-600 border border-slate-200'
                    }`}
                  >
                    {message.isLoading ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="w-3 h-3 animate-spin" />
                        <span>SPIO is thinking...</span>
                      </div>
                    ) : (
                      <p className="whitespace-pre-wrap">{message.content}</p>
                    )}
                  </div>
                </motion.div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-3 border-t border-slate-200/60">
              <div className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Describe what to create..."
                  className="flex-1 bg-white border border-slate-200/60 rounded-lg px-3 py-2 text-slate-700 text-xs placeholder:text-slate-400 focus:outline-none focus:border-indigo-300 focus:ring-1 focus:ring-indigo-200"
                  disabled={isGenerating}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={isGenerating || !inputMessage.trim()}
                  className="p-2 bg-indigo-500 hover:bg-indigo-600 disabled:bg-slate-200 disabled:text-slate-400 text-white rounded-lg transition-colors"
                >
                  {isGenerating ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Content - Editor + Preview - Enhanced Visibility */}
      <div className="flex-1 flex flex-col bg-slate-50/80 backdrop-blur-sm">
        {/* Toolbar - Crown Glass */}
        {selectedSnippet && !isInteractiveMode && (
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/60 bg-white/50 backdrop-blur-3xl">
            <div className="flex items-center gap-3">
              <Terminal className="w-4 h-4 text-indigo-500" />
              <span className="text-slate-700 font-medium text-sm">
                {selectedSnippet.name}
              </span>
              {selectedSnippet.category && (
                <span className={`text-xs px-2 py-0.5 rounded ${getCategoryColor(selectedSnippet.category)}`}>
                  {selectedSnippet.category}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              {/* Live Preview Toggle */}
              <button
                onClick={() => setLivePreviewEnabled(!livePreviewEnabled)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors ${
                  livePreviewEnabled
                    ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                    : 'bg-white text-slate-500 border border-slate-200'
                }`}
                title="Toggle Live Preview"
              >
                <Play className="w-4 h-4" />
                <span className="text-xs">Live: {livePreviewEnabled ? 'ON' : 'OFF'}</span>
              </button>

              {/* Reset Code */}
              <button
                onClick={handleResetCode}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                title="Reset to original code"
              >
                <RotateCcw className="w-4 h-4 text-slate-400" />
              </button>

              {/* Copy Button */}
              <button
                onClick={handleCopy}
                className="flex items-center gap-2 px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-200/60 rounded-lg transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span className="text-slate-600 text-sm">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-slate-400" />
                    <span className="text-slate-500 text-sm">Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Monaco Editor - Dark theme in light window */}
        {selectedSnippet && !isInteractiveMode && (
          <div className="flex-1 overflow-hidden p-4">
            <div className="h-full bg-slate-900 rounded-xl p-4 shadow-lg border border-slate-200">
              <Editor
                height="100%"
                language={selectedSnippet.language}
                theme="vs-dark"
                value={draftCode || selectedSnippet.code}
                onChange={handleEditorChange}
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  lineNumbers: 'on',
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  wordWrap: 'on',
                  tabSize: 2,
                }}
              />
            </div>
          </div>
        )}

        {/* Empty State */}
        {!selectedSnippet && !isInteractiveMode && (
          <div className="flex-1 flex items-center justify-center text-slate-400">
            <div className="text-center">
              <Code2 className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p className="text-slate-600 text-sm font-medium">Select a component or use Interactive Mode</p>
              <p className="text-slate-400 text-xs mt-1">Click the sparkles icon to start</p>
            </div>
          </div>
        )}

        {/* Interactive Mode Overlay */}
        {isInteractiveMode && (
          <div className="flex-1 flex items-center justify-center text-white/20">
            <div className="text-center">
              <Sparkles className="w-16 h-16 mx-auto mb-3 opacity-30" />
              <p className="text-sm">Interactive Mode Active</p>
              <p className="text-xs mt-1">Type your request in the chat</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CodeTerminal;
