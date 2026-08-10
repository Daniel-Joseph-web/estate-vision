// tree.js — prints just the folder/file structure, no file contents.
const fs = require('fs');
const path = require('path');

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

const IGNORE_FILES = [
  'package-lock.json',
  'yarn.lock',
  'pnpm-lock.yaml'
];

function shouldSkip(name, isDir) {
  if (isDir) return IGNORE_DIRS.includes(name);
  return IGNORE_FILES.includes(name);
}

function printTree(dir, prefix = '') {
  const entries = fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((entry) => !shouldSkip(entry.name, entry.isDirectory()))
    // directories first, then alphabetical
    .sort((a, b) => {
      if (a.isDirectory() !== b.isDirectory()) return a.isDirectory() ? -1 : 1;
      return a.name.localeCompare(b.name);
    });

  entries.forEach((entry, index) => {
    const isLast = index === entries.length - 1;
    const connector = isLast ? '└── ' : '├── ';
    const fullPath = path.join(dir, entry.name);

    console.log(prefix + connector + entry.name + (entry.isDirectory() ? '/' : ''));

    if (entry.isDirectory()) {
      const nextPrefix = prefix + (isLast ? '    ' : '│   ');
      printTree(fullPath, nextPrefix);
    }
  });
}

function main() {
  const rootDir = __dirname;
  const target = process.argv[2] ? path.resolve(rootDir, process.argv[2]) : rootDir;

  console.log(path.basename(target) + '/');
  printTree(target);
}

main();