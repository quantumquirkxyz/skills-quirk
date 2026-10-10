#!/usr/bin/env node
// generate-agent-cards.mjs - Agent Card corpus generator with opt-in Ed25519 signing.
//
// Default behavior (no flags) is unchanged: regenerate the corpus from skill
// frontmatter into .agents/skills/platform/agent-cards/. Signing is strictly
// opt-in and never runs by default, so the checked-in corpus stays byte-identical
// across flagless regeneration.
//
// Signing protocol (A2A v1.0, a2a-protocol.org; the spec signs Agent Cards with a
// JWS (RFC 7515) computed over a canonicalized form of the card using the JSON
// Canonicalization Scheme (RFC 8785), with the signature field excluded from
// canonicalization):
//   1. take the card, remove metadata.signature (drop metadata entirely if empty)
//   2. canonicalize: recursive key sort by code unit, no insignificant whitespace
//      (an RFC 8785 subset implemented with JSON only - no external dependency)
//   3. sign the UTF-8 canonical bytes with Ed25519 (node:crypto)
//   4. embed the base64url signature in the card as
//      metadata.signature = {alg, keyId, value, canonicalization, signedAt}
// Verification re-canonicalizes the card WITHOUT the signature field and verifies,
// so a re-serialized or key-reordered card still verifies, but any tampered field
// fails.

import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const ROOT = process.cwd();
const SKILLS_DIR = path.join(ROOT, '.agents', 'skills');
const OUTPUT_DIR = path.join(ROOT, '.agents', 'skills', 'platform', 'agent-cards');
const SCHEMA_PATH = path.join(ROOT, '.agents', 'skills', 'platform', 'schemas', 'agent-card-schema.json');

const SIGNATURE_FIELD = 'signature';
const CANONICALIZATION_LABEL = 'RFC8785-subset';
const INDEX_FILENAME = 'index.json';

const usage = `generate-agent-cards options:
  (no flags)                       regenerate the corpus into ${path.join('.agents', 'skills', 'platform', 'agent-cards')}
  --sign --key <privateKeyPath>    regenerate and sign every card
    [--key-id <id>]                key identifier recorded in the signature
    [--out <dir>]                  destination for the signed corpus (default: the corpus dir)
    [--signed-at <iso>]            fixed signedAt for reproducible signing
  --verify --key <publicKeyPath>   verify card signatures
    [--card <file|dir>]            one card file or a directory of cards (default: the corpus dir)
  --gen-key --out <privateKeyPath> --pub-out <publicKeyPath>
                                   generate an Ed25519 keypair (paths are always explicit)
  --json                           machine-readable output for --sign/--verify
  --help                           show this help`;

async function findSkillDirs() {
  const EXCLUDED_DIRS = new Set([
    'platform', 'node_modules', '.git', 'dist', 'scripts',
    'agent-cards', 'artifacts', 'fixtures', 'schemas', 'traces',
    'state', 'runs', 'evals', 'prompts', 'assets', 'references',
    'behavioral-fixtures', 'tests', 'mcp-server', 'audit'
  ]);
  const categories = await fs.readdir(SKILLS_DIR, { withFileTypes: true });
  const skills = [];
  for (const cat of categories) {
    if (!cat.isDirectory()) continue;
    if (EXCLUDED_DIRS.has(cat.name)) continue;
    const catPath = path.join(SKILLS_DIR, cat.name);
    const entries = await fs.readdir(catPath, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isDirectory() && !EXCLUDED_DIRS.has(entry.name)) {
        skills.push({ category: cat.name, name: entry.name, path: path.join(catPath, entry.name) });
      }
    }
  }
  return skills;
}

function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return {};
  const fm = {};
  for (const line of match[1].split('\n')) {
    const keyMatch = line.match(/^([A-Za-z][A-Za-z0-9-]*):\s*(.*)$/);
    if (keyMatch) {
      const key = keyMatch[1];
      const value = keyMatch[2].trim();
      if (value.startsWith('[') && value.endsWith(']')) {
        fm[key] = value.slice(1, -1).split(',').map(s => s.trim());
      } else if (value.startsWith('"') && value.endsWith('"')) {
        fm[key] = value.slice(1, -1);
      } else {
        fm[key] = value;
      }
    }
  }
  return fm;
}

async function generateCard(skill) {
  const skillMdPath = path.join(skill.path, 'SKILL.md');
  const content = await fs.readFile(skillMdPath, 'utf8');
  const fm = parseFrontmatter(content);
  
  const card = {
    name: fm.name || skill.name,
    description: fm.description || '',
    url: `https://github.com/quirk/example/blob/main/.agents/skills/${skill.category}/${skill.name}/SKILL.md`,
    version: fm.version || "1",
    capabilities: {
      skillInvocation: true,
      artifactProduction: !!fm.artifactType,
      workflowOrchestration: !!fm.compatibility
    },
    authentication: {
      schemes: ["none"]
    },
    skills: [{
      id: `${skill.category}/${skill.name}`,
      name: fm.name || skill.name,
      description: fm.description || '',
      tags: fm.tags || [skill.category],
      parameters: {
        trustTier: fm.trustTier,
        modelTier: fm.modelTier,
        artifactType: fm.artifactType
      }
    }]
  };
  
  return card;
}

// --- generation (default behavior, unchanged) ---

async function generateCorpus() {
  const skills = await findSkillDirs();
  const pairs = [];
  for (const skill of skills) {
    try {
      pairs.push({ skill, card: await generateCard(skill) });
    } catch (err) {
      console.error(`Failed to generate card for ${skill.category}/${skill.name}:`, err.message);
    }
  }
  return pairs;
}

async function writeCorpus(pairs, outDir) {
  await fs.mkdir(outDir, { recursive: true });
  const cards = [];
  for (const { skill, card } of pairs) {
    try {
      await fs.writeFile(path.join(outDir, `${skill.category}-${skill.name}.json`), JSON.stringify(card, null, 2) + '\n');
      cards.push(card);
    } catch (err) {
      console.error(`Failed to write card for ${skill.category}/${skill.name}:`, err.message);
    }
  }
  const indexDoc = {
    totalCards: cards.length,
    generatedAt: new Date().toISOString(),
    cards
  };
  await fs.writeFile(path.join(outDir, INDEX_FILENAME), JSON.stringify(indexDoc, null, 2) + '\n');
  return cards.length;
}

async function generateOnly() {
  await fs.mkdir(OUTPUT_DIR, { recursive: true });
  const pairs = await generateCorpus();
  const written = await writeCorpus(pairs, OUTPUT_DIR);
  console.log(`Generated ${written} agent cards in ${OUTPUT_DIR}`);
}

// --- canonicalization (RFC 8785 subset) ---

// Recursive key sort by UTF-16 code unit, no insignificant whitespace, ECMAScript
// number serialization. Object key order in the source file is irrelevant, so the
// same card always yields the same signature input regardless of serializer.
export function canonicalize(value) {
  if (value === null) return 'null';
  if (Array.isArray(value)) return `[${value.map(canonicalize).join(',')}]`;
  if (typeof value === 'object') {
    // Keys with undefined values are omitted, exactly as JSON.stringify does: the
    // canonical form must describe the bytes that get written to disk, not an
    // in-memory object that still carries undefined slots.
    const keys = Object.keys(value).filter((key) => value[key] !== undefined).sort();
    return `{${keys.map((key) => `${JSON.stringify(key)}:${canonicalize(value[key])}`).join(',')}}`;
  }
  if (typeof value === 'string') return JSON.stringify(value);
  if (typeof value === 'number') return Number.isFinite(value) ? JSON.stringify(value) : 'null';
  if (typeof value === 'boolean') return value ? 'true' : 'false';
  return 'null';
}

function isPlainObject(value) {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

// The signature never signs itself: metadata.signature is removed, and metadata is
// dropped entirely when it held nothing else, so the signed payload of a card is
// exactly the canonical form of that card as it was before signing.
export function withoutSignature(card) {
  const clone = { ...card };
  if (isPlainObject(clone.metadata)) {
    const metadata = { ...clone.metadata };
    delete metadata[SIGNATURE_FIELD];
    if (Object.keys(metadata).length === 0) delete clone.metadata;
    else clone.metadata = metadata;
  }
  return clone;
}

export function signaturePayload(card) {
  return canonicalize(withoutSignature(card));
}

// --- key handling ---

function readKeyFile(keyPath) {
  return fs.readFile(path.resolve(process.cwd(), String(keyPath)), 'utf8');
}

// Accepts a public or private PEM: an Ed25519 private key carries its public half,
// so verification works with either, and signing requires the private half.
function loadKey(pem) {
  try {
    return crypto.createPublicKey(pem);
  } catch {
    return crypto.createPrivateKey(pem);
  }
}

// Accepts a PEM string or a KeyObject. crypto.createPublicKey() derives the public
// half only from a PEM or a PRIVATE KeyObject, so an already-public KeyObject is
// used as is.
export function defaultKeyId(publicKey) {
  const key = typeof publicKey === 'string'
    ? crypto.createPublicKey(publicKey)
    : publicKey.type === 'private' ? crypto.createPublicKey(publicKey) : publicKey;
  const der = key.export({ format: 'der', type: 'spki' });
  return `sha256:${crypto.createHash('sha256').update(der).digest('hex').slice(0, 16)}`;
}

// --- signing and verification ---

export function signCard(card, privateKeyPem, options = {}) {
  const key = crypto.createPrivateKey(privateKeyPem);
  const payload = signaturePayload(card);
  const value = crypto.sign(null, Buffer.from(payload, 'utf8'), key).toString('base64url');
  const signed = { ...card };
  signed.metadata = {
    ...(isPlainObject(card.metadata) ? card.metadata : {}),
    [SIGNATURE_FIELD]: {
      alg: 'Ed25519',
      keyId: options.keyId || defaultKeyId(key),
      value,
      canonicalization: CANONICALIZATION_LABEL,
      signedAt: options.signedAt || new Date().toISOString(),
    },
  };
  return signed;
}

export function verifyCard(card, publicKeyPem) {
  const signature = isPlainObject(card) && isPlainObject(card.metadata) ? card.metadata[SIGNATURE_FIELD] : undefined;
  if (!isPlainObject(signature)) return { ok: false, reason: 'card carries no metadata.signature' };
  if (signature.alg !== 'Ed25519') return { ok: false, reason: `unsupported signature alg "${signature.alg}"` };
  if (signature.canonicalization && signature.canonicalization !== CANONICALIZATION_LABEL) {
    return { ok: false, reason: `unsupported canonicalization "${signature.canonicalization}"` };
  }
  if (typeof signature.value !== 'string' || !signature.value) return { ok: false, reason: 'signature value is missing' };
  const payload = signaturePayload(card);
  try {
    const ok = crypto.verify(null, Buffer.from(payload, 'utf8'), loadKey(publicKeyPem), Buffer.from(signature.value, 'base64url'));
    return ok ? { ok: true, keyId: signature.keyId } : { ok: false, reason: 'signature does not match the card body' };
  } catch (err) {
    return { ok: false, reason: `verification error: ${err.message}` };
  }
}

// --- sign / verify / gen-key flows ---

async function signCorpus(options) {
  const keyPem = await readKeyFile(options.key);
  crypto.createPrivateKey(keyPem); // fail fast on a non-private key
  const keyId = options.keyId || defaultKeyId(loadKey(keyPem));
  const signedAt = options.signedAt || new Date().toISOString();
  const pairs = await generateCorpus();
  const signedPairs = pairs.map(({ skill, card }) => ({ skill, card: signCard(card, keyPem, { keyId, signedAt }) }));
  const outDir = path.resolve(process.cwd(), options.out || OUTPUT_DIR);
  const written = await writeCorpus(signedPairs, outDir);
  const report = {
    tool: 'generate-agent-cards',
    command: 'sign',
    keyId,
    canonicalization: CANONICALIZATION_LABEL,
    alg: 'Ed25519',
    signedAt,
    outDir,
    signedCards: written,
    status: 'pass',
  };
  if (options.json) console.log(JSON.stringify(report, null, 2));
  else console.log(`Signed ${written} agent cards with Ed25519 key ${keyId} (${CANONICALIZATION_LABEL}) in ${outDir}`);
}

async function verifyCorpus(options) {
  const keyPem = await readKeyFile(options.key);
  const target = path.resolve(process.cwd(), options.card || OUTPUT_DIR);
  const stat = await fs.stat(target);
  let files;
  if (stat.isDirectory()) {
    files = (await fs.readdir(target)).filter((name) => name.endsWith('.json') && name !== INDEX_FILENAME).sort();
  } else {
    files = [path.basename(target)];
  }
  const results = [];
  for (const file of files) {
    const filePath = stat.isDirectory() ? path.join(target, file) : target;
    let result;
    try {
      const card = JSON.parse(await fs.readFile(filePath, 'utf8'));
      result = verifyCard(card, keyPem);
    } catch (err) {
      result = { ok: false, reason: `unreadable card: ${err.message}` };
    }
    results.push({ card: file, ...result });
  }
  const failed = results.filter((entry) => !entry.ok);
  const report = {
    tool: 'generate-agent-cards',
    command: 'verify',
    target,
    verified: results.length,
    passed: results.length - failed.length,
    failed: failed.length,
    results,
    status: failed.length ? 'fail' : 'pass',
  };
  if (options.json) console.log(JSON.stringify(report, null, 2));
  else {
    console.log(`verify: ${report.passed}/${report.verified} card(s) passed in ${target}`);
    for (const entry of failed) console.log(`  FAIL ${entry.card}: ${entry.reason}`);
  }
  return failed.length ? 1 : 0;
}

async function genKeyPair(options) {
  if (!options.out) {
    console.error('generate-agent-cards: --gen-key requires --out <privateKeyPath>; keys are only written to explicit paths');
    return 2;
  }
  const { publicKey, privateKey } = crypto.generateKeyPairSync('ed25519');
  const privatePem = privateKey.export({ type: 'pkcs8', format: 'pem' });
  const publicPem = publicKey.export({ type: 'spki', format: 'pem' });
  const privatePath = path.resolve(process.cwd(), options.out);
  await fs.mkdir(path.dirname(privatePath), { recursive: true });
  await fs.writeFile(privatePath, privatePem);
  if (options.pubOut) {
    const publicPath = path.resolve(process.cwd(), options.pubOut);
    await fs.mkdir(path.dirname(publicPath), { recursive: true });
    await fs.writeFile(publicPath, publicPem);
  }
  const keyId = defaultKeyId(loadKey(publicPem));
  if (options.json) {
    console.log(JSON.stringify({
      tool: 'generate-agent-cards',
      command: 'gen-key',
      alg: 'Ed25519',
      keyId,
      privateKeyPath: privatePath,
      publicKeyPath: options.pubOut ? path.resolve(process.cwd(), options.pubOut) : null,
    }, null, 2));
  } else {
    console.log(`Generated Ed25519 keypair (keyId ${keyId})`);
    console.log(`  private key: ${privatePath}`);
    if (options.pubOut) console.log(`  public key:  ${path.resolve(process.cwd(), options.pubOut)}`);
    else console.log(publicPem);
  }
  return 0;
}

export async function main(argv = process.argv.slice(2)) {
  if (argv.includes('--help') || argv.includes('-h')) {
    console.log(usage);
    return 0;
  }
  const valueOf = (flag) => {
    const index = argv.indexOf(flag);
    return index === -1 ? undefined : argv[index + 1];
  };
  const options = {
    key: valueOf('--key'),
    keyId: valueOf('--key-id'),
    out: valueOf('--out'),
    pubOut: valueOf('--pub-out'),
    card: valueOf('--card'),
    signedAt: valueOf('--signed-at'),
    json: argv.includes('--json'),
  };

  if (argv.includes('--gen-key')) return genKeyPair(options);
  if (argv.includes('--sign')) {
    if (!options.key) {
      console.error('generate-agent-cards: --sign requires --key <privateKeyPath>');
      return 2;
    }
    await signCorpus(options);
    return 0;
  }
  if (argv.includes('--verify')) {
    if (!options.key) {
      console.error('generate-agent-cards: --verify requires --key <publicKeyPath>');
      return 2;
    }
    return verifyCorpus(options);
  }
  await generateOnly();
  return 0;
}

const invokedDirectly = (() => {
  try {
    return process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
  } catch {
    return false;
  }
})();

if (invokedDirectly) {
  main().then((code) => process.exit(code)).catch((err) => {
    console.error('Error:', err.message);
    process.exit(1);
  });
}
