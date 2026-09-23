#!/usr/bin/env python3
"""
Skill packaging and validation tool
Validates skills for completeness and conformity to standards
"""

import argparse
import json
import os
import re
import sys
from pathlib import Path
from typing import Dict, List, Tuple, Optional, Any
import yaml

def load_skill_md(skill_path: Path) -> Tuple[Dict[str, Any], str]:
    """Load SKILL.md and separate frontmatter from content"""
    skill_md_path = skill_path / "SKILL.md"
    if not skill_md_path.exists():
        raise FileNotFoundError(f"SKILL.md not found at {skill_md_path}")
    
    content = skill_md_path.read_text(encoding='utf-8')
    
    # Parse frontmatter
    frontmatter = {}
    if content.startswith('---'):
        parts = content.split('---', 2)
        if len(parts) >= 3:
            try:
                frontmatter = yaml.safe_load(parts[1]) or {}
                content = parts[2]  # Content after frontmatter
            except yaml.YAMLError as e:
                print(f"Warning: Could not parse YAML frontmatter: {e}")
    
    return frontmatter, content

def check_required_directories(skill_path: Path) -> List[str]:
    """Check for required skill directories"""
    required_dirs = ["scripts", "references", "assets", "adrs"]
    missing_dirs = []
    
    for dir_name in required_dirs:
        dir_path = skill_path / dir_name
        if not dir_path.exists() or not dir_path.is_dir():
            missing_dirs.append(dir_name)
    
    return missing_dirs

def check_interview_completeness(skill_path: Path) -> Tuple[bool, List[str]]:
    """Check if skill shows evidence of having gone through interview process"""
    issues = []
    
    # Check for interview-related files or references
    skill_md_path = skill_path / "SKILL.md"
    if skill_md_path.exists():
        content = skill_md_path.read_text(encoding='utf-8').lower()
        
        # Look for traces of interview process
        interview_indicators = [
            "entrevista",
            "entrevist",
            "descubrimiento",
            "diseño colaborativo",
            "investigación asistida",
            "nombrado",
            "fase 1",
            "fase 2", 
            "fase 3",
            "fase 4",
            "fase 5",
            "how this skill was created",
            "cómo se creó esta skill",
            "traceability",
            "trazabilidad"
        ]
        
        found_indicators = [indicator for indicator in interview_indicators 
                           if indicator in content]
        
        if len(found_indicators) < 3:  # Require at least some evidence
            issues.append("Skill does not show clear evidence of interview process")
    
    # Check for interview results file (if it was saved)
    interview_files = list(skill_path.glob("*interview*")) + \
                     list(skill_path.glob("*entrevista*")) + \
                     list(skill_path.parent.glob(f"*{skill_path.name}*interview*")) + \
                     list(skill_path.parent.glob(f"*{skill_path.name}*entrevista*"))
    
    if not interview_files:
        issues.append("No interview results file found (expected: *-interview.json or similar)")
    
    return len(issues) == 0, issues

def check_adr_presence(skill_path: Path) -> Tuple[bool, List[str]]:
    """Check for ADR presence"""
    issues = []
    
    adr_dir = skill_path / "adrs"
    if not adr_dir.exists():
        issues.append("ADR directory missing")
        return False, issues
    
    adr_files = list(adr_dir.glob("*.md"))
    if not adr_files:
        issues.append("No ADR files found in adrs/ directory")
        return False, issues
    
    # Check for an initial design ADR. Existing skills may use a descriptive
    # 0001-* name, while newly generated skills use 0001-initial-design.md.
    initial_adrs = [path for path in adr_files if path.name.startswith("0001-")]
    if not initial_adrs:
        issues.append("Initial ADR (0001-*.md) not found")
    
    return len(issues) == 0, issues

def check_test_templates(skill_path: Path) -> Tuple[bool, List[str]]:
    """Check for test template evidence"""
    issues = []
    
    # Check for behavioral fixtures or scenarios directories
    test_dirs = [
        skill_path / "scenarios",
        skill_path / "behavioral-fixtures", 
        skill_path / "tests",
        skill_path / ".skill-sandbox" / skill_path.name / "scenarios",
        skill_path / ".skill-sandbox" / skill_path.name / "behavioral-fixtures"
    ]
    
    test_dirs_found = [d for d in test_dirs if d.exists()]
    
    if not test_dirs_found:
        issues.append("No test directories found (scenarios, behavioral-fixtures, etc.)")
    
    # Check for test-related content in SKILL.md
    skill_md_path = skill_path / "SKILL.md"
    if skill_md_path.exists():
        content = skill_md_path.read_text(encoding='utf-8').lower()
        test_indicators = [
            "test", "prueba", "validar", "validation", 
            "scenario", "escenario", "fixture", "fixtura",
            "evaluate-skill", "comportamiento", "behavioral"
        ]
        
        found_indicators = [indicator for indicator in test_indicators 
                           if indicator in content]
        
        if len(found_indicators) < 2:
            issues.append("SKILL.md lacks sufficient test/validation references")
    
    return len(issues) == 0, issues

def check_traceability_section(skill_path: Path) -> Tuple[bool, List[str]]:
    """Check for 'How this skill was created' section (traceability)"""
    issues = []
    
    skill_md_path = skill_path / "SKILL.md"
    if not skill_md_path.exists():
        issues.append("SKILL.md not found")
        return False, issues
    
    content = skill_md_path.read_text(encoding='utf-8')
    
    # Look for traceability section (various possible formulations)
    traceability_patterns = [
        r"#+\s*[Cc]ómo\s+se\s+creó\s+esta\s+skill",
        r"#+\s*[Hh]ow\s+this\s+skill\s+was\s+created",
        r"#+\s*[Tt]razabilidad",
        r"#+\s*[Tt]raceability",
        r"#+\s*[Pp]rocess\s+[Dd]ocumentation",
        r"#+\s*[Dd]ocumentación\s+[Dd]el\s+[Pp]rocess",
        r"#+\s*[Ii]nterview\s+[Pp]rocess",
        r"#+\s*[Pp]rocess\s+[Dd]e\s+[Ee]ntrevista"
    ]
    
    found = False
    for pattern in traceability_patterns:
        if re.search(pattern, content, re.IGNORECASE | re.MULTILINE):
            found = True
            break
    
    if not found:
        issues.append("Missing traceability section: 'How this skill was created' or equivalent")
    
    return len(issues) == 0, issues

def check_basic_structure(skill_path: Path) -> Tuple[bool, List[str]]:
    """Check basic skill structure requirements"""
    issues = []
    
    # Check for SKILL.md
    if not (skill_path / "SKILL.md").exists():
        issues.append("SKILL.md missing")
    
    # Check for basic directory structure
    missing_dirs = check_required_directories(skill_path)
    if missing_dirs:
        issues.append(f"Missing directories: {', '.join(missing_dirs)}")
    
    return len(issues) == 0, issues

def validate_skill(skill_path: Path, 
                  check_interview: bool = True,
                  check_adr: bool = True,
                  check_tests: bool = True,
                  check_traceability: bool = True) -> Tuple[bool, Dict[str, List[str]]]:
    """
    Validate a skill against various criteria
    
    Returns:
        Tuple of (is_valid, issues_by_category)
    """
    all_issues = {}
    is_valid = True
    
    # Basic structure check
    basic_valid, basic_issues = check_basic_structure(skill_path)
    if not basic_valid:
        all_issues["basic_structure"] = basic_issues
        is_valid = False
    
    # Only run additional checks if basic structure is OK
    if basic_valid:
        # Interview completeness
        if check_interview:
            interview_valid, interview_issues = check_interview_completeness(skill_path)
            if not interview_valid:
                all_issues["interview_completeness"] = interview_issues
                is_valid = False
        
        # ADR presence
        if check_adr:
            adr_valid, adr_issues = check_adr_presence(skill_path)
            if not adr_valid:
                all_issues["adr_presence"] = adr_issues
                is_valid = False
        
        # Test templates
        if check_tests:
            tests_valid, tests_issues = check_test_templates(skill_path)
            if not tests_valid:
                all_issues["test_templates"] = tests_issues
                is_valid = False
        
        # Traceability section
        if check_traceability:
            trace_valid, trace_issues = check_traceability_section(skill_path)
            if not trace_valid:
                all_issues["traceability"] = trace_issues
                is_valid = False
    
    return is_valid, all_issues

def main():
    parser = argparse.ArgumentParser(
        description="Valida y empaqueta skills para asegurar conformidad con estándares"
    )
    parser.add_argument(
        'skill_path',
        type=str,
        help='Path to the skill directory to validate'
    )
    parser.add_argument(
        '--no-interview-check',
        '--no-verificar-entrevista',
        action='store_true',
        help='Skip interview completeness check'
    )
    parser.add_argument(
        '--no-adr-check',
        '--no-verificar-adr',
        action='store_true',
        help='Skip ADR presence check'
    )
    parser.add_argument(
        '--no-test-check',
        '--no-verificar-pruebas',
        action='store_true',
        help='Skip test template check'
    )
    parser.add_argument(
        '--no-traceability-check',
        '--no-verificar-trazabilidad',
        action='store_true',
        help='Skip traceability section check'
    )
    parser.add_argument(
        '--output-format',
        choices=['text', 'json'],
        default='text',
        help='Output format (default: text)'
    )
    parser.add_argument(
        '--verbose', '-v',
        action='store_true',
        help='Verbose output'
    )
    
    args = parser.parse_args()
    
    skill_path = Path(args.skill_path)
    if not skill_path.exists():
        print(f"Error: Skill path '{skill_path}' does not exist")
        sys.exit(1)
    
    # Run validation
    is_valid, issues = validate_skill(
        skill_path,
        check_interview=not args.no_interview_check,
        check_adr=not args.no_adr_check,
        check_tests=not args.no_test_check,
        check_traceability=not args.no_traceability_check
    )
    
    if args.output_format == 'json':
        result = {
            "skill_path": str(skill_path),
            "valid": is_valid,
            "issues": issues
        }
        print(json.dumps(result, indent=2, ensure_ascii=False))
    else:
        if is_valid:
            print(f"✓ Skill '{skill_path.name}' passed validation")
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
            print(f"✗ Skill '{skill_path.name}' failed validation")
            print("\nIssues found:")
            for category, issue_list in issues.items():
                print(f"\n{category.replace('_', ' ').title()}:")
                for issue in issue_list:
                    print(f"  - {issue}")
    
    sys.exit(0 if is_valid else 1)

if __name__ == "__main__":
    main()
