// reap.js
const fs = require('fs');
const path = require('path');

// The file where all your code will be compiled
const OUTPUT_FILE = 'reaped-codebase.md';

// Default target if none is passed via CLI arg.
// Can be a single file OR a directory (in which case it walks just that dir).
const TARGET_FILE = './frontend/app/dashboard/video/[id]/page.tsx';

// Directories to completely ignore when the target is a directory
const IGNORE_DIRS = [
  'node_modules',
  '.git',
  '.next',
  'dist',
  'build',
  'out',
  '.claude',
  '.verify-shots',
  '__pycache__',
  'venv',
  '.venv'
];

// File extensions to ignore (binaries, images, model weights, heavy lockfiles)
const IGNORE_EXTS = [
  '.png', '.jpg', '.jpeg', '.gif', '.svg', '.ico',
  '.mp4', '.webm', '.pdf', '.zip', '.tar', '.gz',
  '.log',
  // ML model weights / checkpoints — these are large binaries, never source
  '.pt', '.pth', '.onnx', '.h5', '.pb', '.tflite', '.engine', '.bin', '.safetensors'
];

// Specific files to ignore
const IGNORE_FILES = [
  'package-lock.json',
  'yarn.lock',
  'pnpm-lock.yaml',
  OUTPUT_FILE,
  'reap.js',
  'tree.js'
];

// Hard size cap as a backstop for anything not caught by extension (bytes).
// Anything bigger than this is skipped and noted, not embedded.
const MAX_FILE_SIZE = 512 * 1024; // 512 KB

function shouldIgnore(filePath, isDir) {
  const baseName = path.basename(filePath);

  if (isDir && IGNORE_DIRS.includes(baseName)) return true;
  if (!isDir && IGNORE_FILES.includes(baseName)) return true;

  const ext = path.extname(baseName).toLowerCase();
  if (!isDir && IGNORE_EXTS.includes(ext)) return true;

  return false;
}

function walk(dir, fileList = []) {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (shouldIgnore(filePath, stat.isDirectory())) {
      continue;
    }

    if (stat.isDirectory()) {
      walk(filePath, fileList);
    } else {
      fileList.push(filePath);
    }
  }

  return fileList;
}

function getLang(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const map = {
    '.ts': 'typescript',
    '.tsx': 'tsx',
    '.js': 'javascript',
    '.jsx': 'jsx',
    '.py': 'python',
    '.json': 'json',
    '.md': 'markdown',
    '.css': 'css',
    '.html': 'html',
    '.rules': 'javascript' // For firestore.rules
  };
  return map[ext] || '';
}

function reap() {
  const rootDir = __dirname;

  // Accept a target path from the command line: `node reap.js path/to/file.ts`
  const cliArg = process.argv[2];
  const targetPath = path.resolve(rootDir, cliArg || TARGET_FILE);

  if (!fs.existsSync(targetPath)) {
    console.error(`❌ Target not found: ${targetPath}`);
    process.exit(1);
  }

  const stat = fs.statSync(targetPath);
  let filesToReap = [];

  if (stat.isDirectory()) {
    console.log(`Gathering files from directory: ${targetPath}`);
    filesToReap = walk(targetPath);
  } else {
    console.log(`Gathering single file: ${targetPath}`);
    filesToReap = [targetPath];
  }

  let outputContent = '# EstateVision Codebase (single-file reap)\n\n';
  let skippedLarge = [];

  for (const file of filesToReap) {
    const relativePath = path.relative(rootDir, file);
    try {
      const size = fs.statSync(file).size;
      if (size > MAX_FILE_SIZE) {
        skippedLarge.push(`${relativePath} (${(size / 1024).toFixed(0)} KB)`);
        continue;
      }

      const content = fs.readFileSync(file, 'utf8');
      outputContent += `### File: \`${relativePath}\`\n\n`;
      outputContent += '```' + getLang(file) + '\n';
      outputContent += content + '\n';
      outputContent += '```\n\n';
    } catch (err) {
      console.warn(`Could not read ${relativePath}:`, err.message);
    }
  }

  fs.writeFileSync(OUTPUT_FILE, outputContent);
  console.log(`✅ Successfully reaped ${filesToReap.length - skippedLarge.length} file(s) into ${OUTPUT_FILE}`);
  if (skippedLarge.length) {
    console.log(`⏭️  Skipped ${skippedLarge.length} large file(s):`);
    skippedLarge.forEach((f) => console.log(`   - ${f}`));
  }
}

reap();