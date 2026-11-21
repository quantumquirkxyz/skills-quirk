#!/usr/bin/env node
// a2a-router.mjs - discover and route to Agent Card entries.
// Read-only: it resolves cards and prints a route decision; it never invokes a
// skill or mutates state. Callers execute the suggested skill themselves.
//
// Usage:
//   node .agents/skills/platform/a2a-router.mjs list [--json]
//   node .agents/skills/platform/a2a-router.mjs discover <capability|term> [--json] [--limit N]
//   node .agents/skills/platform/a2a-router.mjs invoke <agentCardName> [--json]

import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const platformDir = dirname(fileURLToPath(import.meta.url));
const cardsDir = join(platformDir, 'agent-cards');
const indexPath = join(cardsDir, 'index.json');

function loadCards() {
  if (!existsSync(indexPath)) throw new Error(`missing agent card index: ${indexPath}`);
  const index = JSON.parse(readFileSync(indexPath, "utf8"));
  const byFile = new Map();
  for (const file of readdirSync(cardsDir)) {
    if (!file.endsWith(".json") || file === "index.json") continue;
    const path = join(cardsDir, file);
    try {
      const card = JSON.parse(readFileSync(path, "utf8"));
      if (card && typeof card.name === "string") byFile.set(card.name, { card, path });
    } catch {}
  }
  const cards = new Map();
  for (const entry of index.cards ?? []) {
    const hit = byFile.get(entry.name) ?? null;
    cards.set(entry.name, { entry, card: hit?.card ?? null, path: hit?.path ?? null });
  }
  return { index, cards };
}

function termsOf(card) {
  const text = [card?.name, card?.description, ...(card?.skills ?? []).flatMap((skill) => [skill.name, skill.description, ...(skill.tags ?? [])])]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
  return new Set(text.replace(/["'`]/g, ' ').split(/[^a-z0-9-]+/).filter((term) => term.length > 2));
}

function routeToCapability(query) {
  const { cards } = loadCards();
  const wanted = [...new Set(query.toLowerCase().split(/[^a-z0-9-]+/).filter((term) => term.length > 2))];
  if (wanted.length === 0) return [];
  const entries = [];
  for (const [name, { card }] of cards) {
    if (!card) continue;
    entries.push({ name, card, terms: termsOf(card) });
  }
  // Inverse document frequency keeps a common word such as "management" from
  // outranking a distinctive one such as "release".
  const df = new Map(wanted.map((term) => [term, entries.filter(({ terms }) => terms.has(term)).length]));
  const idf = (term) => Math.log((entries.length + 1) / ((df.get(term) ?? 0) + 1)) + 1;
  const scored = [];
  for (const { name, card, terms } of entries) {
    const matched = wanted.filter((term) => terms.has(term));
    if (matched.length === 0) continue;
    const score = matched.reduce((total, term) => total + idf(term), 0) / wanted.length;
    scored.push({ name, score, path: `.agents/skills/${card.skills?.[0]?.id ?? name}/SKILL.md`, description: card.description });
  }
  scored.sort((a, b) => b.score - a.score || a.name.localeCompare(b.name));
  return scored;
}

function graphCandidates(query, limit) {
  const graph = join(platformDir, "skill-graph.mjs");
  if (!existsSync(graph)) return null;
  const run = spawnSync(process.execPath, [graph, "rank", query, "--json", "--limit", String(limit)], { encoding: "utf8" });
  if (run.status !== 0) return null;
  try {
    const payload = JSON.parse(run.stdout);
    const { cards } = loadCards();
    return (payload.candidates ?? [])
      .map((candidate) => {
        const hit = cards.get(candidate.name);
        if (!hit?.card) return null;
        return { name: candidate.name, score: candidate.score, tier: candidate.tier, path: `.agents/skills/${hit.card.skills?.[0]?.id ?? candidate.name}/SKILL.md`, description: hit.card.description };
      })
      .filter(Boolean);
  } catch {
    return null;
  }
}

function main() {
  const [command, arg] = process.argv.slice(2);
  const json = process.argv.includes('--json');
  const limitFlag = process.argv.indexOf('--limit');
  const limit = limitFlag === -1 ? 10 : Number(process.argv[limitFlag + 1]) || 10;

  if (!command || command === 'list') {
    const { index, cards } = loadCards();
    const names = [...cards.keys()].sort();
    if (json) {
      process.stdout.write(JSON.stringify({ totalCards: index.totalCards ?? names.length, cards: names }, null, 2) + '\n');
    } else {
      console.log(`${index.totalCards ?? names.length} agent cards`);
      for (const name of names) console.log(`- ${name}`);
    }
    return 0;
  }

  if (command === 'discover') {
    if (!arg) throw new Error('discover requires a capability or term');
    const matches = (graphCandidates(arg, limit) ?? routeToCapability(arg)).slice(0, limit);
    if (json) {
      process.stdout.write(JSON.stringify({ query: arg, matches }, null, 2) + '\n');
    } else if (matches.length === 0) {
      console.log(`no agent card matches "${arg}"`);
    } else {
      for (const match of matches) console.log(`${match.score}\t${match.name}\t${match.description ?? ''}`);
    }
    return 0;
  }

  if (command === 'invoke') {
    if (!arg) throw new Error('invoke requires an agent card name');
    const { cards } = loadCards();
    const found = cards.get(arg);
    if (!found) throw new Error(`unknown agent card: ${arg}`);
    if (!found.card) throw new Error(`agent card entry exists but its JSON is missing: ${arg}`);
    const route = {
      agentCard: arg,
      cardPath: found.path,
      skillId: found.card.skills?.[0]?.id ?? null,
      skillPath: `.agents/skills/${found.card.skills?.[0]?.id ?? arg}/SKILL.md`,
      trustTier: found.card.skills?.[0]?.parameters?.trustTier ?? null,
      note: 'Route only. Load the skill and follow its contract before acting.',
    };
    if (json) process.stdout.write(JSON.stringify(route, null, 2) + '\n');
    else console.log(`${route.skillId}\n${route.skillPath}\ntrustTier=${route.trustTier ?? 'unknown'}`);
    return 0;
  }

  throw new Error(`unknown command: ${command}`);
}

try {
  process.exitCode = main();
} catch (error) {
  console.error(`a2a-router: ${error.message}`);
  process.exitCode = 1;
}
