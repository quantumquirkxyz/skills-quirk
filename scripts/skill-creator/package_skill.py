#!/usr/bin/env python3
"""Skill packaging and validation tool."""

import argparse
import json
import re
import sys
from pathlib import Path
from typing import Any, Dict, List, Tuple

import yaml


def load_skill_md(skill_path: Path) -> Tuple[Dict[str, Any], str]:
    """Load SKILL.md and separate frontmatter from body content."""
    skill_md_path = skill_path / "SKILL.md"
    if not skill_md_path.exists():
        raise FileNotFoundError(f"SKILL.md not found at {skill_md_path}")
    content = skill_md_path.read_text(encoding="utf-8")
    frontmatter: Dict[str, Any] = {}
    if content.startswith("---"):
        parts = content.split("---", 2)
        if len(parts) >= 3:
            frontmatter = yaml.safe_load(parts[1]) or {}
            content = parts[2]
    return frontmatter, content


def check_required_directories(skill_path: Path) -> List[str]:
    """Return required directories that are missing."""
    return [name for name in ["scripts", "references", "assets", "adrs"] if not (skill_path / name).is_dir()]


def check_interview_completeness(skill_path: Path) -> Tuple[bool, List[str]]:
    """Check for evidence that a generated skill came from a design process."""
    issues: List[str] = []
    skill_md_path = skill_path / "SKILL.md"
    if skill_md_path.exists():
        content = skill_md_path.read_text(encoding="utf-8").lower()
        indicators = [
            "interview",
            "discovery",
            "collaborative design",
            "assisted research",
            "naming",
            "phase 1",
            "phase 2",
            "phase 3",
            "phase 4",
            "phase 5",
            "how this skill was created",
            "traceability",
        ]
        if sum(1 for item in indicators if item in content) < 3:
            issues.append("Skill does not show clear evidence of an interview or design process")
    interview_files = list(skill_path.glob("*interview*")) + list(skill_path.parent.glob(f"*{skill_path.name}*interview*"))
    if not interview_files:
        issues.append("No interview results file found (expected: *-interview.json or similar)")
    return len(issues) == 0, issues


def check_adr_presence(skill_path: Path) -> Tuple[bool, List[str]]:
    """Check for an ADR directory and initial ADR."""
    adr_dir = skill_path / "adrs"
    if not adr_dir.exists():
        return False, ["ADR directory missing"]
    adr_files = list(adr_dir.glob("*.md"))
    if not adr_files:
        return False, ["No ADR files found in adrs/ directory"]
    if not any(path.name.startswith("0001-") for path in adr_files):
        return False, ["Initial ADR (0001-*.md) not found"]
    return True, []


def check_test_templates(skill_path: Path) -> Tuple[bool, List[str]]:
    """Check for scenario or behavioral fixture evidence."""
    issues: List[str] = []
    test_dirs = [skill_path / "scenarios", skill_path / "behavioral-fixtures", skill_path / "tests"]
    if not any(path.exists() for path in test_dirs):
        issues.append("No test directories found (scenarios, behavioral-fixtures, or tests)")
    skill_md_path = skill_path / "SKILL.md"
    if skill_md_path.exists():
        content = skill_md_path.read_text(encoding="utf-8").lower()
        indicators = ["test", "validate", "validation", "scenario", "fixture", "evaluate-skill", "behavioral"]
        if sum(1 for item in indicators if item in content) < 2:
            issues.append("SKILL.md lacks sufficient test or validation references")
    return len(issues) == 0, issues


def check_traceability_section(skill_path: Path) -> Tuple[bool, List[str]]:
    """Check for a traceability section."""
    skill_md_path = skill_path / "SKILL.md"
    if not skill_md_path.exists():
        return False, ["SKILL.md not found"]
    content = skill_md_path.read_text(encoding="utf-8")
    patterns = [
        r"#+\s*[Hh]ow\s+this\s+skill\s+was\s+created",
        r"#+\s*[Tt]raceability",
        r"#+\s*[Pp]rocess\s+[Dd]ocumentation",
        r"#+\s*[Ii]nterview\s+[Pp]rocess",
    ]
    if not any(re.search(pattern, content, re.MULTILINE | re.IGNORECASE) for pattern in patterns):
        return False, ["Missing traceability section: 'How this skill was created' or equivalent"]
    return True, []


def check_basic_structure(skill_path: Path) -> Tuple[bool, List[str]]:
    """Check core generated skill structure."""
    issues: List[str] = []
    if not (skill_path / "SKILL.md").exists():
        issues.append("SKILL.md missing")
    missing_dirs = check_required_directories(skill_path)
    if missing_dirs:
        issues.append(f"Missing directories: {', '.join(missing_dirs)}")
    return len(issues) == 0, issues


def validate_skill(
    skill_path: Path,
    check_interview: bool = True,
    check_adr: bool = True,
    check_tests: bool = True,
    check_traceability: bool = True,
) -> Tuple[bool, Dict[str, List[str]]]:
    """Validate a skill against structural and generated-skill criteria."""
    all_issues: Dict[str, List[str]] = {}
    basic_valid, basic_issues = check_basic_structure(skill_path)
    if not basic_valid:
        all_issues["basic_structure"] = basic_issues
        return False, all_issues

    checks = []
    if check_interview:
        checks.append(("interview_completeness", check_interview_completeness))
    if check_adr:
        checks.append(("adr_presence", check_adr_presence))
    if check_tests:
        checks.append(("test_templates", check_test_templates))
    if check_traceability:
        checks.append(("traceability", check_traceability_section))

    for category, check in checks:
        valid, issues = check(skill_path)
        if not valid:
            all_issues[category] = issues
    return len(all_issues) == 0, all_issues


def main() -> None:
    parser = argparse.ArgumentParser(description="Validate and package skills for standards conformance")
    parser.add_argument("skill_path", type=str, help="Path to the skill directory to validate")
    parser.add_argument("--no-interview-check", action="store_true", help="Skip interview completeness check")
    parser.add_argument("--no-adr-check", action="store_true", help="Skip ADR presence check")
    parser.add_argument("--no-test-check", action="store_true", help="Skip test template check")
    parser.add_argument("--no-traceability-check", action="store_true", help="Skip traceability section check")
    parser.add_argument("--output-format", choices=["text", "json"], default="text", help="Output format")
    parser.add_argument("--verbose", "-v", action="store_true", help="Verbose output")
    args = parser.parse_args()

    skill_path = Path(args.skill_path)
    if not skill_path.exists():
        print(f"Error: Skill path '{skill_path}' does not exist")
        sys.exit(1)

    is_valid, issues = validate_skill(
        skill_path,
        check_interview=not args.no_interview_check,
        check_adr=not args.no_adr_check,
        check_tests=not args.no_test_check,
        check_traceability=not args.no_traceability_check,
    )

    if args.output_format == "json":
        print(json.dumps({"skill_path": str(skill_path), "valid": is_valid, "issues": issues}, indent=2))
    elif is_valid:
        print(f"OK: Skill '{skill_path.name}' passed validation")
        if args.verbose:
            print("\nValidation details:")
            print("  - Basic structure: OK")
            if not args.no_interview_check:
                print("  - Interview completeness: OK")
            if not args.no_adr_check:
                print("  - ADR presence: OK")
            if not args.no_test_check:
                print("  - Test templates: OK")
            if not args.no_traceability_check:
                print("  - Traceability section: OK")
    else:
        print(f"FAIL: Skill '{skill_path.name}' failed validation")
        print("\nIssues found:")
        for category, issue_list in issues.items():
            print(f"\n{category.replace('_', ' ').title()}:")
            for issue in issue_list:
                print(f"  - {issue}")
    sys.exit(0 if is_valid else 1)


if __name__ == "__main__":
    main()
