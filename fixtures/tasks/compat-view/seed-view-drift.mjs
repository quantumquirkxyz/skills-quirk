#!/usr/bin/env node
// seed-view-drift.mjs - task fixture that injects the two compatibility-view
// defects the repair tool is designed to fix.
//
// Defect 1 (absolute link): .claude/skills/review-pr is rewritten as an
// absolute symlink pointing at the workspace itself. The destination resolves,
// but portability is gone, so the repair retargets it to a relative link.
// Defect 2 (dangling link): .claude/skills/ghost-skill is added as a relative
// link whose canonical skill directory no longer exists, so the repair removes it.
//
// The script only ever touches the .claude/skills directory inside the current
// working directory, which is the task workspace.
//
// Usage: node seed-view-drift.mjs [--json]
// Exit codes: 0 both defects were seeded, 1 the seed could not be written.

import fs from 'node:fs';
import path from 'node:path';

const VIEW_DIR = path.join(process.cwd(), '.claude', 'skills');
const CANONICAL = path.join(process.cwd(), '.agents', 'skills', 'delivery', 'review-pr');
const GOOD_LINK = 'review-pr';
const DANGLING_LINK = 'ghost-skill';
const DANGLING_TARGET = '../../.agents/skills/routing/grill-with-docs-retired';

const report = { seeded: [], absolute: [], dangling: [] };

try {
  fs.mkdirSync(VIEW_DIR, { recursive: true });

  const goodPath = path.join(VIEW_DIR, GOOD_LINK);
  fs.rmSync(goodPath, { recursive: true, force: true });
  // Absolute on purpose: this is the portability defect the repair rewrites.
  fs.symlinkSync(CANONICAL, goodPath);
  report.seeded.push(GOOD_LINK);
  report.absolute.push(GOOD_LINK);

  const danglingPath = path.join(VIEW_DIR, DANGLING_LINK);
  fs.rmSync(danglingPath, { recursive: true, force: true });
  fs.symlinkSync(DANGLING_TARGET, danglingPath);
  report.seeded.push(DANGLING_LINK);
  report.dangling.push(DANGLING_LINK);
} catch (error) {
  console.error(`seed-view-drift: ${error.message}`);
  process.exit(1);
}

report.status = 'seeded';
if (process.argv.includes('--json')) console.log(JSON.stringify(report, null, 2));
else {
  console.log('seed-view-drift: drifted the compatibility view');
  for (const name of report.absolute) console.log(`  absolute link: ${name}`);
  for (const name of report.dangling) console.log(`  dangling link: ${name}`);
}
process.exit(0);
