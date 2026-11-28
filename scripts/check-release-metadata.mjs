import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const root = process.cwd();
const semver = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-[0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*)?(?:\+[0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*)?$/;
const generatedOnly = /^(CATALOG\.md|llms\.txt|site\/src\/skills\.json|\.claude\/skills(?:\/|$)|\.claude-plugin\/marketplace\.json)$/;

function git(...args) { return execFileSync('git', args, { cwd: root, encoding: 'utf8' }).trim(); }
function changedFiles() {
  const explicitBase = process.env.RELEASE_METADATA_BASE;
  let base = explicitBase;
  if (!base && process.env.GITHUB_BASE_REF) {
    try { base = git('merge-base', 'HEAD', `origin/${process.env.GITHUB_BASE_REF}`); } catch {}
  }
  if (!base) { try { base = git('merge-base', 'HEAD', 'HEAD^'); } catch { return []; } }
  const committed = git('diff', '--name-only', `${base}...HEAD`).split('\n').filter(Boolean);
  const working = git('diff', '--name-only').split('\n').filter(Boolean);
  const staged = git('diff', '--cached', '--name-only').split('\n').filter(Boolean);
  return [...new Set([...committed, ...working, ...staged])];
}
function fail(message) { console.error(`release metadata: ${message}`); process.exitCode = 1; }

const files = changedFiles();
if (files.length === 0) { console.log('release metadata: no changes detected'); process.exit(0); }
const exemption = process.env.RELEASE_METADATA_EXEMPTION;
if (exemption === 'generated-only') {
  const invalid = files.filter((file) => !generatedOnly.test(file));
  if (invalid.length) fail(`generated-only exemption has non-generated changes: ${invalid.join(', ')}`);
  else console.log('release metadata: generated-only exemption accepted');
  process.exit();
}
if (exemption === 'emergency-maintenance') {
  if (!process.env.RELEASE_METADATA_EXEMPTION_REASON?.trim()) fail('emergency-maintenance exemption requires RELEASE_METADATA_EXEMPTION_REASON');
  else console.log('release metadata: emergency-maintenance exemption accepted');
  process.exit();
}
if (exemption) fail(`unknown exemption "${exemption}"`);

const version = fs.readFileSync(path.join(root, 'VERSION'), 'utf8').trim();
if (!semver.test(version)) fail(`VERSION is not valid semver: ${version}`);
if (!files.includes('VERSION')) fail('shipping changes must update VERSION');
if (!files.includes('CHANGELOG.md')) fail('shipping changes must update CHANGELOG.md');
const changelog = fs.readFileSync(path.join(root, 'CHANGELOG.md'), 'utf8');
const unreleased = changelog.match(/^## \[Unreleased\]\s*\n([\s\S]*?)(?=^## \[)/m)?.[1] ?? '';
if (!/^[ \t]*[-*][ \t]+\S/m.test(unreleased)) fail('CHANGELOG.md Unreleased section must contain a bullet entry');
if (process.exitCode) process.exit(1);
console.log(`release metadata: required update present for ${files.length} changed paths`);
