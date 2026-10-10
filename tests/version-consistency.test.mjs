import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const REPO_ROOT = process.cwd();

function readVersionFile() {
  return fs.readFileSync(path.join(REPO_ROOT, 'VERSION'), 'utf8').trim();
}

function readPackageVersion() {
  const pkg = JSON.parse(fs.readFileSync(path.join(REPO_ROOT, 'package.json'), 'utf8'));
  return pkg.version;
}

function readRegistryBundleVersion() {
  const text = fs.readFileSync(path.join(REPO_ROOT, 'registry.yaml'), 'utf8');
  try {
    return JSON.parse(text).bundleVersion;
  } catch {
    const match = text.match(/^bundleVersion:\s*(.+)$/m);
    return match ? match[1].trim().replace(/^["']|["']$/g, '') : undefined;
  }
}

function readReadmeBadgeVersion() {
  const text = fs.readFileSync(path.join(REPO_ROOT, 'README.md'), 'utf8');
  const match = text.match(/badge\/version-(\d+\.\d+\.\d+)-/);
  return match ? match[1] : undefined;
}

test('VERSION, package.json, registry.yaml and the README badge agree on one version', () => {
  const versionFile = readVersionFile();
  const packageVersion = readPackageVersion();
  const registryVersion = readRegistryBundleVersion();
  const badgeVersion = readReadmeBadgeVersion();

  assert.match(versionFile, /^\d+\.\d+\.\d+$/, `VERSION must be semver, got "${versionFile}"`);
  assert.equal(packageVersion, versionFile, `package.json version (${packageVersion}) must match VERSION (${versionFile})`);
  assert.equal(registryVersion, versionFile, `registry.yaml bundleVersion (${registryVersion}) must match VERSION (${versionFile})`);
  assert.equal(badgeVersion, versionFile, `README.md version badge (${badgeVersion}) must match VERSION (${versionFile})`);
});
