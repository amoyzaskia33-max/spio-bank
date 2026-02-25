#!/usr/bin/env node

/**
 * SPIO Vault Scanner
 * Scans /src/vault-data/ folder and generates index.ts automatically
 */

const fs = require('fs');
const path = require('path');

const VAULT_DIR = path.join(__dirname, '..', 'src', 'vault-data');
const OUTPUT_FILE = path.join(VAULT_DIR, 'index.ts');

const CATEGORIES = {
  frontend: 'Frontend',
  backend: 'Backend',
  prompt: 'Prompt',
};

/**
 * Extract component metadata from file content
 */
function extractMetadata(filePath, fileName) {
  const content = fs.readFileSync(filePath, 'utf-8');
  
  // Try to extract description from JSDoc
  const jsdocMatch = content.match(/\/\*\*[\s\S]*?\*\/\s*const\s+\w+/);
  let description = `Auto-imported component from ${fileName}`;
  
  if (jsdocMatch) {
    const jsdoc = jsdocMatch[0];
    const descMatch = jsdoc.match(/@description\s+([^*\n]+)/);
    if (descMatch) {
      description = descMatch[1].trim();
    } else {
      // Get first paragraph of JSDoc
      const lines = jsdoc.split('\n');
      const descLines = lines
        .filter(line => !line.includes('*') && line.trim() && !line.includes('@'))
        .map(line => line.replace(/\/\*\*|\*\//g, '').trim())
        .filter(line => line.length > 0);
      if (descLines.length > 0) {
        description = descLines[0];
      }
    }
  }

  // Extract component name from file
  const componentNameMatch = content.match(/const\s+(\w+)\s*[:=]/);
  const componentName = componentNameMatch ? componentNameMatch[1] : fileName;

  // Extract props interface if exists
  const propsInterface = content.match(/interface\s+(\w+Props)/);
  const hasProps = !!propsInterface;

  return {
    componentName,
    description,
    hasProps,
  };
}

/**
 * Generate code snippet example
 */
function generateCodeSnippet(fileName, categoryName, metadata) {
  const importName = metadata.componentName;
  const kebabName = fileName.replace(/([A-Z])/g, '-$1').toLowerCase().replace(/^-/, '');
  
  if (categoryName === 'Frontend') {
    return `import ${importName} from '@/vault-data/frontend/${fileName}';

<${importName}
  /* Add props based on component interface */
/>`;
  } else if (categoryName === 'Backend') {
    return `import { ${importName} } from '@/vault-data/backend/${fileName}';

// Usage example
const result = await ${importName}();`;
  } else {
    return `# ${metadata.componentName}

${metadata.description}

// View the full prompt in the component file`;
  }
}

/**
 * Scan vault folder and generate index
 */
function scanVault() {
  console.log('🔍 Scanning vault-data folder...\n');
  
  const components = [];
  const imports = [];
  
  // Read category folders
  for (const [folder, category] of Object.entries(CATEGORIES)) {
    const categoryDir = path.join(VAULT_DIR, folder);
    
    if (!fs.existsSync(categoryDir)) {
      console.log(`⚠️  Folder not found: ${folder}/`);
      continue;
    }
    
    const files = fs.readdirSync(categoryDir).filter(f => f.endsWith('.tsx') || f.endsWith('.ts') || f.endsWith('.md'));
    
    if (files.length === 0) {
      console.log(`📁 ${folder}/ (empty)`);
      continue;
    }
    
    console.log(`📁 ${folder}/`);
    
    for (const file of files) {
      const fileName = file.replace(/\.(tsx|ts|md)$/, '');
      const filePath = path.join(categoryDir, file);
      
      console.log(`   └── ${file}`);
      
      const metadata = extractMetadata(filePath, fileName);
      const componentId = `vault-${fileName.replace(/([A-Z])/g, '-$1').toLowerCase().replace(/^-/, '')}`;
      const importPath = `@/vault-data/${folder}/${fileName}`;
      
      // Generate import statement
      if (folder === 'backend') {
        imports.push(`import { ${metadata.componentName} } from '${importPath}';`);
      } else {
        imports.push(`import ${metadata.componentName} from '${importPath}';`);
      }
      
      // Generate component object
      const snippet = generateCodeSnippet(fileName, category, metadata);
      
      components.push(`  {
    id: '${componentId}',
    title: '${metadata.componentName.replace(/([A-Z])/g, ' $1').trim()}',
    category: '${category}',
    description: '${metadata.description.replace(/'/g, "\\'")}',
    codeSnippet: \`${snippet}\`,
    componentType: ${metadata.componentName},
    isLive: ${category === 'Frontend' ? 'true' : 'false'},
    tags: ['${fileName.toLowerCase()}', '${category.toLowerCase()}'],
  }`);
    }
    
    console.log('');
  }
  
  // Generate index.ts content
  const indexContent = `/**
 * SPIO Vault Data Index
 * Auto-generated from /src/vault-data/ folder
 * DO NOT EDIT MANUALLY - Run 'npm run sync-vault' to regenerate
 * Generated at: ${new Date().toISOString()}
 */

import type { SpioComponent } from '@/data/spio-registry';

${imports.join('\n')}

export const vaultComponents: SpioComponent[] = [
${components.join(',\n')}
];

/**
 * Get all vault components
 */
export function getVaultComponents(): SpioComponent[] {
  return vaultComponents;
}

/**
 * Get component by ID from vault
 */
export function getVaultComponentById(id: string): SpioComponent | undefined {
  return vaultComponents.find(comp => comp.id === id);
}
`;

  // Write index.ts
  fs.writeFileSync(OUTPUT_FILE, indexContent);
  
  console.log(`✅ Generated ${OUTPUT_FILE}`);
  console.log(`📦 Total components: ${components.length}\n`);
}

// Run scanner
scanVault();
