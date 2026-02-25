/**
 * SPIO OS Librarian
 * Automated Boilerplate Entry System
 * 
 * Scans /vault/raw-experiments for new files,
 * parses metadata, updates spio-registry.tsx,
 * and archives processed files.
 */

const fs = require('fs');
const path = require('path');

// ============================================
// CONFIGURATION
// ============================================

const CONFIG = {
  vaultRaw: path.join(__dirname, '..', 'vault', 'raw-experiments'),
  vaultArchived: path.join(__dirname, '..', 'vault', 'archived-experiments'),
  registryPath: path.join(__dirname, '..', 'src', 'data', 'spio-registry.tsx'),
  supportedExtensions: ['.tsx', '.ts', '.js', '.jsx', '.txt', '.md'],
};

// ============================================
// METADATA PARSING
// ============================================

/**
 * Parse metadata from file content or filename
 * Looks for YAML-like frontmatter or uses smart defaults
 */
function parseMetadata(filePath, content) {
  const fileName = path.basename(filePath);
  const fileNameNoExt = path.parse(fileName).name;
  const ext = path.extname(fileName).toLowerCase();

  // Determine category from file extension and path
  let category = 'Frontend';
  if (ext === '.txt' || ext === '.md') {
    category = 'Prompt';
  } else if (fileName.toLowerCase().includes('api') || 
             fileName.toLowerCase().includes('db') || 
             fileName.toLowerCase().includes('auth') ||
             fileName.toLowerCase().includes('route') ||
             ext === '.ts' && !fileName.toLowerCase().includes('component')) {
    category = 'Backend';
  }

  // Try to extract metadata from frontmatter (--- blocks)
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
  let metadata = {
    title: toTitleCase(fileNameNoExt),
    description: `Auto-imported from ${fileName}`,
    category: category,
  };

  if (frontmatterMatch) {
    const frontmatter = frontmatterMatch[1];
    
    // Parse title
    const titleMatch = frontmatter.match(/title:\s*(.+)/i);
    if (titleMatch) {
      metadata.title = titleMatch[1].trim().replace(/['"]/g, '');
    }

    // Parse description
    const descMatch = frontmatter.match(/description:\s*(.+)/i);
    if (descMatch) {
      metadata.description = descMatch[1].trim().replace(/['"]/g, '');
    }

    // Parse category
    const catMatch = frontmatter.match(/category:\s*(.+)/i);
    if (catMatch) {
      const catValue = catMatch[1].trim().toLowerCase();
      if (catValue.includes('backend')) metadata.category = 'Backend';
      else if (catValue.includes('prompt')) metadata.category = 'Prompt';
      else metadata.category = 'Frontend';
    }
  }

  // Smart title extraction from component name
  if (ext === '.tsx' || ext === '.jsx') {
    const componentNameMatch = content.match(/(?:export\s+)?(?:function|const)\s+([A-Z][a-zA-Z0-9]*)/);
    if (componentNameMatch && !frontmatterMatch) {
      metadata.title = toTitleCase(componentNameMatch[1]);
    }
  }

  return metadata;
}

/**
 * Convert string to Title Case
 */
function toTitleCase(str) {
  return str
    .replace(/[-_]/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/\s+/g, ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

/**
 * Escape code snippet for TypeScript string literal
 */
function escapeCodeSnippet(code) {
  return code
    .replace(/\\/g, '\\\\')
    .replace(/`/g, '\\`')
    .replace(/\$\{/g, '\\${')
    .replace(/\r\n/g, '\\n')
    .replace(/\n/g, '\\n')
    .replace(/\t/g, '  ');
}

/**
 * Generate unique ID from title
 */
function generateId(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// ============================================
// REGISTRY MANIPULATION
// ============================================

/**
 * Read current registry content
 */
function readRegistry() {
  if (!fs.existsSync(CONFIG.registryPath)) {
    throw new Error('Registry file not found: ' + CONFIG.registryPath);
  }
  return fs.readFileSync(CONFIG.registryPath, 'utf-8');
}

/**
 * Write updated registry content
 */
function writeRegistry(content) {
  fs.writeFileSync(CONFIG.registryPath, content, 'utf-8');
}

/**
 * Add new entry to registry
 */
function addEntryToRegistry(entry) {
  const registryContent = readRegistry();
  
  // Generate the new entry code
  const entryCode = generateEntryCode(entry);
  
  // Find the spioRegistry array and insert the new entry
  // Look for "export const spioRegistry: SpioComponent[] = ["
  const registryStartMarker = 'export const spioRegistry: SpioComponent[] = [';
  const registryStartIndex = registryContent.indexOf(registryStartMarker);
  
  if (registryStartIndex === -1) {
    throw new Error('Could not find spioRegistry array in registry file');
  }

  // Find the closing bracket of the array
  // We need to find the last ] before the helper functions
  const arrayContentStart = registryStartIndex + registryStartMarker.length;
  
  // Find the position to insert (before the closing bracket)
  // Look for the pattern where the array ends
  const insertPosition = findArrayEndPosition(registryContent, arrayContentStart);
  
  if (insertPosition === -1) {
    throw new Error('Could not find end of spioRegistry array');
  }

  // Build the new content
  const beforeInsert = registryContent.substring(0, insertPosition);
  const afterInsert = registryContent.substring(insertPosition);

  // Check if we need a comma - look at the content before the insert position
  // We need a comma if there's already content in the array (not just the opening bracket)
  const arrayContent = beforeInsert.substring(registryStartIndex + registryStartMarker.length).trim();
  const needsComma = arrayContent.length > 0 && !arrayContent.endsWith(',');
  
  const newContent = beforeInsert + (needsComma ? ',\n' : '\n') + entryCode + afterInsert;
  
  writeRegistry(newContent);
  return true;
}

/**
 * Generate TypeScript code for a new registry entry
 */
function generateEntryCode(entry) {
  const escapedCode = escapeCodeSnippet(entry.codeSnippet);
  const hasComponent = entry.category === 'Frontend' && !entry.isExternalFile;
  
  let code = `  {
    id: '${entry.id}',
    title: '${entry.title}',
    category: '${entry.category}',
    description: '${entry.description}',`;
  
  if (hasComponent) {
    code += `
    // Note: Component type needs manual addition
    // componentType: ${entry.title.replace(/\s+/g, '')},`;
  }
  
  code += `
    codeSnippet: \`${escapedCode}\`,
  }`;
  
  return code;
}

/**
 * Find the position where the spioRegistry array ends
 */
function findArrayEndPosition(content, startPos) {
  let bracketCount = 0;
  let inString = false;
  let stringChar = '';
  let i = startPos;
  
  while (i < content.length) {
    const char = content[i];
    const prevChar = i > 0 ? content[i - 1] : '';
    
    // Handle string literals
    if ((char === '"' || char === "'" || char === '`') && prevChar !== '\\') {
      if (!inString) {
        inString = true;
        stringChar = char;
      } else if (char === stringChar) {
        inString = false;
      }
    }
    
    if (!inString) {
      if (char === '[') {
        bracketCount++;
      } else if (char === ']') {
        if (bracketCount === 0) {
          return i;
        }
        bracketCount--;
      }
    }
    
    i++;
  }
  
  return -1;
}

// ============================================
// FILE OPERATIONS
// ============================================

/**
 * Scan raw-experiments directory for new files
 */
function scanForNewFiles() {
  if (!fs.existsSync(CONFIG.vaultRaw)) {
    console.log('⚠️  Raw experiments directory does not exist. Creating it...');
    fs.mkdirSync(CONFIG.vaultRaw, { recursive: true });
    return [];
  }

  const files = fs.readdirSync(CONFIG.vaultRaw)
    .filter(file => {
      const ext = path.extname(file).toLowerCase();
      return CONFIG.supportedExtensions.includes(ext);
    })
    .map(file => ({
      name: file,
      path: path.join(CONFIG.vaultRaw, file),
      ext: path.extname(file).toLowerCase(),
    }));

  return files;
}

/**
 * Read file content
 */
function readFileContent(filePath) {
  return fs.readFileSync(filePath, 'utf-8');
}

/**
 * Move file to archived directory
 */
function archiveFile(fileName) {
  const sourcePath = path.join(CONFIG.vaultRaw, fileName);
  const destPath = path.join(CONFIG.vaultArchived, fileName);
  
  // Ensure archived directory exists
  if (!fs.existsSync(CONFIG.vaultArchived)) {
    fs.mkdirSync(CONFIG.vaultArchived, { recursive: true });
  }
  
  // Handle name conflicts
  let finalDestPath = destPath;
  let counter = 1;
  while (fs.existsSync(finalDestPath)) {
    const parsed = path.parse(fileName);
    finalDestPath = path.join(
      CONFIG.vaultArchived, 
      `${parsed.name}-${counter}${parsed.ext}`
    );
    counter++;
  }
  
  fs.renameSync(sourcePath, finalDestPath);
  console.log(`📁 Archived: ${fileName} → ${path.basename(finalDestPath)}`);
}

// ============================================
// MAIN EXECUTION
// ============================================

function runLibrarian() {
  console.log('🤖 SPIO OS Librarian - Starting...\n');
  
  // Scan for new files
  const newFiles = scanForNewFiles();
  
  if (newFiles.length === 0) {
    console.log('✅ No new files found in vault/raw-experiments');
    console.log('💡 Drop .tsx, .ts, .js, .jsx, .txt, or .md files to sync them\n');
    return;
  }
  
  console.log(`📂 Found ${newFiles.length} new file(s)\n`);
  
  let successCount = 0;
  let errorCount = 0;
  
  for (const file of newFiles) {
    try {
      console.log(`📄 Processing: ${file.name}`);
      
      // Read file content
      const content = readFileContent(file.path);
      
      // Parse metadata
      const metadata = parseMetadata(file.path, content);
      
      // Generate entry
      const entry = {
        id: generateId(metadata.title),
        title: metadata.title,
        description: metadata.description,
        category: metadata.category,
        codeSnippet: content,
        isExternalFile: true,
      };
      
      // Check for duplicate ID
      const registryContent = readRegistry();
      if (registryContent.includes(`id: '${entry.id}'`)) {
        console.log(`⚠️  Skipping: Entry with ID '${entry.id}' already exists`);
        errorCount++;
        continue;
      }
      
      // Add to registry
      addEntryToRegistry(entry);
      console.log(`✨ Added to registry: ${entry.title} (${entry.category})`);
      
      // Archive the file
      archiveFile(file.name);
      
      successCount++;
      console.log('');
      
    } catch (error) {
      console.error(`❌ Error processing ${file.name}: ${error.message}\n`);
      errorCount++;
    }
  }
  
  // Summary
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`📊 Summary: ${successCount} success, ${errorCount} errors`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  
  if (successCount > 0) {
    console.log('💡 Remember to add componentType imports for Frontend components');
    console.log('   in spio-registry.tsx if you want live previews in UI Canvas\n');
  }
}

// Run if executed directly
if (require.main === module) {
  runLibrarian();
}

module.exports = { runLibrarian, parseMetadata, generateId };
