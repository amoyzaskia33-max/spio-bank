'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Folder, 
  FileCode, 
  FileJson, 
  FileType, 
  ChevronRight, 
  ChevronDown,
  Terminal,
  LayoutTemplate,
  FolderOpen
} from 'lucide-react';

export interface FileItem {
  id: string;
  name: string;
  type: 'file' | 'folder';
  fileType?: 'ts' | 'tsx' | 'js' | 'jsx' | 'json' | 'css' | 'md';
  children?: FileItem[];
  content?: string;
}

const fileSystem: FileItem[] = [
  {
    id: 'frontend',
    name: 'Frontend',
    type: 'folder',
    children: [
      {
        id: 'components',
        name: 'Components',
        type: 'folder',
        children: [
          { 
            id: 'button', 
            name: 'Button.tsx', 
            type: 'file', 
            fileType: 'tsx',
            content: `export interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  className?: string;
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  className = ''
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variants = {
    primary: 'bg-green-500 hover:bg-green-600 text-black focus:ring-green-500',
    secondary: 'bg-white/10 hover:bg-white/20 text-white focus:ring-white/50',
    outline: 'border border-white/20 hover:bg-white/5 text-white focus:ring-white/50'
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };

  return (
    <button
      onClick={onClick}
      className={\`\${baseStyles} \${variants[variant]} \${sizes[size]} \${className}\`}
    >
      {children}
    </button>
  );
}`
          },
          { 
            id: 'card', 
            name: 'Card.tsx', 
            type: 'file', 
            fileType: 'tsx',
            content: `import { motion } from 'framer-motion';

export interface CardProps {
  title?: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
}

export function Card({
  title,
  description,
  children,
  className = '',
  hoverEffect = true
}: CardProps) {
  return (
    <motion.div
      className={\`bg-black/50 backdrop-blur-xl border border-white/10 rounded-xl p-6 \${className}\`}
      whileHover={hoverEffect ? { scale: 1.02, borderColor: 'rgba(0, 255, 136, 0.3)' } : {}}
      transition={{ duration: 0.2 }}
    >
      {title && (
        <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      )}
      {description && (
        <p className="text-white/60 text-sm mb-4">{description}</p>
      )}
      {children}
    </motion.div>
  );
}`
          },
        ],
      },
      {
        id: 'hooks',
        name: 'Hooks',
        type: 'folder',
        children: [
          { 
            id: 'useDebounce', 
            name: 'useDebounce.ts', 
            type: 'file', 
            fileType: 'ts',
            content: `import { useState, useEffect } from 'react';

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}`
          },
        ],
      },
    ],
  },
  {
    id: 'backend',
    name: 'Backend',
    type: 'folder',
    children: [
      {
        id: 'api',
        name: 'API Routes',
        type: 'folder',
        children: [
          { 
            id: 'auth', 
            name: 'auth.ts', 
            type: 'file', 
            fileType: 'ts',
            content: `import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // TODO: Implement actual authentication logic
    console.log('Auth request:', { email });

    return NextResponse.json({ 
      success: true, 
      token: 'mock-jwt-token' 
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    );
  }
}`
          },
        ],
      },
      {
        id: 'utils',
        name: 'Utils',
        type: 'folder',
        children: [
          { 
            id: 'db', 
            name: 'database.ts', 
            type: 'file', 
            fileType: 'ts',
            content: `// Database connection utility
export const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'nexus_vault',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD,
};

export async function connectDB() {
  console.log('Connecting to database...', dbConfig);
  // Implementation here
  return { connected: true };
}`
          },
        ],
      },
    ],
  },
  {
    id: 'prompts',
    name: 'AI Prompts',
    type: 'folder',
    children: [
      { 
        id: 'system', 
        name: 'system-prompt.md', 
        type: 'file', 
        fileType: 'md',
        content: `# NEXUS OS System Prompt

You are the NEXUS OS AI assistant. Your role is to help users:
- Navigate the boilerplate codebase
- Generate new components following established patterns
- Explain architecture decisions
- Provide code snippets with proper typing

## Guidelines:
1. Always use TypeScript
2. Follow existing component patterns
3. Include proper error handling
4. Use Tailwind CSS for styling
5. Prefer Framer Motion for animations`
      },
      { 
        id: 'component', 
        name: 'component-generator.md', 
        type: 'file', 
        fileType: 'md',
        content: `# Component Generator Prompt

When generating components, follow this structure:

1. Define TypeScript interfaces for props
2. Use destructuring with default values
3. Include className prop for customization
4. Add motion variants if animated
5. Export as named export

Example:
\`\`\`tsx
interface Props {
  variant?: 'default' | 'premium';
}

export function MyComponent({ variant = 'default' }: Props) {
  // implementation
}`
      },
    ],
  },
];

const getFileIcon = (fileType?: string) => {
  switch (fileType) {
    case 'tsx':
    case 'jsx':
      return <FileCode className="w-4 h-4 text-blue-400" />;
    case 'ts':
    case 'js':
      return <FileCode className="w-4 h-4 text-yellow-400" />;
    case 'json':
      return <FileJson className="w-4 h-4 text-green-400" />;
    case 'css':
      return <FileType className="w-4 h-4 text-pink-400" />;
    case 'md':
      return <FileCode className="w-4 h-4 text-purple-400" />;
    default:
      return <FileCode className="w-4 h-4 text-white/60" />;
  }
};

interface FileTreeItemProps {
  item: FileItem;
  depth: number;
  onSelectFile: (file: FileItem) => void;
  selectedFileId?: string;
}

const FileTreeItem: React.FC<FileTreeItemProps> = ({ 
  item, 
  depth, 
  onSelectFile,
  selectedFileId 
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const handleClick = () => {
    if (item.type === 'folder') {
      setIsExpanded(!isExpanded);
    } else {
      onSelectFile(item);
    }
  };

  return (
    <div>
      <motion.div
        className={`flex items-center gap-2 px-2 py-1.5 cursor-pointer rounded-md transition-colors ${
          selectedFileId === item.id
            ? 'bg-white/10'
            : 'hover:bg-white/5'
        }`}
        style={{ paddingLeft: `${depth * 12 + 8}px` }}
        onClick={handleClick}
        whileHover={{ x: 2 }}
        transition={{ duration: 0.1 }}
      >
        {item.type === 'folder' && (
          <span className="text-white/40">
            {isExpanded ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </span>
        )}
        
        {item.type === 'folder' ? (
          <FolderOpen className="w-4 h-4 text-yellow-400" />
        ) : (
          getFileIcon(item.fileType)
        )}
        
        <span className="text-white/80 text-sm truncate">{item.name}</span>
      </motion.div>

      {item.type === 'folder' && isExpanded && item.children && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.2 }}
        >
          {item.children.map((child) => (
            <FileTreeItem
              key={child.id}
              item={child}
              depth={depth + 1}
              onSelectFile={onSelectFile}
              selectedFileId={selectedFileId}
            />
          ))}
        </motion.div>
      )}
    </div>
  );
};

interface NexusExplorerProps {
  onFileSelect?: (file: FileItem, content: string) => void;
}

const NexusExplorer: React.FC<NexusExplorerProps> = ({ onFileSelect }) => {
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);

  const handleSelectFile = (file: FileItem) => {
    setSelectedFile(file);
    if (file.content && onFileSelect) {
      onFileSelect(file, file.content);
    }
  };

  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <div className="w-64 border-r border-white/10 bg-black/30 overflow-y-auto">
        <div className="p-3 border-b border-white/10">
          <h2 className="text-white/90 font-semibold text-sm flex items-center gap-2">
            <Folder className="w-4 h-4 text-green-400" />
            Nexus Explorer
          </h2>
        </div>
        
        <div className="py-2">
          {fileSystem.map((item) => (
            <FileTreeItem
              key={item.id}
              item={item}
              depth={0}
              onSelectFile={handleSelectFile}
              selectedFileId={selectedFile?.id}
            />
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-black/20 p-4 overflow-y-auto">
        {selectedFile ? (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-white/60 text-sm">
              {getFileIcon(selectedFile.fileType)}
              <span>{selectedFile.name}</span>
            </div>
            
            {selectedFile.content && (
              <pre className="bg-black/50 rounded-lg p-4 overflow-x-auto border border-white/10">
                <code className="text-xs text-green-400/90 font-mono whitespace-pre">
                  {selectedFile.content}
                </code>
              </pre>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-white/30">
            <div className="text-center">
              <Folder className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p className="text-sm">Select a file to preview</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NexusExplorer;
