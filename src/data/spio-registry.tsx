import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { vaultComponents } from '@/vault-data';

// ============================================
// SPIO OS Component Registry
// Central database for all boilerplate components
// ============================================

export interface SpioComponent {
  id: string;
  title: string;
  category: 'Frontend' | 'Backend' | 'Prompt';
  codeSnippet: string;
  componentType?: React.ComponentType<any>;
  description?: string;
  isLive?: boolean;
  tags?: string[];
}

// ============================================
// ACTUAL COMPONENT IMPLEMENTATIONS
// ============================================

// Button Component with Glow Effect
const ButtonGlow: React.FC<{ variant?: 'primary' | 'secondary' | 'outline' }> = ({ 
  variant = 'primary' 
}) => {
  const baseStyles = 'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black';
  
  const variants = {
    primary: 'bg-green-500 hover:bg-green-600 text-black shadow-lg shadow-green-500/30',
    secondary: 'bg-white/10 hover:bg-white/20 text-white',
    outline: 'border border-white/20 hover:bg-white/5 text-white',
  };

  return (
    <button className={`${baseStyles} ${variants[variant]} px-6 py-3`}>
      Click Me
    </button>
  );
};

// Animated Card Component
const CardAnimated: React.FC = () => {
  return (
    <motion.div
      className="bg-black/50 backdrop-blur-xl border border-white/10 rounded-xl p-6 max-w-sm"
      whileHover={{ scale: 1.02, borderColor: 'rgba(0, 255, 136, 0.5)' }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
    >
      <h3 className="text-lg font-semibold text-white mb-2">Premium Card</h3>
      <p className="text-white/60 text-sm mb-4">Hover to see the glow effect</p>
      <div className="flex gap-2">
        <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full">React</span>
        <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-full">Next.js</span>
      </div>
    </motion.div>
  );
};

// Input Field Component
const InputField: React.FC = () => {
  const [value, setValue] = useState('');
  
  return (
    <div className="space-y-2 max-w-sm">
      <label className="text-white/80 text-sm font-medium">Email</label>
      <input
        type="email"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Enter your email"
        className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-white/30 focus:outline-none focus:border-green-500/50 focus:ring-1 focus:ring-green-500/50 transition-all"
      />
    </div>
  );
};

// Badge Component
const BadgeStatus: React.FC = () => {
  return (
    <div className="flex flex-wrap gap-3">
      <span className="px-3 py-1 bg-green-500/20 text-green-400 text-sm font-medium rounded-full">Success</span>
      <span className="px-3 py-1 bg-blue-500/20 text-blue-400 text-sm font-medium rounded-full">Info</span>
      <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 text-sm font-medium rounded-full">Warning</span>
      <span className="px-3 py-1 bg-red-500/20 text-red-400 text-sm font-medium rounded-full">Error</span>
    </div>
  );
};

// Modal Component
const ModalComponent: React.FC = () => {
  const [isOpen, setIsOpen] = useState(true);
  
  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg"
      >
        Open Modal
      </button>
    );
  }
  
  return (
    <div className="relative">
      <motion.div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />
      <motion.div
        className="relative bg-black border border-white/10 rounded-xl p-6 max-w-md mx-auto shadow-2xl"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
      >
        <h3 className="text-xl font-semibold text-white mb-2">Modal Title</h3>
        <p className="text-white/60 mb-6">This is a modal component with animations.</p>
        <div className="flex gap-3">
          <button
            onClick={() => setIsOpen(false)}
            className="px-4 py-2 bg-green-500 hover:bg-green-600 text-black font-medium rounded-lg"
          >
            Confirm
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-medium rounded-lg"
          >
            Cancel
          </button>
        </div>
      </motion.div>
    </div>
  );
};

// ============================================
// BACKEND SCRIPTS (Code Only - No Preview)
// ============================================

const authHandlerCode = `import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, hashPassword } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password required' },
        { status: 400 }
      );
    }

    // Find user in database
    const user = await db.user.findUnique({ where: { email } });
    
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Verify password
    const isValid = await verifyPassword(password, user.passwordHash);
    
    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Generate JWT token
    const token = await generateToken({ userId: user.id });

    return NextResponse.json({
      success: true,
      user: { id: user.id, email: user.email },
      token
    });
  } catch (error) {
    console.error('Auth error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}`;

const databaseConnectionCode = `import { PrismaClient } from '@prisma/client';

declare global {
  var prisma: PrismaClient | undefined;
}

const prismaClientSingleton = () => {
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' 
      ? ['query', 'error', 'warn'] 
      : ['error'],
  });
};

export const prisma = globalThis.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = prisma;
}

// Connection test utility
export async function testConnection() {
  try {
    await prisma.$connect();
    console.log('✅ Database connected successfully');
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    return false;
  }
}

// Graceful shutdown
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});`;

const apiRouteHandlerCode = `import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/database';
import { z } from 'zod';

// Request validation schema
const createItemSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().optional(),
  price: z.number().positive(),
});

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    const items = await prisma.item.findMany({
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
    });

    const total = await prisma.item.count();

    return NextResponse.json({
      success: true,
      data: items,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch items' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = createItemSchema.parse(body);

    const item = await prisma.item.create({
      data: validatedData,
    });

    return NextResponse.json({
      success: true,
      data: item,
    }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to create item' },
      { status: 500 }
    );
  }
}`;

// ============================================
// AI PROMPTS
// ============================================

const systemPromptCode = `# SPIO OS System Prompt

You are the SPIO OS AI assistant. Your role is to help users:
- Navigate the boilerplate codebase
- Generate new components following established patterns
- Explain architecture decisions
- Provide code snippets with proper typing

## Guidelines:
1. Always use TypeScript
2. Follow existing component patterns
3. Include proper error handling
4. Use Tailwind CSS for styling
5. Prefer Framer Motion for animations
6. Maintain dark theme aesthetic

## Response Format:
- Provide clear, concise explanations
- Include code examples when relevant
- Reference existing components in the registry
- Suggest improvements when applicable`;

const componentGeneratorPromptCode = `# Component Generator Prompt

When generating components, follow this structure:

1. Define TypeScript interfaces for props
2. Use destructuring with default values
3. Include className prop for customization
4. Add motion variants if animated
5. Export as named export

## Template:

\`\`\`tsx
interface Props {
  variant?: 'default' | 'premium';
  className?: string;
}

export function MyComponent({ 
  variant = 'default',
  className = '' 
}: Props) {
  // Implementation
  return <div className={\`\${baseStyles} \${className}\`} />;
}
\`\`\`

## Styling Conventions:
- Use Tailwind CSS utility classes
- Follow BEM-like naming for custom CSS
- Maintain consistent spacing scale
- Use CSS variables for theme colors`;

// ============================================
// EXPORT REGISTRY
// ============================================

export const spioRegistry: SpioComponent[] = [
  // FRONTEND COMPONENTS
  {
    id: 'button-glow',
    title: 'Button Glow',
    category: 'Frontend',
    description: 'Interactive button with glow effect',
    codeSnippet: `const variants = {
  primary: 'bg-green-500 hover:bg-green-600 text-black shadow-lg shadow-green-500/30',
  secondary: 'bg-white/10 hover:bg-white/20 text-white',
  outline: 'border border-white/20 hover:bg-white/5 text-white',
};

<button className={\`\${baseStyles} \${variants[variant]} px-6 py-3\`}>
  Click Me
</button>`,
    componentType: ButtonGlow,
  },
  {
    id: 'card-animated',
    title: 'Card Animated',
    category: 'Frontend',
    description: 'Animated card with hover effects',
    codeSnippet: `<motion.div
  className="bg-black/50 backdrop-blur-xl border border-white/10 rounded-xl p-6"
  whileHover={{ scale: 1.02, borderColor: 'rgba(0, 255, 136, 0.5)' }}
  whileTap={{ scale: 0.98 }}
  transition={{ duration: 0.2 }}
>
  <h3 className="text-lg font-semibold text-white mb-2">Title</h3>
  <p className="text-white/60 text-sm mb-4">Description</p>
</motion.div>`,
    componentType: CardAnimated,
  },
  {
    id: 'input-field',
    title: 'Input Field',
    category: 'Frontend',
    description: 'Form input with focus states',
    codeSnippet: `<input
  className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-white/30 focus:outline-none focus:border-green-500/50 focus:ring-1 focus:ring-green-500/50"
  placeholder="Enter your email"
/>`,
    componentType: InputField,
  },
  {
    id: 'badge-status',
    title: 'Badge Status',
    category: 'Frontend',
    description: 'Status badges with color variants',
    codeSnippet: `<span className="px-3 py-1 bg-green-500/20 text-green-400 text-sm font-medium rounded-full">
  Success
</span>`,
    componentType: BadgeStatus,
  },
  {
    id: 'modal-component',
    title: 'Modal',
    category: 'Frontend',
    description: 'Animated modal dialog',
    codeSnippet: `<motion.div
  className="fixed inset-0 bg-black/80 backdrop-blur-sm"
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
>
  <motion.div
    className="relative bg-black border border-white/10 rounded-xl p-6"
    initial={{ scale: 0.9, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
  >
    <h3 className="text-xl font-semibold text-white mb-2">Modal Title</h3>
    <p className="text-white/60 mb-6">Modal content here...</p>
  </motion.div>
</motion.div>`,
    componentType: ModalComponent,
  },
  
  // BACKEND SCRIPTS
  {
    id: 'auth-handler',
    title: 'Auth Handler',
    category: 'Backend',
    description: 'JWT authentication API route',
    codeSnippet: authHandlerCode,
  },
  {
    id: 'db-connection',
    title: 'Database Connection',
    category: 'Backend',
    description: 'Prisma database connection utility',
    codeSnippet: databaseConnectionCode,
  },
  {
    id: 'api-route-handler',
    title: 'API Route Handler',
    category: 'Backend',
    description: 'RESTful API endpoint with validation',
    codeSnippet: apiRouteHandlerCode,
  },
  
  // AI PROMPTS
  {
    id: 'system-prompt',
    title: 'System Prompt',
    category: 'Prompt',
    description: 'Core AI assistant system instructions',
    codeSnippet: systemPromptCode,
  },
  {
    id: 'component-generator-prompt',
    title: 'Component Generator',
    category: 'Prompt',
    description: 'Prompt for generating new components',
    codeSnippet: componentGeneratorPromptCode,
  },
  {
    id: 'alert-banner',
    title: 'Alert Banner',
    category: 'Frontend',
    description: 'A dismissible alert banner with variant support',
    codeSnippet: `---\ntitle: Alert Banner\ndescription: A dismissible alert banner with variant support\ncategory: Frontend\n---\nimport { useState } from 'react';\nimport { motion, AnimatePresence } from 'framer-motion';\nimport { X, AlertCircle, CheckCircle, Info } from 'lucide-react';\n\ninterface AlertBannerProps {\n  variant?: 'info' | 'success' | 'warning' | 'error';\n  message: string;\n  dismissible?: boolean;\n}\n\nexport function AlertBanner({\n  variant = 'info',\n  message,\n  dismissible = true,\n}: AlertBannerProps) {\n  const [isVisible, setIsVisible] = useState(true);\n\n  const variants = {\n    info: 'bg-blue-500/20 border-blue-500/50 text-blue-400',\n    success: 'bg-green-500/20 border-green-500/50 text-green-400',\n    warning: 'bg-yellow-500/20 border-yellow-500/50 text-yellow-400',\n    error: 'bg-red-500/20 border-red-500/50 text-red-400',\n  };\n\n  const icons = {\n    info: <Info className="w-5 h-5" />,\n    success: <CheckCircle className="w-5 h-5" />,\n    warning: <AlertCircle className="w-5 h-5" />,\n    error: <AlertCircle className="w-5 h-5" />,\n  };\n\n  if (!isVisible) return null;\n\n  return (\n    <motion.div\n      initial={{ opacity: 0, y: -20 }}\n      animate={{ opacity: 1, y: 0 }}\n      exit={{ opacity: 0, y: -20 }}\n      className={\`flex items-center gap-3 p-4 rounded-lg border \${variants[variant]}\`}\n    >\n      {icons[variant]}\n      <p className="flex-1">{message}</p>\n      {dismissible && (\n        <button\n          onClick={() => setIsVisible(false)}\n          className="p-1 hover:bg-white/10 rounded transition-colors"\n        >\n          <X className="w-4 h-4" />\n        </button>\n      )}\n    </motion.div>\n  );\n}\n`,
  },
  {
    id: 'skeleton-loader',
    title: 'Skeleton Loader',
    category: 'Frontend',
    description: 'Animated loading skeleton for content placeholders',
    codeSnippet: `---\ntitle: Skeleton Loader\ndescription: Animated loading skeleton for content placeholders\ncategory: Frontend\n---\nimport { motion } from 'framer-motion';\n\ninterface SkeletonLoaderProps {\n  variant?: 'text' | 'circular' | 'rectangular';\n  width?: string | number;\n  height?: string | number;\n  className?: string;\n}\n\nexport function SkeletonLoader({\n  variant = 'text',\n  width = '100%',\n  height,\n  className = '',\n}: SkeletonLoaderProps) {\n  const baseStyles = 'bg-white/5 overflow-hidden';\n  \n  const variants = {\n    text: 'rounded h-4',\n    circular: 'rounded-full',\n    rectangular: 'rounded-lg',\n  };\n\n  const heightValue = height || (variant === 'circular' ? width : undefined);\n\n  return (\n    <motion.div\n      className={\`\${baseStyles} \${variants[variant]} \${className}\`}\n      style={{ width, height: heightValue }}\n      animate={{\n        opacity: [0.5, 1, 0.5],\n      }}\n      transition={{\n        duration: 1.5,\n        repeat: Infinity,\n        ease: 'easeInOut',\n      }}\n    />\n  );\n}\n`,
  }];

// Helper functions
export const getComponentById = (id: string): SpioComponent | undefined => {
  return [...spioRegistry, ...vaultComponents].find((comp) => comp.id === id);
};

export const getComponentsByCategory = (category: string): SpioComponent[] => {
  return [...spioRegistry, ...vaultComponents].filter((comp) => comp.category === category);
};

export const getAllCategories = (): string[] => {
  return ['Frontend', 'Backend', 'Prompt'];
};

export const getVaultComponentCount = (): number => {
  return vaultComponents.length;
};

export default [...spioRegistry, ...vaultComponents];
