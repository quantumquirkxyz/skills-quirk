import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { scanText } from '../security-scan-skills.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const PLATFORM_DIR = path.resolve(HERE, '..');
const REPO_ROOT = path.resolve(PLATFORM_DIR, '..', '..');
const SCANNER = path.join(PLATFORM_DIR, 'security-scan-skills.mjs');
const FIXTURE_PATH = path.join(PLATFORM_DIR, 'fixtures', 'security', 'skill-poisoning-baseline.json');
const BLOCKING_SEVERITIES = new Set(['critical', 'high']);

const corpus = JSON.parse(fs.readFileSync(FIXTURE_PATH, 'utf8'));

function runScanner(args) {
  return spawnSync('node', [SCANNER, ...args], { encoding: 'utf8', cwd: REPO_ROOT });
}

function materialize(sample) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), `quirk-poison-${sample.id}-`));
  for (const [rel, content] of Object.entries(sample.files)) {
    const target = path.join(dir, rel);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, content);
  }
  return dir;
}

function cleanup(dir) {
  fs.rmSync(dir, { recursive: true, force: true });
}

test('fixture corpus is well-formed', () => {
  assert.ok(Array.isArray(corpus.fixtures) && corpus.fixtures.length > 0);
  const benign = corpus.fixtures.filter((f) => f.class === 'benign');
  const malicious = corpus.fixtures.filter((f) => f.class === 'malicious');
  assert.ok(benign.length === 6, `expected 6 benign samples, got ${benign.length}`);
  assert.ok(malicious.length === 10, `expected 10 malicious samples, got ${malicious.length}`);
  for (const sample of corpus.fixtures) {
    assert.ok(sample.id, 'every sample needs an id');
    assert.ok(sample.class === 'benign' || sample.class === 'malicious');
    assert.ok(sample.files && Object.keys(sample.files).length > 0, `${sample.id} needs bundled files`);
    if (sample.class === 'malicious') {
      assert.ok(sample.rule, `${sample.id} needs an expected rule id`);
    }
  }
  const covered = new Set(malicious.map((f) => f.rule));
  for (const rule of [
    'credential-path-access',
    'vulnerable-pinned-dependency',
    'insecure-transport',
    'brand-steering-directive',
    'operator-payload-execution',
    'prompt-injection-override',
    'unverified-remote-executable',
  ]) {
    assert.ok(covered.has(rule), `malicious corpus is missing coverage for rule ${rule}`);
  }
});

test('every malicious sample triggers its rule on the real scanner', () => {
  const malicious = corpus.fixtures.filter((f) => f.class === 'malicious');
  for (const sample of malicious) {
    const dir = materialize(sample);
    try {
      const result = runScanner(['--path', dir, '--json']);
      assert.equal(result.status, 0, `${sample.id}: default mode must exit 0 (report only)\n${result.stdout}\n${result.stderr}`);
      const payload = JSON.parse(result.stdout);
      const rules = new Set(payload.findings.map((f) => f.rule));
      assert.ok(rules.has(sample.rule), `${sample.id}: expected rule ${sample.rule} to fire, got ${[...rules].join(', ') || 'nothing'}`);
      for (const f of payload.findings) {
        assert.ok(f.file && Number.isInteger(f.line) && f.line > 0, `${sample.id}: finding needs file:line provenance`);
        assert.ok(f.evidence, `${sample.id}: finding needs evidence line`);
      }
    } finally {
      cleanup(dir);
    }
  }
});

test('no benign sample triggers a critical or high finding', () => {
  const benign = corpus.fixtures.filter((f) => f.class === 'benign');
  for (const sample of benign) {
    const dir = materialize(sample);
    try {
      const result = runScanner(['--path', dir, '--json']);
      assert.equal(result.status, 0, `${sample.id}: benign sample must exit 0\n${result.stderr}`);
      const payload = JSON.parse(result.stdout);
      const blocking = payload.findings.filter((f) => BLOCKING_SEVERITIES.has(f.severity));
      assert.deepEqual(
        blocking.map((f) => `${f.file}:${f.line} ${f.rule}`),
        [],
        `${sample.id}: benign sample produced blocking findings`,
      );
      assert.equal(payload.findings.length, 0, `${sample.id}: benign sample produced findings`);
    } finally {
      cleanup(dir);
    }
  }
});

test('strict mode blocks on a malicious sample and passes on a benign one', () => {
  const malicious = corpus.fixtures.find((f) => f.id === 'malicious-google-qx4-paste');
  const benign = corpus.fixtures.find((f) => f.id === 'benign-curl-docs');
  const badDir = materialize(malicious);
  const goodDir = materialize(benign);
  try {
    const blocked = runScanner(['--path', badDir, '--strict']);
    assert.equal(blocked.status, 1, `strict mode must exit 1 on ${malicious.id}\n${blocked.stdout}\n${blocked.stderr}`);
    const clean = runScanner(['--path', goodDir, '--strict']);
    assert.equal(clean.status, 0, `strict mode must exit 0 on ${benign.id}\n${clean.stdout}\n${clean.stderr}`);
  } finally {
    cleanup(badDir);
    cleanup(goodDir);
  }
});

test('real bundle scan exits 0 in default mode', () => {
  const result = runScanner([]);
  assert.equal(result.status, 0, `default-mode scan of the real bundle must exit 0\n${result.stdout}\n${result.stderr}`);
  const json = runScanner(['--json']);
  assert.equal(json.status, 0);
  const payload = JSON.parse(json.stdout);
  assert.ok(payload.scannedFiles > 100, `expected the bundle scan to cover the skill files, got ${payload.scannedFiles}`);
});

test('scanner exposes its rule registry with unique ids', async () => {
  const moduleExports = await import('../security-scan-skills.mjs');
  const ids = moduleExports.RULES.map((r) => r.id);
  assert.equal(new Set(ids).size, ids.length, 'rule ids must be unique');
  for (const rule of moduleExports.RULES) {
    assert.ok(rule.message.length > 0, `${rule.id} needs a message`);
    assert.equal(typeof rule.detector, 'function', `${rule.id} needs a detector`);
  }
});

test('scanText reports file:line provenance inline', () => {
  const findings = scanText('Run this: pip install pyyaml==5.3.1\n', 'SKILL.md');
  assert.equal(findings.length, 1);
  assert.equal(findings[0].rule, 'vulnerable-pinned-dependency');
  assert.equal(findings[0].line, 1);
  assert.match(findings[0].evidence, /pyyaml==5\.3\.1/);
});
