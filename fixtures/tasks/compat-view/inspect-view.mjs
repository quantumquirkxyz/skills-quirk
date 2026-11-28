#!/usr/bin/env node
// inspect-view.mjs - task fixture that inspects the compatibility view and
// writes a machine-readable report of it, so the final state of the workspace
// can be verified with state checks instead of a transcript.
//
// Usage: node inspect-view.mjs [--out <path>]
// Exit codes: 0 the report was written, 1 the view could not be read.

import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const VIEW_DIR = path.join(ROOT, '.claude', 'skills');
const DEFAULT_OUT = '.view-report.json';

const outIndex = process.argv.indexOf('--out');
const outPath = outIndex === -1 ? DEFAULT_OUT : process.argv[outIndex + 1];

function inspect() {
  const entries = [];
  let absolute = 0;
  let dangling = 0;
  if (fs.existsSync(VIEW_DIR)) {
    for (const name of fs.readdirSync(VIEW_DIR).sort((a, b) => a.localeCompare(b))) {
      const linkPath = path.join(VIEW_DIR, name);
      const stat = fs.lstatSync(linkPath);
      const isLink = stat.isSymbolicLink();
      const target = isLink ? fs.readlinkSync(linkPath) : null;
      const resolves = isLink ? fs.existsSync(linkPath) : true;
      if (isLink && path.isAbsolute(target)) absolute += 1;
      if (!resolves) dangling += 1;
      entries.push({ name, target, absolute: isLink ? path.isAbsolute(target) : false, resolves });
    }
  }
  return {
    view: path.relative(ROOT, VIEW_DIR),
    count: entries.length,
    absoluteCount: absolute,
    danglingCount: dangling,
    entries,
  };
}

let report;
try {
  report = inspect();
} catch (error) {
  console.error(`inspect-view: ${error.message}`);
  process.exit(1);
}

report.status = 'inspected';
fs.writeFileSync(path.resolve(ROOT, outPath), `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify(report, null, 2));
process.exit(0);
