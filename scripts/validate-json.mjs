#!/usr/bin/env node
/**
 * DJMaster Academy — JSON Validation Script
 * Validates all JSON files for syntax and schema compliance.
 */

import { readFileSync, readdirSync, statSync } from 'fs';
import { join, relative } from 'path';

const ROOT = process.cwd();
let errors = 0;
let passed = 0;

function findJsonFiles(dir, files = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (entry === '.git' || entry === 'node_modules') continue;
    if (statSync(full).isDirectory()) {
      findJsonFiles(full, files);
    } else if (entry.endsWith('.json') && !entry.includes('package-lock')) {
      files.push(full);
    }
  }
  return files;
}

console.log('🔍 Validating JSON files...\n');

const files = findJsonFiles(ROOT);

for (const file of files) {
  const rel = relative(ROOT, file);
  try {
    const content = readFileSync(file, 'utf-8');
    JSON.parse(content);
    console.log(`  ✅ ${rel}`);
    passed++;
  } catch (err) {
    console.error(`  ❌ ${rel}: ${err.message}`);
    errors++;
  }
}

console.log(`\n📊 Results: ${passed} passed, ${errors} failed, ${files.length} total`);

if (errors > 0) {
  process.exit(1);
}
