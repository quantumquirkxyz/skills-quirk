import { test, describe, before, after } from 'node:test';
import assert from 'node:assert';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';

const SCRIPT = path.resolve('.agents/skills/platform/scripts/generate-agent-cards.mjs');

// The generator resolves its repo root from process.cwd(), so the test runs it
// inside a throwaway copy of the bundle instead of regenerating the tracked
// .agents/skills/platform/agent-cards/ corpus in place. Mutating the tracked
// directory raced with concurrent suites that read the same cards.
let CARDS_DIR = path.join('.agents', 'skills', 'platform', 'agent-cards');
let tmpRoot = null;

function run(args, cwd) {
  return spawnSync('node', [SCRIPT, ...args], { encoding: 'utf8', cwd });
}

describe('generate-agent-cards.mjs', () => {
  before(() => {
    tmpRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'agent-cards-hermetic-'));
    fs.cpSync(path.join('.agents', 'skills'), path.join(tmpRoot, '.agents', 'skills'), {
      recursive: true,
      filter: (src) => {
        const rel = path.relative(path.join('.agents', 'skills'), src);
        if (!rel) return true;
        if (rel === 'platform') return true;
        if (rel.startsWith(`platform${path.sep}`)) {
          const rest = rel.slice('platform'.length + 1);
          return rest === 'agent-cards' || rest.startsWith(`agent-cards${path.sep}`)
            || rest === 'schemas' || rest.startsWith(`schemas${path.sep}`);
        }
        return true;
      },
    });
    CARDS_DIR = path.join(tmpRoot, '.agents', 'skills', 'platform', 'agent-cards');
    // Generate from an empty directory, so the assertions describe the cards the
    // tool actually produces and never any stale card left over from the copy.
    fs.rmSync(CARDS_DIR, { recursive: true, force: true });
    const result = run([], tmpRoot);
    if (result.status !== 0) {
      throw new Error('Generation failed: ' + result.stderr);
    }
  });

  after(() => {
    if (tmpRoot) fs.rmSync(tmpRoot, { recursive: true, force: true });
    tmpRoot = null;
    CARDS_DIR = path.join('.agents', 'skills', 'platform', 'agent-cards');
  });

  test('generates cards for all skills', () => {
    const files = fs.readdirSync(CARDS_DIR).filter(f => f.endsWith('.json') && f !== 'index.json');
    assert.ok(files.length > 0, 'Should generate cards');
  });

  test('each card has required fields (name, description, capabilities)', () => {
    const files = fs.readdirSync(CARDS_DIR).filter(f => f.endsWith('.json') && f !== 'index.json');
    for (const file of files) {
      const card = JSON.parse(fs.readFileSync(path.join(CARDS_DIR, file), 'utf8'));
      assert.ok(card.name, `Card ${file} missing name`);
      assert.ok(card.description !== undefined, `Card ${file} missing description`);
      assert.ok(card.capabilities, `Card ${file} missing capabilities`);
    }
  });

  test('index.json is created with totalCards', () => {
    const indexPath = path.join(CARDS_DIR, 'index.json');
    assert.ok(fs.existsSync(indexPath), 'index.json should exist');
    const index = JSON.parse(fs.readFileSync(indexPath, 'utf8'));
    assert.ok(typeof index.totalCards === 'number', 'totalCards should be a number');
    assert.ok(index.totalCards > 0, 'totalCards should be > 0');
    
    const cardFiles = fs.readdirSync(CARDS_DIR).filter(f => f.endsWith('.json') && f !== 'index.json');
    assert.equal(index.totalCards, cardFiles.length, 'totalCards should match actual card count');
  });

  test('excludes platform infrastructure directories', () => {
    const excluded = [
      'platform', 'node_modules', '.git', 'dist', 'scripts',
      'agent-cards', 'artifacts', 'fixtures', 'schemas', 'traces',
      'state', 'runs', 'evals', 'prompts', 'assets', 'references',
      'behavioral-fixtures', 'tests', 'mcp-server', 'audit'
    ];
    const files = fs.readdirSync(CARDS_DIR).filter(f => f.endsWith('.json') && f !== 'index.json');
    for (const file of files) {
      for (const dir of excluded) {
        assert.ok(!file.startsWith(dir + '-'), `Card ${file} should not be from excluded directory ${dir}`);
      }
    }
  });
});
