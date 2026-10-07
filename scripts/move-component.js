#!/usr/bin/env node

/**
 * Drive Partners Component Relocator Utility
 * 
 * Usage:
 *   node scripts/move-component.js <ComponentNameOrPath> <TargetDirectory> [--dry-run]
 * 
 * Examples:
 *   node scripts/move-component.js VehicleCheckApp src/components/inspections
 *   node scripts/move-component.js src/components/safety/DriverSafetyShieldHub.tsx src/components/driver/safety --dry-run
 */

const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
const isDryRun = args.includes('--dry-run');
const cleanArgs = args.filter(a => a !== '--dry-run');

if (cleanArgs.length < 2) {
  console.log(`
Drive Partners Component Relocator Utility
==========================================
Usage:
  node scripts/move-component.js <ComponentNameOrPath> <TargetDirectory> [--dry-run]

Arguments:
  ComponentNameOrPath : Component name (e.g. VehicleCheckApp) or path
  TargetDirectory     : Destination directory (e.g. src/components/driver)
  --dry-run           : Preview changes without modifying files
`);
  process.exit(1);
}

const sourceInput = cleanArgs[0];
const targetDirInput = cleanArgs[1];
const projectRoot = path.resolve(__dirname, '..');

// Helper to find all .ts and .tsx files
function getAllSourceFiles(dir) {
  let results = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name === 'node_modules' || entry.name === '.next' || entry.name === '.git') continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results = results.concat(getAllSourceFiles(fullPath));
    } else if (entry.name.endsWith('.ts') || entry.name.endsWith('.tsx')) {
      results.push(fullPath);
    }
  }
  return results;
}

// 1. Locate source component file
let sourcePath = null;
if (fs.existsSync(path.resolve(projectRoot, sourceInput))) {
  sourcePath = path.resolve(projectRoot, sourceInput);
} else {
  // Search for component by name in src/components
  const allFiles = getAllSourceFiles(path.resolve(projectRoot, 'src'));
  const baseName = sourceInput.replace(/\.(tsx|ts)$/, '');
  for (const f of allFiles) {
    const fBase = path.basename(f).replace(/\.(tsx|ts)$/, '');
    if (fBase.toLowerCase() === baseName.toLowerCase()) {
      sourcePath = f;
      break;
    }
  }
}

if (!sourcePath || !fs.existsSync(sourcePath)) {
  console.error(`❌ Source component "${sourceInput}" not found in project.`);
  process.exit(1);
}

const componentFileName = path.basename(sourcePath);
const componentBaseName = componentFileName.replace(/\.(tsx|ts)$/, '');
const targetDirPath = path.resolve(projectRoot, targetDirInput);
const targetFilePath = path.join(targetDirPath, componentFileName);

if (sourcePath === targetFilePath) {
  console.log(`⚠️ Source and target paths are identical: ${sourcePath}`);
  process.exit(0);
}

console.log(`\n========================================`);
console.log(`Moving Component: ${componentFileName}`);
console.log(`From: ${path.relative(projectRoot, sourcePath)}`);
console.log(`To:   ${path.relative(projectRoot, targetFilePath)}`);
if (isDryRun) console.log(`[DRY RUN MODE - No files will be modified]`);
console.log(`========================================\n`);

// Calculate old and new alias paths
const oldRelFromSrc = path.relative(path.resolve(projectRoot, 'src'), sourcePath).replace(/\\/g, '/').replace(/\.(tsx|ts)$/, '');
const newRelFromSrc = path.relative(path.resolve(projectRoot, 'src'), targetFilePath).replace(/\\/g, '/').replace(/\.(tsx|ts)$/, '');

const oldAlias = `@/${oldRelFromSrc}`;
const newAlias = `@/${newRelFromSrc}`;

console.log(`Old Import Alias: ${oldAlias}`);
console.log(`New Import Alias: ${newAlias}\n`);

// 2. Scan and find all import references across codebase
const allSourceFiles = getAllSourceFiles(path.resolve(projectRoot, 'src'));
const filesToUpdate = [];

for (const filePath of allSourceFiles) {
  if (filePath === sourcePath) continue;
  const content = fs.readFileSync(filePath, 'utf8');

  // Check alias imports
  const aliasRegex = new RegExp(`from\\s+['"]${oldAlias}['"]|import\\s*\\(['"]${oldAlias}['"]\\)`, 'g');
  
  // Check relative imports
  const dirOfFile = path.dirname(filePath);
  const oldRelative = path.relative(dirOfFile, sourcePath).replace(/\\/g, '/').replace(/\.(tsx|ts)$/, '');
  const oldRelPath = oldRelative.startsWith('.') ? oldRelative : `./${oldRelative}`;
  const relRegex = new RegExp(`from\\s+['"]${oldRelPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}['"]|import\\s*\\(['"]${oldRelPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}['"]\\)`, 'g');

  if (aliasRegex.test(content) || relRegex.test(content) || content.includes(oldAlias)) {
    filesToUpdate.push({
      filePath,
      oldRelPath
    });
  }
}

console.log(`Found ${filesToUpdate.length} file(s) importing this component:`);
filesToUpdate.forEach(f => console.log(`  - ${path.relative(projectRoot, f.filePath)}`));

if (!isDryRun) {
  // 3. Move file
  if (!fs.existsSync(targetDirPath)) {
    fs.mkdirSync(targetDirPath, { recursive: true });
  }
  fs.renameSync(sourcePath, targetFilePath);
  console.log(`\n✓ Moved file to ${path.relative(projectRoot, targetFilePath)}`);

  // 4. Update imports
  let updatedCount = 0;
  for (const { filePath, oldRelPath } of filesToUpdate) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Replace alias imports
    content = content.replace(new RegExp(oldAlias, 'g'), newAlias);
    
    // Replace relative imports with new alias or new relative
    const dirOfFile = path.dirname(filePath);
    let newRelative = path.relative(dirOfFile, targetFilePath).replace(/\\/g, '/').replace(/\.(tsx|ts)$/, '');
    if (!newRelative.startsWith('.')) newRelative = `./${newRelative}`;
    content = content.replace(new RegExp(`(['"])${oldRelPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(['"])`, 'g'), `$1${newAlias}$2`);

    fs.writeFileSync(filePath, content, 'utf8');
    updatedCount++;
  }
  console.log(`✓ Updated import references in ${updatedCount} file(s).`);

  // 5. Update index.ts if needed
  const indexTsPath = path.resolve(projectRoot, 'src/components/index.ts');
  if (fs.existsSync(indexTsPath)) {
    let indexContent = fs.readFileSync(indexTsPath, 'utf8');
    if (indexContent.includes(componentBaseName)) {
      const oldExportRel = `./${path.relative(path.resolve(projectRoot, 'src/components'), sourcePath).replace(/\\/g, '/').replace(/\.(tsx|ts)$/, '')}`;
      const newExportRel = `./${path.relative(path.resolve(projectRoot, 'src/components'), targetFilePath).replace(/\\/g, '/').replace(/\.(tsx|ts)$/, '')}`;
      indexContent = indexContent.replace(oldExportRel, newExportRel);
      fs.writeFileSync(indexTsPath, indexContent, 'utf8');
      console.log(`✓ Updated exports in src/components/index.ts`);
    }
  }

  console.log(`\n🎉 Component move completed successfully!`);
} else {
  console.log(`\nDry run completed. Re-run without --dry-run to apply changes.`);
}
