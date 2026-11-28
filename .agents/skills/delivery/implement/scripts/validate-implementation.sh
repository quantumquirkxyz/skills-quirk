#!/usr/bin/env bash
set -euo pipefail

# validate-implementation.sh — post-implementation validation harness
# Usage: ./scripts/validate-implementation.sh <issue-id> <branch-name>

ISSUE_ID="${1:?issue-id required}"
BRANCH="${2:?branch-name required}"
ARTIFACT_DIR=".agents/skills/platform/artifacts/implement"
ARTIFACT_FILE="${ARTIFACT_DIR}/${ISSUE_ID}.json"

echo "=== Validate Implementation ==="
echo "Issue:   ${ISSUE_ID}"
echo "Branch:  ${BRANCH}"
echo ""

if [[ ! -f "${ARTIFACT_FILE}" ]]; then
  echo "FAIL: artifact missing: ${ARTIFACT_FILE}"
  exit 1
fi

if ! node .agents/skills/delivery/implement/scripts/validate-implementation.mjs "${ARTIFACT_FILE}" "${BRANCH}"; then
  exit 1
fi

CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
if [[ "${CURRENT_BRANCH}" != "${BRANCH}" ]]; then
  echo "FAIL: on branch '${CURRENT_BRANCH}', expected '${BRANCH}'"
  exit 1
fi

echo "PASS: branch matches"

echo ""
echo "All validation checks passed."
