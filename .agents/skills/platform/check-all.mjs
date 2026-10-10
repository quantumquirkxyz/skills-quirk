import { spawn } from 'node:child_process';
import { defaultDagFile } from './dag-scheduler.mjs';

const checks = [
  ['node', ['.agents/skills/platform/validate-skills.mjs']],
  ['node', ['.agents/skills/platform/audit-semantics.mjs']],
  ['node', ['.agents/skills/platform/evaluate-scenarios.mjs']],
  ['node', ['.agents/skills/platform/evaluate-behavioral-fixtures.mjs']],
  ['node', ['--check', '.agents/skills/platform/audit-semantics.mjs']],
  ['node', ['--check', '.agents/skills/platform/evaluate-scenarios.mjs']],
  ['node', ['--check', '.agents/skills/platform/evaluate-behavioral-fixtures.mjs']],
  ['node', ['--check', '.agents/skills/platform/sync-bundle.mjs']],
  ['bash', ['-n', '.agents/skills/delivery/diagnosing-bugs/scripts/hitl-loop.template.sh']],
  ['node', ['--test', '.agents/skills/platform/tests/*.test.mjs']],
];

const reportOnlyChecks = [
  ['node', ['.agents/skills/platform/context-budget-auditor.mjs', '--json', '--no-write']],
  ['node', ['.agents/skills/platform/cost-ledger.mjs', '--json']],
  ['node', ['.agents/skills/platform/validate-spec-compliance.mjs', '--json']],
  ['node', ['.agents/skills/platform/skill-graph.mjs', 'build', '--json']],
];

const dagFile = defaultDagFile();
const dagGateChecks = dagFile
  ? [['node', ['.agents/skills/platform/dag-scheduler.mjs', '--check', dagFile, '--json']]]
  : [];
const dagSkipReason = 'no default ticket DAG file under .agents/skills/platform/workflows or .agents/skills/platform/artifacts';

function run(command, args) {
  return new Promise((resolve) => {
    const child = spawn(command, args, { cwd: process.cwd(), stdio: ['ignore', 'pipe', 'pipe'] });
    let stdout = '';
    let stderr = '';
    child.stdout.on('data', (chunk) => { stdout += chunk; });
    child.stderr.on('data', (chunk) => { stderr += chunk; });
    child.on('close', (code) => {
      resolve({ command: [command, ...args].join(' '), code, stdout, stderr });
    });
  });
}

function parseJson(text) {
  try { return JSON.parse(text); } catch { return null; }
}

const gatingResults = [];
for (const [command, args] of [...checks, ...dagGateChecks]) {
  gatingResults.push(await run(command, args));
}
const reportResults = [];
for (const [command, args] of reportOnlyChecks) {
  reportResults.push(await run(command, args));
}

const failures = gatingResults.filter((result) => result.code !== 0);
const reportFailures = reportResults.filter((result) => result.code !== 0);

const parsedResults = gatingResults.map((result) => parseJson(result.stdout.trim()));
const structuredChecks = gatingResults.map((result, index) => {
  const parsed = parsedResults[index];
  return {
    command: result.command,
    status: result.code === 0 ? 'pass' : 'fail',
    code: result.code,
    skills: parsed?.skills ?? null,
    scenarios: parsed?.scenarios ?? null,
    fixtures: parsed?.fixtures ?? null,
    warnings: parsed?.warnings?.length ?? 0,
    errors: parsed?.errors?.length ?? 0,
  };
});

const reportChecks = reportResults.map((result) => {
  const parsed = parseJson(result.stdout.trim()) ?? {};
  return {
    command: result.command,
    status: result.code === 0 ? 'pass' : 'fail',
    code: result.code,
    mode: 'report-only',
    skills: parsed?.skills ?? null,
    scenarios: parsed?.scenarios ?? null,
    fixtures: parsed?.fixtures ?? null,
    warnings: parsed?.warnings?.length ?? 0,
    errors: parsed?.errors?.length ?? 0,
    detail: parsed?.totalTokens ?? parsed?.nodes ?? null,
  };
});

const skippedChecks = dagFile ? [] : [{
  command: 'node .agents/skills/platform/dag-scheduler.mjs --check',
  status: 'skip',
  code: null,
  mode: 'skipped',
  skills: null,
  scenarios: null,
  fixtures: null,
  warnings: 0,
  errors: 0,
  reason: dagSkipReason,
}];

const allChecks = [...structuredChecks, ...reportChecks, ...skippedChecks];
const skillsCount = structuredChecks.find((check, index) => parsedResults[index]?.skills !== undefined)?.skills
  ?? structuredChecks.find((check, index) => parsedResults[index]?.skills)?.skills ?? null;

const report = {
  status: failures.length ? 'fail' : 'pass',
  checks: structuredChecks,
  reportChecks,
  skippedChecks,
  summary: {
    totalChecks: gatingResults.length,
    passed: gatingResults.length - failures.length,
    failed: failures.length,
    skippedChecks: skippedChecks.length,
    reportChecks: reportChecks.length,
    skillsEvaluated: skillsCount,
    totalWarnings: allChecks.reduce((total, check) => total + check.warnings, 0),
    totalErrors: allChecks.reduce((total, check) => total + check.errors, 0),
  },
};

console.log(JSON.stringify(report, null, 2));

if (failures.length) {
  for (const failure of failures) {
    console.error(`\n${failure.command}`);
    if (failure.stdout.trim()) console.error(failure.stdout.trim());
    if (failure.stderr.trim()) console.error(failure.stderr.trim());
  }
  process.exit(1);
}

if (reportFailures.length) {
  console.error(`\nreport-only checks reported errors (gate stays ${report.status}):`);
  for (const failure of reportFailures) {
    console.error(`${failure.command}${failure.code === null ? ' (crashed)' : ` (exit ${failure.code})`}`);
    if (failure.stderr.trim()) console.error(failure.stderr.trim());
  }
}
