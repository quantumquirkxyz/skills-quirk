#!/usr/bin/env python3
"""Render a PR bundle (title, body, metadata) from git and linked-issue data.

Read-only with respect to the repository: it inspects git and, when available,
GitHub issue metadata. It never pushes, opens, or edits a PR.

Usage (from this skill directory):
    python3 scripts/render_pr_bundle.py --base main
    python3 scripts/render_pr_bundle.py --base main --issue 42 --out /tmp/pr.json
    python3 scripts/render_pr_bundle.py --base main --issue 42 --body-file /tmp/pr-body.md
    python3 scripts/render_pr_bundle.py --base main --validation "node --test: pass"

Requires git. Issue metadata requires the GitHub CLI (`gh`) and an authenticated
session; without it the bundle is still produced and the limitation is reported.
"""

from __future__ import annotations

import argparse
import json
import shutil
import subprocess
import sys
from pathlib import Path

TRIAGE_LABEL_PREFIXES = ("triage:", "status:", "needs-")


def run(args: list[str], cwd: str | None = None) -> tuple[int, str, str]:
    try:
        proc = subprocess.run(
            args, cwd=cwd, capture_output=True, text=True, check=False
        )
        return proc.returncode, proc.stdout.strip(), proc.stderr.strip()
    except FileNotFoundError:
        return 127, "", f"{args[0]} is not installed"


def git(*args: str) -> tuple[int, str, str]:
    return run(["git", *args])


def current_branch() -> str:
    code, out, err = git("rev-parse", "--abbrev-ref", "HEAD")
    if code != 0 or not out:
        raise SystemExit(
            f"cannot determine current branch: {err or 'git rev-parse failed'}"
        )
    return out


def commits(base: str, head: str) -> list[dict[str, str]]:
    code, out, err = git(
        "log", "--reverse", "--format=%H%x1f%s%x1f%an", f"{base}..{head}"
    )
    if code != 0:
        raise SystemExit(f"cannot read commits for {base}..{head}: {err}")
    result = []
    for line in out.splitlines():
        parts = line.split("\x1f")
        if len(parts) == 3:
            result.append({"sha": parts[0], "subject": parts[1], "author": parts[2]})
    return result


def changed_files(base: str, head: str) -> list[dict[str, str]]:
    code, out, _ = git("diff", "--name-status", f"{base}...{head}")
    if code != 0:
        return []
    files = []
    for line in out.splitlines():
        parts = line.split("\t")
        if len(parts) >= 2:
            files.append({"status": parts[0], "path": parts[-1]})
    return files


def issue_metadata(issue: str) -> dict | None:
    if shutil.which("gh") is None:
        return None
    code, out, _ = run(
        [
            "gh",
            "issue",
            "view",
            issue,
            "--json",
            "number,title,url,labels,milestone,state",
        ]
    )
    if code != 0 or not out:
        return None
    try:
        data = json.loads(out)
    except json.JSONDecodeError:
        return None
    labels = [
        label.get("name")
        for label in data.get("labels", [])
        if label.get("name") and not label["name"].startswith(TRIAGE_LABEL_PREFIXES)
    ]
    milestone = (data.get("milestone") or {}).get("title")
    return {
        "number": data.get("number"),
        "title": data.get("title"),
        "url": data.get("url"),
        "state": data.get("state"),
        "labels": labels,
        "milestone": milestone,
    }


def find_template() -> str | None:
    for candidate in (
        ".github/pull_request_template.md",
        ".github/PULL_REQUEST_TEMPLATE.md",
        "docs/pull_request_template.md",
    ):
        path = Path(candidate)
        if path.is_file():
            return path.read_text(encoding="utf-8").strip()
    return None


def render_body(
    branch: str,
    base: str,
    head: str,
    commit_list: list[dict],
    files: list[dict],
    issue: dict | None,
    validation: str | None,
) -> str:
    summary = (
        "\n".join(f"- {item['subject']} (`{item['sha'][:8]}`)" for item in commit_list)
        or "- (no commits ahead of base)"
    )
    changed = "\n".join(f"- `{item['status']}` {item['path']}" for item in files[:40])
    if len(files) > 40:
        changed += f"\n- ... and {len(files) - 40} more files"
    if not changed:
        changed = "- (no changed files detected)"

    why = (
        f"Closes #{issue['number']}: {issue['title']}\n\n{issue['url']}"
        if issue
        else "Explain the motivation for this branch."
    )

    sections = [
        "## Summary",
        summary,
        "",
        "## Why",
        why,
        "",
        "## Impact",
        changed,
        "",
        "## Validation",
        validation
        or "Not recorded. Run the smallest relevant validation and record the exact command and result.",
        "",
        "## Review Focus",
        "- Correctness of the behavior change and its failure modes",
        "- Tests or evidence that prove the change works",
        "- Any scope that should be split out of this PR",
        "",
        "## Development",
        f"- Branch: `{branch}`",
        f"- Base: `{base}`",
        f"- Head: `{head[:12]}`",
    ]
    template = find_template()
    if template:
        sections.extend(["", "## Repository PR Template", "", template])
    return "\n".join(sections).rstrip() + "\n"


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Render a PR bundle from git and linked-issue metadata."
    )
    parser.add_argument("--base", default="main", help="Base branch (default: main)")
    parser.add_argument("--head", default="HEAD", help="Head ref (default: HEAD)")
    parser.add_argument("--issue", help="Linked issue number")
    parser.add_argument(
        "--validation", help="Validation summary, e.g. 'node --test: pass (716 tests)'"
    )
    parser.add_argument("--title", help="Override the generated title")
    parser.add_argument("--out", help="Write the JSON bundle to this path")
    parser.add_argument("--body-file", help="Write only the Markdown body to this path")
    parser.add_argument(
        "--json", action="store_true", help="Print the JSON bundle to stdout (default)"
    )
    args = parser.parse_args()

    branch = current_branch()
    code, head_sha, err = git("rev-parse", args.head)
    if code != 0:
        raise SystemExit(f"cannot resolve head {args.head}: {err}")
    code, base_sha, err = git("rev-parse", args.base)
    if code != 0:
        raise SystemExit(f"cannot resolve base {args.base}: {err}")

    commit_list = commits(args.base, args.head)
    files = changed_files(args.base, args.head)
    issue = issue_metadata(args.issue) if args.issue else None

    title = args.title or (
        issue["title"]
        if issue
        else (commit_list[-1]["subject"] if commit_list else f"{branch}")
    )
    body = render_body(
        branch, args.base, head_sha, commit_list, files, issue, args.validation
    )
    bundle = {
        "title": title,
        "body": body,
        "branch": branch,
        "base": args.base,
        "head": head_sha,
        "baseSha": base_sha,
        "commits": commit_list,
        "changedFiles": files,
        "issue": issue,
        "metadata": {
            "assignee": "@me",
            "labels": issue["labels"] if issue else [],
            "milestone": issue["milestone"] if issue else None,
            "reviewers": [],
        },
        "limitations": []
        if issue or not args.issue
        else [
            "issue metadata unavailable (gh missing, unauthenticated, or issue not found)"
        ],
    }

    if args.body_file:
        Path(args.body_file).write_text(body, encoding="utf-8")
        print(f"wrote PR body to {args.body_file}", file=sys.stderr)
    if args.out:
        Path(args.out).write_text(json.dumps(bundle, indent=2) + "\n", encoding="utf-8")
        print(f"wrote PR bundle to {args.out}", file=sys.stderr)
    if not args.out:
        print(json.dumps(bundle, indent=2))
    if bundle["limitations"]:
        for limitation in bundle["limitations"]:
            print(f"warning: {limitation}", file=sys.stderr)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
