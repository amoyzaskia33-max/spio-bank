/**
 * SPIO Vault Scanner Utility
 * Scans vault-data folder and returns component metadata
 * Server-side only - uses Node.js fs module
 */

import fs from 'fs';
import path from 'path';

const VAULT_DIR = path.join(process.cwd(), 'src', 'vault-data');

export interface VaultComponent {
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

const CATEGORIES = {
  frontend: 'Frontend',
  backend: 'Backend',
  prompt: 'Prompt',
} as const;

/**
 * Extract metadata from file content using regex
 */
function extractMetadata(content: string, fileName: string): {
  title: string;
  description: string;
  componentName: string;
} {
  let title = fileName.replace(/([A-Z])/g, ' $1').trim();
  let description = `Component from ${fileName}`;
  let componentName = fileName;

  // Try to extract from JSDoc @description
  const jsdocMatch = content.match(/\/\*\*[\s\S]*?\*\//);
  if (jsdocMatch) {
    const jsdoc = jsdocMatch[0];

    // Extract @description
    const descMatch = jsdocMatch[0].match(/@description\s+([^*\n]+)/);
    if (descMatch) {
      description = descMatch[1].trim();
    }

    // Extract title from first line of JSDoc if it looks like a title
    const regexPattern = new RegExp('^[ \\t]*\\*[ ?]', '');
    const lines = jsdoc.split('\n').map(l => l.replace(regexPattern, '').trim());
    const firstLine = lines.find(l => l && !l.startsWith('/') && !l.startsWith('@'));
    if (firstLine && firstLine.length < 50) {
      title = firstLine;
    }
    
    // Try to find component name from const declaration
    const constMatch = content.match(/const\s+(\w+)\s*[:=]\s*(?:React\.FC|:?\s*React\.ReactElement|:?\s*\()/);
    if (constMatch) {
      componentName = constMatch[1];
    }
    
    // Extract from export default function
    const exportMatch = content.match(/export\s+default\s+function\s+(\w+)/);
    if (exportMatch) {
      componentName = exportMatch[1];
    }
  }

  // Fallback: try to find component name from file
  if (!componentName) {
    // Simple regex to find function/const name
    const simpleMatch = content.match(/(?:export\s+)?(?:default\s+)?(?:function|const)\s+([A-Z]\w*)/);
    if (simpleMatch) {
      componentName = simpleMatch[1];
    }
  }

  return { title, description, componentName };
}

/**
 * Generate code snippet from file content
 */
function generateCodeSnippet(content: string, category: string, componentName: string): string {
  if (category === 'Frontend') {
    // Try to extract props interface
    const propsMatch = content.match(/interface\s+(\w+Props)\s*\{([\s\S]*?)\}/);
    let propsExample = '';
    
    if (propsMatch) {
      const propsContent = propsMatch[2];
      const propLines = propsContent.split('\n')
        .filter(line => line.includes(':') && !line.trim().startsWith('//'))
        .slice(0, 5);
      
      if (propLines.length > 0) {
        propsExample = propLines.map(line => {
          const [propName] = line.split(':');
          return `  ${propName.trim()}={/* value */}`;
        }).join('\n');
      }
    }
    
    return `import ${componentName} from '@/vault-data/frontend/${componentName}';

<${componentName}
${propsExample || '  /* Add props */'}
/>`;
  }
  
  if (category === 'Backend') {
    return `import { ${componentName} } from '@/vault-data/backend/${componentName}';

// Usage
const result = await ${componentName}();`;
  }
  
  return `# ${componentName}

${content.slice(0, 500)}...`;
}

/**
 * Scan a single file and return component metadata
 */
function scanFile(filePath: string, category: string): VaultComponent | null {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const fileName = path.basename(filePath).replace(/\.(tsx|ts|md)$/, '');
    const { title, description, componentName } = extractMetadata(content, fileName);
    
    const id = `vault-${fileName.replace(/([A-Z])/g, '-$1').toLowerCase().replace(/^-/, '')}`;
    const codeSnippet = generateCodeSnippet(content, category, componentName);
    
    return {
      id,
      title,
      category: category as 'Frontend' | 'Backend' | 'Prompt',
      description,
      codeSnippet,
      fileName,
      filePath: filePath.replace(process.cwd(), ''),
      isLive: category === 'frontend',
      tags: [fileName.toLowerCase(), category.toLowerCase()],
    };
  } catch (error) {
    console.error(`Error scanning file ${filePath}:`, error);
    return null;
  }
}

/**
 * Scan entire vault directory
 */
export function scanVault(): VaultComponent[] {
  const components: VaultComponent[] = [];
  
  if (!fs.existsSync(VAULT_DIR)) {
    console.warn('Vault directory not found:', VAULT_DIR);
    return components;
  }
  
  for (const [folder, category] of Object.entries(CATEGORIES)) {
    const categoryDir = path.join(VAULT_DIR, folder);
    
    if (!fs.existsSync(categoryDir)) {
      continue;
    }
    
    const files = fs.readdirSync(categoryDir)
      .filter(f => f.endsWith('.tsx') || f.endsWith('.ts') || f.endsWith('.md'));
    
    for (const file of files) {
      const filePath = path.join(categoryDir, file);
      const component = scanFile(filePath, category);
      
      if (component) {
        components.push(component);
      }
    }
  }
  
  return components;
}

/**
 * Get component count by category
 */
export function getVaultStats() {
  const components = scanVault();
  
  return {
    total: components.length,
    frontend: components.filter(c => c.category === 'Frontend').length,
    backend: components.filter(c => c.category === 'Backend').length,
    prompt: components.filter(c => c.category === 'Prompt').length,
  };
}
