#!/usr/bin/env bash
set -euo pipefail

# setup-quirk-skills.sh - Initializes the quirk skills bundle in a target repo
# Usage: bash scripts/setup-quirk-skills.sh <target-repo-path> [source-repo-path]

usage() {
  cat <<'EOF'
Usage: setup-quirk-skills.sh <target-repo-path> [source-repo-path]

Copies the quirk skills bundle into <target-repo-path>.
If source-repo-path is omitted, the script uses the directory containing this script.
EOF
}

if [[ $# -lt 1 || $# -gt 2 ]]; then
  usage
  exit 1
fi

target_repo="$1"
if [[ $# -eq 2 ]]; then
  source_repo="$2"
else
  script_dir="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
  source_repo="$(cd -- "$script_dir/.." && pwd)"
fi

copy_path() {
  local src="$1" dst="$2"
  if [[ -e "$src" ]]; then
    rm -rf "$dst"
    mkdir -p "$(dirname -- "$dst")"
    cp -a "$src" "$dst"
  fi
}

mkdir -p "$target_repo"
copy_path "$source_repo/.agents/skills" "$target_repo/.agents/skills"
copy_path "$source_repo/.claude/skills" "$target_repo/.claude/skills"
copy_path "$source_repo/docs/agents" "$target_repo/docs/agents"
copy_path "$source_repo/docs/adr/README.md" "$target_repo/docs/adr/README.md"
copy_path "$source_repo/CONTEXT.md" "$target_repo/CONTEXT.md"
copy_path "$source_repo/skills-lock.json" "$target_repo/skills-lock.json"

# Initialize the sandbox if it doesn't exist
if [[ ! -d "$target_repo/.skill-sandbox" ]]; then
  mkdir -p "$target_repo/.skill-sandbox/validations"
  mkdir -p "$target_repo/.skill-sandbox/behavioral-fixtures"
  echo '{"status":"initialized","sandbox":"root"}' > "$target_repo/.skill-sandbox/manifest.json"
fi

# Create a seed bundle with well-documented starter skills
mkdir -p "$target_repo/seed/integration-playground"
mkdir -p "$target_repo/seed/testing-framework"

# Starter skill: integration-playground
cat > "$target_repo/seed/integration-playground/SKILL.md" <<'EOF'
---
name: integration-playground
description: A playground environment for testing and developing quirk skills locally.
version: 1
capabilities:
  - create-skill
  - validate-skill
  - run-skill
  - export-skill
  - import-skill
inputs:
  - skill-template: Path to a skill template (optional)
  - test-case: Description of the test scenario
  - environment: Target environment (default: general)
outputs:
  - skill-result: The resulting skill object with validation evidence
  - test-report: Detailed test results
  - execution-log: Full execution log
stopCondition: The skill result is complete and validation passes
risk: medium
trustTier: 3
maxIterations: 10
---

# Integration Playground

## Contract
- Input: test case and environment specification
- Output: skill result with validation evidence
- Boundary: isolated from production code

## Process
1. Parse the test case.
2. Execute against the environment.
3. Collect output and validation evidence.
4. Report results.

## Guardrails
- Never write to the target repo outside the sandbox.
- Surface uncertainty and failures explicitly.
EOF

# Starter skill: testing-framework
cat > "$target_repo/seed/testing-framework/SKILL.md" <<'EOF'
---
name: testing-framework
description: Provides standardized testing utilities for quirk skills.
version: 1
capabilities:
  - define-test
  - run-test
  - collect-coverage
  - generate-report
inputs:
  - test-type: Unit, integration, e2e
  - target: Path to codebase or endpoint
  - assertions: List of expected behaviors
outputs:
  - test-suite: Executable test suite
  - coverage-report: Coverage metrics
  - report: Test results summary
stopCondition: Tests pass or fail according to defined criteria
risk: low
trustTier: 2
maxIterations: 5
---

# Testing Framework

## Contract
- Input: test type, target, and assertions
- Output: test suite and coverage report
- Boundary: read-only analysis of target

## Process
1. Parse test type and target.
2. Define test cases from assertions.
3. Execute tests.
4. Collect coverage and report results.

## Guardrails
- Do not modify the target codebase.
- Surface failures with clear evidence.
EOF

cat > "$target_repo/seed/README.md" <<'EOF'
# Seed Bundle

This bundle contains starter skills to get you up and running quickly.

## Skills Included

- **integration-playground** – Local playground for testing and developing skills.
- **testing-framework** – Standardized testing utilities for skill validation.

## Usage

```bash
# Template a new skill
node .agents/skills/platform/skill-lab.mjs template --domain integration

# Validate all skills
node .agents/skills/platform/skill-lab.mjs validate

# Generate a dependency graph
node .agents/skills/platform/skill-lab.mjs graph

# Run metrics
node .agents/skills/platform/skill-lab.mjs metrics
```

## Contributing

See [CONTRIBUTING.md](../CONTRIBUTING.md) for guidelines.
EOF

echo "setup-quirk-skills completed: $target_repo"

# Interrogation section (tracks tracker, labels, docs)
echo ""
echo "=== QUIRK SKILLS SETUP ==="
echo "This will configure the bundle for your repo."

echo -n "Which issue tracker? (github/linear/local) [github]: "
read TRACKER
TRACKER=${TRACKER:-github}

echo -n "Triangulation labels (comma-separated) [bug,feature,refactor]: "
read LABELS
LABELS=${LABELS:-bug,feature,refactor}

echo -n "Where to save docs? (docs/agent-notes) [docs/agents]: "
read DOCS_DIR
DOCS_DIR=${DOCS_DIR:-docs/agents}

echo ""
echo "Configured: tracker=$TRACKER, labels=$LABELS, docs=$DOCS_DIR"
echo "Saving to $target_repo/$DOCS_DIR/config.md"
mkdir -p "$target_repo/$DOCS_DIR"
echo "# Quirk Skills Config\n\n- tracker: $TRACKER\n- triage_labels: $LABELS\n- docs_dir: $DOCS_DIR\n- installed: $(date -Iseconds)" > "$target_repo/$DOCS_DIR/config.md"
