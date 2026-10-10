#!/usr/bin/env node
/**
 * run-routing.mjs - Layer 1 routing scorer for the quirk Skills bundle.
 *
 * Modes:
 *   --check                     validate every CSV in evals/routing (CI gate)
 *   --export [--skill <name>]   print one prompt per line as JSONL for any agent harness
 *   --record <file.jsonl>       score a recorded set of routing decisions
 *   --mock [--out <file.jsonl>] write a synthetic recording, then score it (CI smoke test)
 *
 * Exit code is 0 on success and 1 on any validation error (or a threshold breach).
 *
 * Recorded-decision JSONL schema (one object per line):
 *   {
 *     "tsv": "2026-10-10T20:14:03.221Z",   // timestamp; "ts" is accepted as an alias
 *     "skill_expected": "skill-audit",     // skill that should have been selected
 *     "skill_selected": "skill-audit",     // skill actually selected ("" / null = none)
 *     "query_ref": "evals/routing/skill-audit.csv#4"   // <csv>#<1-based data row>
 *   }
 * `query_ref` is the join key back to the fixture, so a recording can never drift from it.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(here, '..');
const routingDir = path.join(here, 'routing');
const skillsRoot = path.join(repoRoot, '.agents', 'skills');
const resultsDir = path.join(here, 'results');

const HEADER = ['should_trigger', 'category', 'prompt'];
const CATEGORIES = new Set(['explicit', 'implicit', 'contextual', 'negative-control']);
const MIN_ROWS = 12;
const MIN_NEGATIVE_CONTROLS = 2;
const TRUTHY = new Set(['true', '1', 'yes', 'y']);
const FALSY = new Set(['false', '0', 'no', 'n']);

/* ------------------------------------------------------------------ args */

function parseArgs(argv) {
  const args = { _: [] };
  for (let i = 0; i < argv.length; i++) {
    const token = argv[i];
    if (!token.startsWith('--')) { args._.push(token); continue; }
    const key = token.slice(2);
    const next = argv[i + 1];
    if (next === undefined || next.startsWith('--')) args[key] = true;
    else { args[key] = next; i += 1; }
  }
  return args;
}

const args = parseArgs(process.argv.slice(2));
const fail = (message) => { console.error(`error: ${message}`); process.exit(1); };

/* ------------------------------------------------- bundle skill registry */

async function listSkillDirs(dir, out = []) {
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    if (entry.name === 'platform') continue; // platform helpers are not bundle skills
    const child = path.join(dir, entry.name);
    if (await exists(path.join(child, 'SKILL.md'))) out.push(child);
    else await listSkillDirs(child, out);
  }
  return out;
}

async function exists(filePath) {
  try { await fs.access(filePath); return true; } catch { return false; }
}

const skillDirs = await listSkillDirs(skillsRoot);
const skillNames = new Set(skillDirs.map((dir) => path.basename(dir)));
const skillPaths = new Set(skillDirs.map((dir) => path.relative(skillsRoot, dir).split(path.sep).join('/')));

/* -------------------------------------------------------------- csv io */

function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = '';
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (inQuotes) {
      if (ch === '"') {
        if (text[i + 1] === '"') { field += '"'; i += 1; } else inQuotes = false;
      } else field += ch;
      continue;
    }
    if (ch === '"') { inQuotes = true; continue; }
    if (ch === ',') { row.push(field); field = ''; continue; }
    if (ch === '\n') { row.push(field); rows.push(row); row = []; field = ''; continue; }
    if (ch === '\r') continue;
    field += ch;
  }
  if (field.length > 0 || row.length > 0) { row.push(field); rows.push(row); }
  return rows.filter((r) => !(r.length === 1 && r[0].trim() === ''));
}

function parseShouldTrigger(raw) {
  const value = raw.trim().toLowerCase();
  if (TRUTHY.has(value)) return true;
  if (FALSY.has(value)) return false;
  return null;
}

/** Map a `<domain>-<skill>.csv` stem back to its canonical `<domain>/<skill>` path. */
function stemToSkill(stem) {
  for (const skillPath of skillPaths) {
    if (skillPath.replaceAll('/', '-') === stem) return skillPath;
  }
  return stem;
}

/* ------------------------------------------------ prompt introspection */

const TOKEN_RE = /[A-Za-z0-9][A-Za-z0-9._-]*/g;

function isPathish(text, start, end) {
  const before = start > 0 ? text[start - 1] : ' ';
  const after = end < text.length ? text[end] : ' ';
  if (before === '/' || after === '/') return true;
  if (before === '.' || after === '.') return true;
  return false;
}

/** Skills named by the prompt, ignoring tokens that sit inside a path. */
function skillMentions(prompt) {
  const found = new Set();
  const clean = prompt.replace(/`/g, ' ');
  for (const match of clean.matchAll(TOKEN_RE)) {
    const raw = match[0];
    if (isPathish(clean, match.index, match.index + raw.length)) continue;
    const token = raw.replace(/\.(mjs|md|json|sh|js|ts)$/, '');
    if (skillNames.has(token)) found.add(token);
  }
  return [...found];
}

function levenshtein(a, b) {
  const matrix = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)]);
  for (let j = 0; j <= b.length; j++) matrix[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1),
      );
    }
  }
  return matrix[a.length][b.length];
}

function nearestSkillName(token) {
  let best = null;
  let bestDistance = Number.POSITIVE_INFINITY;
  for (const name of skillNames) {
    if (Math.abs(name.length - token.length) > 2) continue;
    const distance = levenshtein(token, name);
    if (distance < bestDistance) { bestDistance = distance; best = name; }
  }
  return bestDistance <= 2 ? best : null;
}

/** Misspelled skill-shaped tokens: hyphenated and not on a path. */
function suspectSkillTypos(prompt) {
  const out = [];
  const clean = prompt.replace(/`/g, ' ');
  for (const match of clean.matchAll(TOKEN_RE)) {
    const raw = match[0];
    if (isPathish(clean, match.index, match.index + raw.length)) continue;
    const token = raw.replace(/\.(mjs|md|json|sh|js|ts)$/, '');
    if (!token.includes('-')) continue;
    if (skillNames.has(token)) continue;
    const near = nearestSkillName(token);
    if (near) out.push({ token, near });
  }
  return out;
}

/* --------------------------------------------------------- fixture load */

async function loadFixtures(filterSkill) {
  const entries = (await fs.readdir(routingDir, { withFileTypes: true }))
    .filter((entry) => entry.isFile() && entry.name.endsWith('.csv'))
    .map((entry) => entry.name)
    .sort();

  if (entries.length === 0) fail(`no routing fixtures found in ${path.relative(repoRoot, routingDir)}`);

  const fixtures = [];
  for (const name of entries) {
    const file = path.join(routingDir, name);
    const text = await fs.readFile(file, 'utf8');
    const rows = parseCsv(text);
    const header = (rows[0] ?? []).map((cell) => cell.trim());

    const stem = name.replace(/\.csv$/, '');
    const skill = stemToSkill(stem);
    const fixture = {
      name,
      file,
      rel: path.relative(repoRoot, file).split(path.sep).join('/'),
      skill,
      skillKnown: skillPaths.has(skill),
      skillName: path.basename(skill),
      headerOk: HEADER.every((value, i) => header[i] === value),
      header,
      rows: [],
      errors: [],
      warnings: [],
    };

    if (!fixture.headerOk) {
      fixture.errors.push(`header must be "${HEADER.join(',')}" (found "${header.join(',')}")`);
    }
    if (!fixture.skillKnown) {
      fixture.errors.push(`file name does not map to a canonical bundle skill (expected <domain>-<skill>.csv)`);
    }

    const dataRows = rows.slice(1);
    for (let index = 0; index < dataRows.length; index++) {
      const cells = dataRows[index];
      const rowNumber = index + 1;
      const where = `${name}#${rowNumber}`;
      if (cells.length !== HEADER.length) {
        fixture.errors.push(`${where}: expected ${HEADER.length} fields, found ${cells.length}`);
        continue;
      }
      const [rawShould, rawCategory, prompt] = cells;
      const shouldTrigger = parseShouldTrigger(rawShould);
      if (shouldTrigger === null) {
        fixture.errors.push(`${where}: should_trigger must be true/false (found "${rawShould}")`);
        continue;
      }
      const category = rawCategory.trim();
      if (!CATEGORIES.has(category)) {
        fixture.errors.push(`${where}: category must be one of ${[...CATEGORIES].join('|')} (found "${category}")`);
        continue;
      }
      const trimmed = prompt.trim();
      if (trimmed.length === 0) {
        fixture.errors.push(`${where}: prompt is empty`);
        continue;
      }
      if (trimmed.split(/\s+/).length < 3) {
        fixture.warnings.push(`${where}: prompt is very short — a one-step prompt measures nothing about the skill`);
      }
      fixture.rows.push({ row: rowNumber, shouldTrigger, category, prompt: trimmed, ref: where });
    }

    fixtures.push(fixture);
  }

  if (filterSkill) {
    const wanted = filterSkill.replace(/\.csv$/, '');
    const filtered = fixtures.filter((f) => f.name.replace(/\.csv$/, '') === wanted || f.skillName === wanted || f.skill === stemToSkill(wanted));
    if (filtered.length === 0) fail(`no routing fixture matches --skill ${filterSkill}`);
    return filtered;
  }
  return fixtures;
}

function validateFixtures(fixtures) {
  const problems = [];
  for (const fixture of fixtures) {
    const errors = [...fixture.errors];
    const warnings = [...fixture.warnings];
    const rows = fixture.rows;

    if (rows.length < MIN_ROWS) errors.push(`${fixture.name}: needs at least ${MIN_ROWS} rows, found ${rows.length}`);

    const negatives = rows.filter((row) => row.category === 'negative-control');
    if (negatives.length < MIN_NEGATIVE_CONTROLS) {
      errors.push(`${fixture.name}: needs at least ${MIN_NEGATIVE_CONTROLS} negative controls, found ${negatives.length}`);
    }
    for (const row of negatives) {
      if (row.shouldTrigger) errors.push(`${fixture.name}#${row.row}: negative control must not trigger the skill`);
      const mentions = skillMentions(row.prompt).filter((name) => name !== fixture.skillName);
      if (mentions.length === 0) {
        errors.push(`${fixture.name}#${row.row}: negative control must name an adjacent bundle skill that must not trigger`);
      }
    }

    const seen = new Map();
    for (const row of rows) {
      const key = row.prompt.toLowerCase();
      if (seen.has(key)) errors.push(`${fixture.name}#${row.row}: duplicate of row #${seen.get(key)}`);
      else seen.set(key, row.row);
      for (const suspect of suspectSkillTypos(row.prompt)) {
        warnings.push(`${fixture.name}#${row.row}: "${suspect.token}" is not a bundle skill — did you mean ${suspect.near}?`);
      }
    }

    if (rows.length > 0 && rows.every((row) => row.shouldTrigger)) {
      warnings.push(`${fixture.name}: no negative controls — trigger rate cannot be separated from over-triggering`);
    }

    problems.push({ fixture, errors, warnings });
  }
  return problems;
}

/* ------------------------------------------------------------ check mode */

async function modeCheck() {
  const fixtures = await loadFixtures();
  const problems = validateFixtures(fixtures);
  let errorCount = 0;
  let warningCount = 0;

  for (const { fixture, errors, warnings } of problems) {
    const negatives = fixture.rows.filter((row) => row.category === 'negative-control').length;
    const status = errors.length ? 'FAIL' : 'ok';
    console.log(`${status}  ${fixture.name}  rows=${fixture.rows.length} negatives=${negatives} skill=${fixture.skill}`);
    for (const warning of warnings) console.log(`     warn  ${warning}`);
    for (const error of errors) console.log(`     ERROR ${error}`);
    errorCount += errors.length;
    warningCount += warnings.length;
  }

  const totalRows = fixtures.reduce((sum, f) => sum + f.rows.length, 0);
  const totalNegatives = fixtures.reduce((sum, f) => sum + f.rows.filter((r) => r.category === 'negative-control').length, 0);
  console.log('');
  console.log(`routing fixtures: ${fixtures.length} files, ${totalRows} rows, ${totalNegatives} negative controls`);
  console.log(`errors: ${errorCount}, warnings: ${warningCount}`);
  console.log(errorCount === 0 ? 'status: pass' : 'status: fail');
  process.exit(errorCount === 0 ? 0 : 1);
}

/* ---------------------------------------------------------- export mode */

async function modeExport() {
  const fixtures = await loadFixtures(args.skill);
  let count = 0;
  for (const fixture of fixtures) {
    for (const row of fixture.rows) {
      process.stdout.write(`${JSON.stringify({
        skill: fixture.skill,
        should_trigger: row.shouldTrigger,
        category: row.category,
        row: row.row,
        ref: `${fixture.rel}#${row.row}`,
        prompt: row.prompt,
      })}\n`);
      count += 1;
    }
  }
  if (!args.quiet) console.error(`exported ${count} prompts from ${fixtures.length} fixture file(s)`);
  process.exit(0);
}

/* ---------------------------------------------------------- record mode */

async function readJsonl(file) {
  const text = await fs.readFile(file, 'utf8');
  const lines = text.split(/\r?\n/).filter((line) => line.trim().length > 0);
  const records = [];
  const errors = [];
  lines.forEach((line, index) => {
    try {
      records.push({ line: index + 1, value: JSON.parse(line) });
    } catch (error) {
      errors.push(`${path.relative(repoRoot, file)}:${index + 1}: not valid JSON (${error.message})`);
    }
  });
  return { records, errors, lineCount: lines.length };
}

function resolveRef(ref) {
  if (typeof ref !== 'string' || !ref.includes('#')) return null;
  const [file, rowPart] = ref.split('#');
  const row = Number(rowPart);
  if (!Number.isInteger(row) || row < 1) return null;
  const abs = path.resolve(repoRoot, file);
  return { file, row, abs };
}

function buildRowIndex(fixtures) {
  const index = new Map();
  for (const fixture of fixtures) {
    for (const row of fixture.rows) {
      index.set(`${fixture.file}#${row.row}`, { fixture, row });
    }
  }
  return index;
}

function normalizeSkill(value) {
  if (value === null || value === undefined) return '';
  const text = String(value).trim();
  if (!text || text === '-' || text.toLowerCase() === 'none' || text.toLowerCase() === 'null') return '';
  return text;
}

async function scoreRecording(records, rowIndex) {
  const perSkill = new Map();
  const matrix = new Map();
  const unknownSelected = new Map();
  const warnings = [];
  const errors = [];
  let counted = 0;

  const bucket = (name) => {
    if (!perSkill.has(name)) {
      perSkill.set(name, {
        skill: name,
        total: 0,
        shouldTrigger: 0,
        shouldNotTrigger: 0,
        hits: 0,
        misses: [],
        falsePositives: 0,
        correctRejections: 0,
        adjacentCaptures: 0,
        noSkillAnswers: 0,
      });
    }
    return perSkill.get(name);
  };

  for (const record of records) {
    const value = record.value ?? {};
    const ref = resolveRef(value.query_ref);
    if (!ref) {
      errors.push(`line ${record.line}: query_ref must be "<csv>#<row>" (found ${JSON.stringify(value.query_ref)})`);
      continue;
    }
    const entry = rowIndex.get(`${ref.abs}#${ref.row}`);
    if (!entry) {
      errors.push(`line ${record.line}: query_ref ${value.query_ref} does not resolve to a routing fixture row`);
      continue;
    }
    const { fixture, row } = entry;
    const expected = normalizeSkill(value.skill_expected) || fixture.skillName;
    const selected = normalizeSkill(value.skill_selected);
    if (!value.skill_expected) {
      warnings.push(`line ${record.line}: skill_expected missing, derived "${expected}" from the fixture`);
    }
    if (!skillNames.has(selected) && selected !== '') {
      const previous = unknownSelected.get(selected) ?? 0;
      unknownSelected.set(selected, previous + 1);
    }

    const stats = bucket(fixture.skillName);
    stats.total += 1;
    counted += 1;

    if (row.shouldTrigger) {
      stats.shouldTrigger += 1;
      if (selected === fixture.skillName) stats.hits += 1;
      else if (selected === '') stats.noSkillAnswers += 1;
      else stats.misses.push(selected);
    } else {
      stats.shouldNotTrigger += 1;
      if (selected === fixture.skillName) stats.falsePositives += 1;
      else if (selected === '') { stats.correctRejections += 1; stats.noSkillAnswers += 1; }
      else { stats.correctRejections += 1; stats.adjacentCaptures += 1; }
    }

    const matrixRow = matrix.get(expected) ?? new Map();
    matrixRow.set(selected || '<none>', (matrixRow.get(selected || '<none>') ?? 0) + 1);
    matrix.set(expected, matrixRow);
  }

  if (counted === 0) errors.push('no routing decisions could be scored');

  const summary = [...perSkill.values()].sort((a, b) => a.skill.localeCompare(b.skill)).map((stats) => ({
    skill: stats.skill,
    recorded: stats.total,
    shouldTriggerRows: stats.shouldTrigger,
    triggerRate: stats.shouldTrigger === 0 ? null : round(stats.hits / stats.shouldTrigger),
    falsePositiveRows: stats.shouldNotTrigger,
    falsePositiveRate: stats.shouldNotTrigger === 0 ? null : round(stats.falsePositives / stats.shouldNotTrigger),
    adjacentCaptureRate: stats.shouldNotTrigger === 0 ? null : round(stats.adjacentCaptures / stats.shouldNotTrigger),
    hits: stats.hits,
    misses: stats.misses,
    missOther: stats.misses.length,
    falsePositives: stats.falsePositives,
    noSkillAnswers: stats.noSkillAnswers,
  }));

  return { summary, matrix, unknownSelected, warnings, errors, counted };
}

function round(value) { return Math.round(value * 1000) / 1000; }

function printReport({ fixtures, summary, matrix, unknownSelected, warnings, errors, source }) {
  const covered = new Set(summary.map((row) => row.skill));
  const expectedRows = fixtures.reduce((sum, f) => sum + f.rows.length, 0);
  const recordedRows = summary.reduce((sum, row) => sum + row.recorded, 0);

  console.log(`routing score - source: ${source}`);
  console.log('');
  console.log('per-skill (trigger rate and false-positive rate are never blended)');
  console.log('skill                     recorded  triggerRate  falsePositiveRate  adjacentCapture   hits  missOther  noSkill   fp');
  for (const row of summary) {
    console.log([
      row.skill.padEnd(24),
      String(row.recorded).padStart(8),
      fmtRate(row.triggerRate).padStart(13),
      fmtRate(row.falsePositiveRate).padStart(19),
      fmtRate(row.adjacentCaptureRate).padStart(16),
      String(row.hits).padStart(6),
      String(row.missOther).padStart(10),
      String(row.noSkillAnswers).padStart(9),
      String(row.falsePositives).padStart(5),
    ].join('  '));
  }

  const missing = fixtures.filter((fixture) => !covered.has(fixture.skillName)).map((fixture) => fixture.skillName);
  console.log('');
  console.log(`coverage: ${recordedRows}/${expectedRows} fixture rows recorded (${fixtures.length} fixture files, ${missing.length} unrecorded)`);
  if (missing.length > 0) console.log(`unrecorded skills: ${missing.join(', ')}`);

  console.log('');
  console.log('adjacent-skill confusion (expected -> selected, recorded decisions only)');
  const selectedLabels = new Set();
  for (const row of matrix.values()) for (const label of row.keys()) selectedLabels.add(label);
  const columns = [...selectedLabels].sort();

  const offDiagonal = [];
  for (const expected of matrix.keys()) {
    for (const [label, count] of matrix.get(expected)) {
      if (label !== expected && count > 0) offDiagonal.push({ expected, selected: label, count });
    }
  }
  offDiagonal.sort((a, b) => b.count - a.count || a.expected.localeCompare(b.expected));

  const MAX_RENDERED_COLUMNS = 12;
  if (columns.length <= MAX_RENDERED_COLUMNS) {
    const rowWidth = 26;
    const colWidth = Math.max(14, ...columns.map((label) => label.length + 2));
    let head = 'expected \\ selected'.padEnd(rowWidth);
    for (const label of columns) head += label.padStart(colWidth);
    console.log(head);
    for (const expected of [...matrix.keys()].sort()) {
      let line = expected.padEnd(rowWidth);
      const row = matrix.get(expected);
      for (const label of columns) {
        const count = row.get(label) ?? 0;
        line += (count === 0 ? '.' : String(count)).padStart(colWidth);
      }
      console.log(line);
    }
  } else {
    console.log(`(too many distinct labels to tabulate: ${columns.length}; showing the top confusions instead)`);
  }

  if (offDiagonal.length > 0) {
    console.log('');
    console.log('top confusions (expected was X, the agent selected Y):');
    for (const entry of offDiagonal.slice(0, 15)) {
      console.log(`  ${entry.expected} -> ${entry.selected} x${entry.count}`);
    }
    if (offDiagonal.length > 15) console.log(`  ... and ${offDiagonal.length - 15} more`);
  }

  if (unknownSelected.size > 0) {
    console.log('');
    console.log('selections that are not bundle skills:');
    for (const [label, count] of [...unknownSelected.entries()].sort()) console.log(`  ${label} x${count}`);
  }

  if (warnings.length > 0) {
    console.log('');
    for (const warning of warnings.slice(0, 20)) console.log(`warn  ${warning}`);
    if (warnings.length > 20) console.log(`warn  ... and ${warnings.length - 20} more`);
  }
  if (errors.length > 0) {
    console.log('');
    for (const error of errors) console.log(`ERROR ${error}`);
  }

  const totals = summary.reduce((acc, row) => {
    acc.shouldTrigger += row.shouldTriggerRows;
    acc.hits += row.hits;
    acc.shouldNotTrigger += row.falsePositiveRows;
    acc.falsePositives += row.falsePositives;
    return acc;
  }, { shouldTrigger: 0, hits: 0, shouldNotTrigger: 0, falsePositives: 0 });

  console.log('');
  console.log('bundle-wide:');
  console.log(`  trigger rate        = ${totals.shouldTrigger ? round(totals.hits / totals.shouldTrigger) : 'n/a'} (${totals.hits}/${totals.shouldTrigger})`);
  console.log(`  false-positive rate = ${totals.shouldNotTrigger ? round(totals.falsePositives / totals.shouldNotTrigger) : 'n/a'} (${totals.falsePositives}/${totals.shouldNotTrigger})`);
  return { totals, missing, recordedRows, expectedRows };
}

function fmtRate(value) { return value === null ? 'n/a' : value.toFixed(3); }

async function modeRecord(file) {
  if (!file) fail('--record needs a JSONL file');
  const fixtures = await loadFixtures();
  const rowIndex = buildRowIndex(fixtures);
  const { records, errors: readErrors, lineCount } = await readJsonl(file);
  const result = await scoreRecording(records, rowIndex);
  const allErrors = [...readErrors, ...result.errors];
  const rel = path.relative(repoRoot, file);
  printReport({ fixtures, ...result, errors: allErrors, source: rel.startsWith('..') ? String(file) : rel });
  console.log(`lines read: ${lineCount}`);

  let failed = allErrors.length > 0;
  if (args['min-trigger-rate'] !== undefined) {
    const threshold = Number(args['min-trigger-rate']);
    const rate = result.summary.reduce((sum, row) => sum + (row.triggerRate ?? 0) * row.shouldTriggerRows, 0)
      / Math.max(1, result.summary.reduce((sum, row) => sum + row.shouldTriggerRows, 0));
    if (rate < threshold) { console.log(`ERROR trigger rate ${round(rate)} below --min-trigger-rate ${threshold}`); failed = true; }
  }
  if (args['max-false-positive-rate'] !== undefined) {
    const threshold = Number(args['max-false-positive-rate']);
    const denom = result.summary.reduce((sum, row) => sum + row.falsePositiveRows, 0);
    const rate = denom === 0 ? 0 : result.summary.reduce((sum, row) => sum + row.falsePositives, 0) / denom;
    if (rate > threshold) { console.log(`ERROR false-positive rate ${round(rate)} above --max-false-positive-rate ${threshold}`); failed = true; }
  }

  console.log(failed ? 'status: fail' : 'status: pass');
  process.exit(failed ? 1 : 0);
}

/* ------------------------------------------------------------ mock mode */

/** Deterministic pseudo-random generator so the mock is reproducible. */
function makeRandom(seed) {
  let state = seed >>> 0;
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 0x100000000;
  };
}

async function modeMock() {
  const fixtures = await loadFixtures();
  const problems = validateFixtures(fixtures);
  const errorCount = problems.reduce((sum, p) => sum + p.errors.length, 0);
  if (errorCount > 0) {
    console.error('mock: routing fixtures are invalid, run --check first');
    for (const { fixture, errors } of problems) {
      for (const error of errors) console.error(`  ${error}`);
    }
    process.exit(1);
  }

  const random = makeRandom(20261010);
  const outFile = path.resolve(String(args.out ?? path.join(resultsDir, 'mock-routing.jsonl')));
  const lines = [];
  let clock = Date.parse('2026-10-10T20:00:00.000Z');

  for (const fixture of fixtures) {
    for (const row of fixture.rows) {
      const adjacent = skillMentions(row.prompt).filter((name) => name !== fixture.skillName);
      const fallback = ['skill-audit', 'ask-to', 'capability-router', 'evaluate-skill'];
      const pick = adjacent[0] ?? fallback[Math.floor(random() * fallback.length) % fallback.length];
      const roll = random();
      let selected;
      if (row.shouldTrigger) {
        if (roll < 0.82) selected = fixture.skillName;
        else if (roll < 0.92) selected = '';
        else selected = pick;
      } else if (roll < 0.78) selected = pick;
      else if (roll < 0.90) selected = fixture.skillName;
      else selected = '';
      clock += 137;
      lines.push(JSON.stringify({
        tsv: new Date(clock).toISOString(),
        skill_expected: row.shouldTrigger ? fixture.skillName : pick,
        skill_selected: selected,
        query_ref: `${fixture.rel}#${row.row}`,
        triggered: selected === fixture.skillName,
        mock: true,
      }));
    }
  }

  await fs.mkdir(path.dirname(outFile), { recursive: true });
  await fs.writeFile(outFile, `${lines.join('\n')}\n`, 'utf8');

  const rowIndex = buildRowIndex(fixtures);
  const { records } = await readJsonl(outFile);
  const result = await scoreRecording(records, rowIndex);
  printReport({ fixtures, ...result, source: `${path.relative(repoRoot, outFile)} (synthetic)` });
  console.log('');
  console.log(`wrote ${lines.length} synthetic decisions to ${path.relative(repoRoot, outFile)}`);
  console.log('note: mock output is a scorer smoke test, never evidence about a model or a skill');
  process.exit(result.errors.length > 0 ? 1 : 0);
}

/* ---------------------------------------------------------------- main */

if (args.check) await modeCheck();
else if (args.export) await modeExport();
else if (args.record) await modeRecord(String(args.record));
else if (args.mock) await modeMock();
else {
  console.log('usage: node evals/run-routing.mjs <mode>');
  console.log('  --check                            validate every routing CSV (exit 0/1)');
  console.log('  --export [--skill <name>]          one prompt per line as JSONL');
  console.log('  --record <file.jsonl>              score recorded routing decisions');
  console.log('  --mock [--out <file.jsonl>]        synthetic recording + full scorer path');
  console.log('  flags: --min-trigger-rate <0..1> --max-false-positive-rate <0..1>');
  process.exit(args.help || args.h ? 0 : 1);
}
