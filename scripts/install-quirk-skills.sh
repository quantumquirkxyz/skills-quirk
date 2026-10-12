#!/usr/bin/env bash
set -euo pipefail

usage() {
  cat <<'EOF'
Usage: install-quirk-skills.sh <target-repo-path> [source-repo-path]

Copies the quirk skills bundle into <target-repo-path>.
This installer replaces bundle-managed paths and is intended for greenfield targets.
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
  script_dir="$(CDPATH= cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
  source_repo="$(CDPATH= cd -- "$script_dir/.." && pwd)"
fi

copy_path() {
  local src="$1"
  local dst="$2"
  if [[ -e "$src" ]]; then
    rm -rf "$dst"
    mkdir -p "$(dirname -- "$dst")"
    cp -a "$src" "$dst"
  fi
}

mkdir -p "$target_repo"
copy_path "$source_repo/.agents/skills" "$target_repo/.agents/skills"
copy_path "$source_repo/.claude/skills" "$target_repo/.claude/skills"
copy_path "$source_repo/docs/reference/agents" "$target_repo/docs/reference/agents"
copy_path "$source_repo/docs/reference/adr/README.md" "$target_repo/docs/reference/adr/README.md"
copy_path "$source_repo/docs/how-to" "$target_repo/docs/how-to"
copy_path "$source_repo/docs/explanation" "$target_repo/docs/explanation"
copy_path "$source_repo/AUTHORSHIP.md" "$target_repo/AUTHORSHIP.md"
copy_path "$source_repo/CONTEXT.md" "$target_repo/CONTEXT.md"
copy_path "$source_repo/skills-lock.json" "$target_repo/skills-lock.json"
copy_path "$source_repo/skills.json" "$target_repo/skills.json"
copy_path "$source_repo/.env.template" "$target_repo/.env.template"

echo "Installed quirk Skills into $target_repo"
