#!/usr/bin/env node
/**
 * DJMaster Academy — Project Statistics
 * Generates a comprehensive overview of the project.
 */

import { readdirSync, statSync, readFileSync } from 'fs';
import { join, extname } from 'path';

const ROOT = process.cwd();

function walk(dir, results = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (entry === '.git' || entry === 'node_modules') continue;
    if (statSync(full).isDirectory()) {
      walk(full, results);
    } else {
      results.push(full);
    }
  }
  return results;
}

function countLines(file) {
  try {
    return readFileSync(file, 'utf-8').split('\n').length;
  } catch {
    return 0;
  }
}

const allFiles = walk(ROOT);
const textExts = new Set(['.md', '.json', '.yaml', '.yml', '.html', '.js', '.mjs', '.css', '.ts']);

const stats = {
  total: allFiles.length,
  byExt: {},
  totalLines: 0,
  courses: 0,
  modules: 0,
  lessons: 0,
  exercises: 0,
  quizzes: 0,
  tools: 0,
  docs: 0,
};

for (const file of allFiles) {
  const ext = extname(file) || '(no ext)';
  stats.byExt[ext] = (stats.byExt[ext] || 0) + 1;

  if (textExts.has(ext)) {
    stats.totalLines += countLines(file);
  }

  if (file.includes('01-courses/') && file.match(/01-courses\/[^/]+$/) && statSync(join(ROOT, '01-courses')).isDirectory()) {
    // count via patterns
  }
  if (file.endsWith('module.yaml')) stats.modules++;
  if (file.includes('/lessons/') && file.endsWith('.md')) stats.lessons++;
  if (file.includes('/exercises/') && file.endsWith('.md')) stats.exercises++;
  if (file.endsWith('quiz.json')) stats.quizzes++;
  if (file.includes('02-tools/') && file.endsWith('.html')) stats.tools++;
  if (file.includes('00-docs/') && file.endsWith('.md')) stats.docs++;
}

// Count courses (top-level dirs in 01-courses, excluding _schema)
try {
  stats.courses = readdirSync(join(ROOT, '01-courses'))
    .filter(d => !d.startsWith('_') && !d.endsWith('.md') && statSync(join(ROOT, '01-courses', d)).isDirectory())
    .length;
} catch { /* */ }

console.log(`
╔══════════════════════════════════════════╗
║      DJMaster Academy — Statistics       ║
╠══════════════════════════════════════════╣
║  📁 Total files:     ${String(stats.total).padStart(6)}             ║
║  📝 Total lines:     ${String(stats.totalLines).padStart(6)}             ║
║                                          ║
║  📚 Courses:         ${String(stats.courses).padStart(6)}             ║
║  📦 Modules:         ${String(stats.modules).padStart(6)}             ║
║  📖 Lessons:         ${String(stats.lessons).padStart(6)}             ║
║  ✏️  Exercises:       ${String(stats.exercises).padStart(6)}             ║
║  ❓ Quizzes:         ${String(stats.quizzes).padStart(6)}             ║
║  🔧 Tools (HTML):    ${String(stats.tools).padStart(6)}             ║
║  📄 Docs:            ${String(stats.docs).padStart(6)}             ║
╠══════════════════════════════════════════╣
║  Files by extension:                     ║`);

const sorted = Object.entries(stats.byExt).sort((a, b) => b[1] - a[1]);
for (const [ext, count] of sorted) {
  console.log(`║    ${ext.padEnd(15)} ${String(count).padStart(5)}              ║`);
}

console.log(`╚══════════════════════════════════════════╝`);
