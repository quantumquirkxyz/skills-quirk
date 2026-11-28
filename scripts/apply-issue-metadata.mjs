#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

function assertStringArray(value, name) {
  if (value === undefined) return [];
  if (!Array.isArray(value) || value.some(x => typeof x !== 'string' || !x.trim())) throw new TypeError(name + ' must be an array of non-empty strings');
  return [...new Set(value.map(x => x.trim()))];
}
function assertIssueArray(value, name) {
  if (value === undefined) return [];
  if (!Array.isArray(value) || value.some(x => !Number.isSafeInteger(x) || x < 1)) throw new TypeError(name + ' must be an array of positive issue numbers');
  return [...new Set(value)];
}
export function normalizeIssueMetadata(metadata = {}) {
  if (!metadata || typeof metadata !== 'object' || Array.isArray(metadata)) throw new TypeError('metadata must be an object');
  const relationships = metadata.relationships ?? {};
  const development = metadata.development ?? {};
  const fields = metadata.fields ?? {};
  const normalized = {
    assignees: assertStringArray(metadata.assignees, 'assignees'),
    labels: assertStringArray(metadata.labels, 'labels'),
    milestone: metadata.milestone === undefined ? null : metadata.milestone,
    projects: assertStringArray(metadata.projects, 'projects'),
    fields: {
      work_type: fields.work_type ?? null,
      repo_scope: fields.repo_scope ?? null,
      phase: fields.phase ?? null,
      priority: fields.priority ?? null,
      risk: fields.risk ?? null,
      sprint: fields.sprint ?? null,
      release_train: fields.release_train ?? null,
    },
    relationships: {
      parent: relationships.parent ?? null,
      subIssues: assertIssueArray(relationships.subIssues, 'relationships.subIssues'),
      blockedBy: assertIssueArray(relationships.blockedBy, 'relationships.blockedBy'),
      blocking: assertIssueArray(relationships.blocking, 'relationships.blocking'),
      related: assertIssueArray(relationships.related, 'relationships.related'),
    },
    development: {
      branch: development.branch ?? null,
      pullRequest: development.pullRequest ?? null,
    },
  };
  if (normalized.milestone !== null && (typeof normalized.milestone !== 'string' || !normalized.milestone.trim())) throw new TypeError('milestone must be null or a non-empty string');
  if (normalized.relationships.parent !== null && (!Number.isSafeInteger(normalized.relationships.parent) || normalized.relationships.parent < 1)) throw new TypeError('relationships.parent must be null or a positive issue number');
  if (normalized.development.branch) {
    const branch = normalized.development.branch;
    if (typeof branch !== 'object' || typeof branch.name !== 'string' || !branch.name.trim()) throw new TypeError('development.branch.name is required');
    normalized.development.branch = { name: branch.name.trim(), base: typeof branch.base === 'string' && branch.base.trim() ? branch.base.trim() : 'main' };
  }
  if (normalized.development.pullRequest) {
    const pr = normalized.development.pullRequest;
    if (typeof pr !== 'object' || (!Number.isSafeInteger(pr.number) && typeof pr.url !== 'string')) throw new TypeError('development.pullRequest requires number or url');
  }
  for (const [name, value] of Object.entries(normalized.fields)) {
    if (value !== null && (typeof value !== 'string' || !value.trim())) throw new TypeError('fields.' + name + ' must be null or a non-empty string');
  }
  return normalized;
}

export function buildIssueMetadataPlan({ repo, issue, metadata }) {
  if (typeof repo !== 'string' || !/^[^/\s]+\/[^/\s]+$/.test(repo)) throw new TypeError('repo must use owner/name');
  if (!Number.isSafeInteger(issue) || issue < 1) throw new TypeError('issue must be a positive integer');
  const m = normalizeIssueMetadata(metadata);
  const edit = ['issue', 'edit', String(issue), '--repo', repo];
  for (const value of m.assignees) edit.push('--add-assignee', value);
  for (const value of m.labels) edit.push('--add-label', value);
  if (m.milestone) edit.push('--milestone', m.milestone);
  for (const value of m.projects) edit.push('--add-project', value);
  if (m.relationships.parent) edit.push('--parent', String(m.relationships.parent));
  for (const value of m.relationships.subIssues) edit.push('--add-sub-issue', String(value));
  for (const value of m.relationships.blockedBy) edit.push('--add-blocked-by', String(value));
  for (const value of m.relationships.blocking) edit.push('--add-blocking', String(value));

  const commands = [];
  if (edit.length > 5) commands.push({ kind: 'issue-metadata', argv: ['gh', ...edit] });
  if (m.development.branch) {
    commands.push({
      kind: 'development-branch',
      argv: ['gh', 'issue', 'develop', String(issue), '--repo', repo, '--base', m.development.branch.base, '--name', m.development.branch.name],
    });
  }
  // "related" and existing PR linkage are intentionally returned as handoffs because
  // GitHub CLI exposes native dependency/parent/sub-issue mutation but not a generic
  // related-issue mutation or attach-existing-PR flag. Do not fake these relationships.
  const handoffs = [];
  if (m.relationships.related.length) handoffs.push({ kind: 'related-issues', issues: m.relationships.related, note: 'No generic gh issue edit mutation exists; preserve these as explicit related references or use a supported GitHub API when available.' });
  if (m.development.pullRequest) handoffs.push({ kind: 'pull-request-link', pullRequest: m.development.pullRequest, note: 'Existing PR linkage is verified separately; branch creation via gh issue develop is the native Development mutation supported here.' });
  if (Object.values(m.fields).some(Boolean)) handoffs.push({ kind: 'project-fields', fields: m.fields, note: 'Project V2 custom fields are set with the make-project/project item flow after the issue is added to a project.' });
  return { schemaVersion: 1, repo, issue, metadata: m, commands, handoffs };
}

function run(argv) {
  return spawnSync(argv[0], argv.slice(1), { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], timeout: 120000 });
}

async function main() {
  const args = process.argv.slice(2);
  const value = name => { const i = args.indexOf(name); return i >= 0 ? args[i + 1] : null; };
  const repo = value('--repo');
  const issue = Number(value('--issue'));
  const file = value('--metadata');
  const write = args.includes('--write');
  if (!repo || !Number.isSafeInteger(issue) || !file) throw new Error('Usage: apply-issue-metadata.mjs --repo owner/repo --issue N --metadata metadata.json [--write]');
  const metadata = JSON.parse(await fs.readFile(path.resolve(file), 'utf8'));
  const plan = buildIssueMetadataPlan({ repo, issue, metadata });
  if (!write) {
    console.log(JSON.stringify({ status: 'pass', mode: 'dry-run', ...plan }, null, 2));
    return;
  }
  const results = [];
  for (const command of plan.commands) {
    const result = run(command.argv);
    results.push({ kind: command.kind, exitCode: result.status, stderr: (result.stderr || '').slice(-2000) });
    if (result.status !== 0) {
      console.log(JSON.stringify({ status: 'blocked', mode: 'write', plan, results }, null, 2));
      process.exitCode = 1;
      return;
    }
  }
  console.log(JSON.stringify({ status: 'pass', mode: 'write', plan, results }, null, 2));
}

const invokedDirectly = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (invokedDirectly) main().catch(error => { console.error(error.message); process.exitCode = 2; });
