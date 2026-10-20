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

function readSkillsJsonVersions() {
  const skills = JSON.parse(fs.readFileSync(path.join(REPO_ROOT, 'skills.json'), 'utf8'));
  return { version: skills.version, bundleVersion: skills.bundleVersion };
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

function readRegistryVersion() {
  const text = fs.readFileSync(path.join(REPO_ROOT, 'registry.yaml'), 'utf8');
  try {
    return JSON.parse(text).version;
  } catch {
    const match = text.match(/^version:\s*(.+)$/m);
    return match ? match[1].trim().replace(/^["']|["']$/g, '') : undefined;
  }
}

function readReadmeBadgeVersion() {
  const text = fs.readFileSync(path.join(REPO_ROOT, 'README.md'), 'utf8');
  const match = text.match(/badge\/version-(\d+\.\d+\.\d+)-/);
  return match ? match[1] : undefined;
}

function readClaudePluginVersion() {
  const plugin = JSON.parse(fs.readFileSync(path.join(REPO_ROOT, '.claude-plugin', 'plugin.json'), 'utf8'));
  return plugin.metadata?.version;
}

function readMarketplaceVersion() {
  const marketplace = JSON.parse(fs.readFileSync(path.join(REPO_ROOT, '.claude-plugin', 'marketplace.json'), 'utf8'));
  return marketplace.metadata?.version;
}

// scripts/sync-registry.mjs falls back to the inner `version` field when
// `bundleVersion` is absent (registry.bundleVersion || registry.version), so
// both fields are load-bearing and both are pinned to VERSION here. The root
// skills.json projection carries the same pair for external bundle consumers.
// The two Claude plugin manifests are hand-maintained release surfaces, so
// they are pinned here as well; marketplace.json used to be regenerated but
// plugin.json was not.
test('VERSION, package.json, registry.yaml, skills.json, Claude manifests and the README badge agree on one version', () => {
  const versionFile = readVersionFile();
  const packageVersion = readPackageVersion();
  const registryVersion = readRegistryBundleVersion();
  const registryInnerVersion = readRegistryVersion();
  const skillsJsonVersions = readSkillsJsonVersions();
  const badgeVersion = readReadmeBadgeVersion();
  const pluginVersion = readClaudePluginVersion();
  const marketplaceVersion = readMarketplaceVersion();

  assert.match(versionFile, /^\d+\.\d+\.\d+$/, `VERSION must be semver, got "${versionFile}"`);
  assert.equal(packageVersion, versionFile, `package.json version (${packageVersion}) must match VERSION (${versionFile})`);
  assert.equal(registryVersion, versionFile, `registry.yaml bundleVersion (${registryVersion}) must match VERSION (${versionFile})`);
  assert.equal(registryInnerVersion, versionFile, `registry.yaml inner version (${registryInnerVersion}) must match VERSION (${versionFile})`);
  assert.equal(skillsJsonVersions.version, versionFile, `skills.json version (${skillsJsonVersions.version}) must match VERSION (${versionFile})`);
  assert.equal(skillsJsonVersions.bundleVersion, versionFile, `skills.json bundleVersion (${skillsJsonVersions.bundleVersion}) must match VERSION (${versionFile})`);
  assert.equal(badgeVersion, versionFile, `README.md version badge (${badgeVersion}) must match VERSION (${versionFile})`);
  assert.equal(pluginVersion, versionFile, `.claude-plugin/plugin.json metadata.version (${pluginVersion}) must match VERSION (${versionFile})`);
  assert.equal(marketplaceVersion, versionFile, `.claude-plugin/marketplace.json metadata.version (${marketplaceVersion}) must match VERSION (${versionFile})`);
});
