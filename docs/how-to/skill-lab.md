# Skill Lab

The repository includes a dependency-free toolkit at
`.agents/skills/platform/skill-lab.mjs` for creating, validating, exploring,
testing, and measuring quirk Skills. Run it from the repository root:

```bash
node .agents/skills/platform/skill-lab.mjs --help
```

## Create and validate a sandbox Skill

Templates are written below `.skill-sandbox/<name>/` and never overwrite an
existing template. Capability values must be a non-empty JSON array.

```bash
node .agents/skills/platform/skill-lab.mjs template my-skill \
  --domain testing \
  --description "Validate testing workflows" \
  --capabilities '["run-tests","report-evidence"]'
node .agents/skills/platform/skill-lab.mjs validate .skill-sandbox/my-skill --json
node .agents/skills/platform/skill-lab.mjs validate .skill-sandbox/my-skill \
  --execute --json
```

`validate` checks frontmatter, the contract (`Input`, `Output`, and
`Boundary`), dependencies, risk metadata, and common placeholders. `--execute`
also runs sandbox validation and behavioral fixtures when the generated
sandbox contains them. A full-bundle validation is available with no path:

```bash
node .agents/skills/platform/skill-lab.mjs validate --json
```

Validation does not promote a sandbox Skill. Promotion remains a separate,
reviewed repository change.

## Explore the bundle

```bash
node .agents/skills/platform/skill-lab.mjs list --json
node .agents/skills/platform/skill-lab.mjs search "testing evidence" --json
node .agents/skills/platform/skill-lab.mjs graph --format mermaid
node .agents/skills/platform/skill-lab.mjs graph --format json
node .agents/skills/platform/skill-lab.mjs rules --json
```

`graph` uses declared dependencies only and reports cycles and highly central
Skills. `rules` extracts rule-like Markdown lines; it is a catalog, not a
semantic proof that every rule is enforced.

## Compare and learn

```bash
node .agents/skills/platform/skill-lab.mjs diff old/SKILL.md new/SKILL.md
node .agents/skills/platform/skill-lab.mjs tutorial skill-tutor
node .agents/skills/platform/skill-lab.mjs tutorial skill-dev/skill-tutor
```

`tutorial` accepts a unique Skill name or a repository-relative `SKILL.md`
path. A unique basename such as `skill-tutor` is resolved across nested
domains; use the path when names are ambiguous.

## Measure runs and cost

```bash
node .agents/skills/platform/skill-lab.mjs metrics
node .agents/skills/platform/skill-lab.mjs metrics .agents/skills/platform/skill-runs
node .agents/skills/platform/skill-lab.mjs cost --by-skill --json
node .agents/skills/platform/skill-lab.mjs cost --by-day --since 2026-01-01 --no-estimate
```

`metrics` reads JSON execution records and reports only durations that are
actually present; missing duration is reported as unavailable, not zero. The
cost command reads platform traces and the local cost model. Dollar values are
estimates unless `--no-estimate` is used.

## Use the isolated playground

The playground creates filesystem, API, and database fixtures in a new
directory under the system temporary directory. It refuses existing paths and
does not allow output outside that temporary directory.

```bash
node .agents/skills/platform/skill-lab.mjs playground
node .agents/skills/platform/skill-lab.mjs playground \
  --output /tmp/quirk-playground-unique \
  --fixtures '{"filesystem":"sample","api":{"status":"ok"}}'
node .agents/skills/platform/skill-lab.mjs playground \
  --command '["node","check-fixtures.mjs"]'
```

`--command` must be a JSON array whose executable is `node`; it runs with
filesystem permissions limited to the playground directory and returns the
child exit code and captured output. Choose a fresh disposable output path for
each run.

## Review a committed change

```bash
node .agents/skills/platform/skill-lab.mjs pr-check --base main
```

`pr-check` compares committed `SKILL.md` paths between `<base>...HEAD` and
returns the checks that should be reviewed. It is a recommendation report; it
does not itself run validation or inspect uncommitted changes. Run validation
on each changed Skill, then run the repository gate before publishing:

```bash
node .agents/skills/platform/skill-lab.mjs validate path/to/SKILL.md --json
node .agents/skills/platform/check-all.mjs
```

The `evolve` and `work-item` subcommands delegate to the platform evolver and
repository work-item router respectively. Consult their command help before
using them because they may write artifacts or change workflow state.
