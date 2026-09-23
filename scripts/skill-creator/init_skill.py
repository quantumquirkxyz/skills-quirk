#!/usr/bin/env python3
"""Initialize a skill from scratch or from interview results."""

import argparse
import json
import shutil
import sys
from pathlib import Path
from typing import Any, Dict, Optional


def load_interview_results(json_file: str) -> Dict[str, Any]:
    """Load skill data from an interview results JSON file."""
    try:
        return json.loads(Path(json_file).read_text(encoding="utf-8"))
    except FileNotFoundError:
        print(f"Error: interview results file '{json_file}' was not found")
        sys.exit(1)
    except json.JSONDecodeError as exc:
        print(f"Error: invalid JSON in '{json_file}': {exc}")
        sys.exit(1)


def validate_skill_md_sections(skill_md_path: Path) -> bool:
    """Validate that SKILL.md has the expected generated-skill sections."""
    if not skill_md_path.exists():
        print(f"Error: SKILL.md not found at {skill_md_path}")
        return False
    text = skill_md_path.read_text(encoding="utf-8")
    required_sections = [
        "## Operating Contract",
        "## Contract",
        "## Structured Skill Creation Process",
        "## Integration with Evaluation System",
        "## Completion Criteria",
        "## Guardrails",
    ]
    missing = [section for section in required_sections if section not in text]
    if missing:
        print("Warning: SKILL.md is missing recommended sections:")
        for section in missing:
            print(f"  - {section}")
        return False
    return True


def skill_data(skill_name: str, interview_data: Optional[Dict[str, Any]]) -> Dict[str, Any]:
    """Return normalized skill metadata."""
    data = (interview_data or {}).get("skill_data", {})
    return {
        "description": data.get("description", f"A skill for {skill_name}"),
        "category": data.get("category", "general"),
        "version": data.get("version", "1"),
        "maturity": data.get("maturity", "experimental"),
        "capabilities": data.get("capabilities", ["process-input", "generate-output"]),
        "outputs": data.get("outputs", ["result", "status"]),
        "side_effects": data.get("side_effects", []),
        "risk": data.get("risk", "low"),
        "trust_tier": data.get("trust_tier", "2"),
        "max_iterations": data.get("max_iterations", "5"),
        "stop_condition": data.get("stop_condition", "Skill completed successfully"),
    }


def create_skill_structure(
    skill_name: str,
    output_dir: Path,
    interview_data: Optional[Dict[str, Any]] = None,
) -> Path:
    """Create a complete skill directory structure."""
    skill_path = output_dir / skill_name
    if skill_path.exists():
        print(f"Warning: skill directory '{skill_path}' already exists. Replacing it.")
        shutil.rmtree(skill_path)

    for directory in [
        skill_path,
        skill_path / "scripts",
        skill_path / "references",
        skill_path / "assets",
        skill_path / "adrs",
        skill_path / "behavioral-fixtures",
    ]:
        directory.mkdir(parents=True, exist_ok=True)

    print(f"Created skill structure in: {skill_path}")
    create_skill_md(skill_path, skill_name, interview_data)
    create_basic_script(skill_path / "scripts", skill_name)
    create_reference_files(skill_path / "references", skill_name)
    create_initial_adr(skill_path / "adrs", skill_name)
    create_basic_assets(skill_path / "assets", skill_name)
    create_behavioral_fixture(skill_path / "behavioral-fixtures", skill_name)
    return skill_path


def create_skill_md(
    skill_path: Path,
    skill_name: str,
    interview_data: Optional[Dict[str, Any]] = None,
) -> None:
    """Generate SKILL.md."""
    data = skill_data(skill_name, interview_data)
    capabilities = "\n".join(f"  - {item}" for item in data["capabilities"])
    outputs = "\n".join(f"  - {item}" for item in data["outputs"])
    side_effects = "\n".join(f"  - {item}" for item in data["side_effects"]) or "  - none"
    title = skill_name.replace("-", " ").title()
    skill_md = f"""---
name: {skill_name}
category: {data["category"]}
maturity: {data["maturity"]}
version: {data["version"]}
description: {data["description"]}
capabilities:
{capabilities}
outputs:
{outputs}
sideEffects:
{side_effects}
dependencies: []
stopCondition: {data["stop_condition"]}
risk: {data["risk"]}
trustTier: {data["trust_tier"]}
maxIterations: {data["max_iterations"]}
---

## Operating Contract

- **Input:** Explicit inputs for the {skill_name} skill.
- **Output:** Explicit outputs from the {skill_name} skill.
- **Side effects:** follow the frontmatter declaration; do not broaden scope without explicit user direction.
- **Dependencies:** declared dependencies, referenced skills, and source materials required by the task.
- **Stop condition:** {data["stop_condition"]} is complete, evidence is captured, and completion criteria are checked.
- **Risk:** use the frontmatter risk classification and call out any escalation.
- **Boundary:** stay within the skill's declared scope, trust tier, and side-effect policy.

# {title}

{data["description"]}

## Contract

- Input: concrete inputs required by this skill.
- Output: concrete artifacts or responses produced by this skill.
- Scope: skill-specific work inside the quirk skills ecosystem.
- Rule: generated skills must be compatible with the quirk method.
- Rule: generated skills must use explicit contracts and progressive disclosure.
- Rule: generated skills should be testable through evaluate-skill.

## Structured Skill Creation Process

1. Define the core problem and intended users.
2. List concrete use cases and expected invocation patterns.
3. Specify inputs, outputs, dependencies, side effects, and stop condition.
4. Create references, scripts, assets, and ADRs only when they serve the contract.
5. Add validation fixtures or a clear validation path.

## Integration with Evaluation System

- Add scenario fixtures for route and contract behavior when the skill affects routing.
- Add behavioral fixtures for generated artifact shapes.
- Run repository validation before promotion.

## Completion Criteria

- The skill has specific, actionable metadata.
- The skill has a clear contract and boundary.
- The generated directory structure is complete.
- The validation path is documented.

## How This Skill Was Created

This skill was generated with `scripts/init_skill.py`. If it was created from an interview, preserve the interview JSON beside the skill directory or inside the skill directory before promotion. Record the discovery answers, collaborative design choices, assisted research notes, naming decision, and validation evidence before making the skill active.

## Guardrails

- Validate the concept against existing skills to prevent duplication.
- Prefer small, focused skills over broad catch-all workflows.
- Keep side effects honest and minimal.
- Replace all example text before promoting a generated skill.
"""
    (skill_path / "SKILL.md").write_text(skill_md, encoding="utf-8")
    print("  OK SKILL.md created")


def create_basic_script(scripts_dir: Path, skill_name: str) -> None:
    """Generate a basic executable script."""
    title = skill_name.replace("-", " ").title()
    script = f'''#!/usr/bin/env python3
"""{title} - generated skill entry point."""

import argparse
import logging

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__name__)


def main() -> int:
    parser = argparse.ArgumentParser(description="{title} skill entry point")
    parser.add_argument("--version", action="version", version="1.0.0")
    parser.add_argument("--input", help="Input for skill processing")
    parser.add_argument("--output", help="Output file or directory")
    args = parser.parse_args()
    logger.info("Starting {skill_name}")
    if args.input:
        logger.info("Processing input: %s", args.input)
    if args.output:
        logger.info("Writing output to: %s", args.output)
    logger.info("Skill execution completed successfully")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
'''
    target = scripts_dir / "main.py"
    target.write_text(script, encoding="utf-8")
    target.chmod(0o755)
    print("  OK scripts/main.py created")


def create_reference_files(refs_dir: Path, skill_name: str) -> None:
    """Generate reference files."""
    title = skill_name.replace("-", " ").title()
    text = f"""# Domain Reference for {title}

## Overview
This document captures domain knowledge and references for the {skill_name} skill.

## Key Concepts
- Primary domain concept.
- Secondary domain concept.
- Relevant operational constraint.

## Best Practices
- Keep examples concrete and runnable.
- Preserve the skill boundary when adding references.
- Document assumptions that affect generated outputs.

## References
- Add high-quality domain references here before promotion.
"""
    (refs_dir / "domain.md").write_text(text, encoding="utf-8")
    print("  OK references/domain.md created")


def create_initial_adr(adrs_dir: Path, skill_name: str) -> None:
    """Generate the initial ADR."""
    title = skill_name.replace("-", " ").title()
    text = f"""# 0001 Initial Design for {title}

## Status
Accepted

## Context
The {skill_name} skill is being created through the skill initialization workflow.

## Decision
Use the standard quirk skill structure with `SKILL.md`, `scripts/`, `references/`, `assets/`, and `adrs/`.

## Consequences

### Positive
- The generated skill starts with a complete, predictable structure.
- Contributors can validate and promote it using standard repository tools.

### Negative
- Simple skills may need to delete unused generated files before promotion.
"""
    (adrs_dir / "0001-initial-design.md").write_text(text, encoding="utf-8")
    print("  OK adrs/0001-initial-design.md created")


def create_basic_assets(assets_dir: Path, skill_name: str) -> None:
    """Generate asset documentation."""
    title = skill_name.replace("-", " ").title()
    (assets_dir / "README.md").write_text(
        f"# Assets for {title}\n\nPlace static assets for the {skill_name} skill here when needed.\n",
        encoding="utf-8",
    )
    print("  OK assets/README.md created")


def create_behavioral_fixture(fixtures_dir: Path, skill_name: str) -> None:
    """Generate a minimal behavioral fixture."""
    title = skill_name.replace("-", " ").title()
    text = f"""# Behavioral Fixture for {title}

## Expected Output Shape

- Includes a clear summary of the completed work.
- Lists validation evidence or explains why validation was not run.
- Calls out remaining risks or follow-up work.

## Prohibited Output

- Placeholder-only completion claims.
- Unstated repository writes.
- Claims that validation passed without evidence.
"""
    (fixtures_dir / "generated-output.md").write_text(text, encoding="utf-8")
    print("  OK behavioral-fixtures/generated-output.md created")


def main() -> None:
    parser = argparse.ArgumentParser(description="Initialize a new skill from scratch or interview results")
    parser.add_argument("skill_name", help="Name of the skill to create")
    parser.add_argument("--output-dir", default="./skills", help="Directory where the skill will be created")
    parser.add_argument("--from-interview", help="JSON file with interview results")
    parser.add_argument("--validate-only", action="store_true", help="Only validate an existing skill")
    args = parser.parse_args()

    output_dir = Path(args.output_dir)
    output_dir.mkdir(parents=True, exist_ok=True)

    if args.validate_only:
        skill_path = output_dir / args.skill_name
        if not skill_path.exists():
            print(f"Error: skill directory '{skill_path}' does not exist")
            sys.exit(1)
        ok = validate_skill_md_sections(skill_path / "SKILL.md")
        sys.exit(0 if ok else 1)

    interview_data = load_interview_results(args.from_interview) if args.from_interview else None
    skill_path = create_skill_structure(args.skill_name, output_dir, interview_data)
    print("\nSkill created successfully.")
    print("Next steps:")
    print(f"  1. Review and customize {skill_path}/SKILL.md")
    print(f"  2. Implement logic in {skill_path}/scripts/main.py")
    print(f"  3. Add domain documentation in {skill_path}/references/")
    print("  4. Run validation before promotion")


if __name__ == "__main__":
    main()
