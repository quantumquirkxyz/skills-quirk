#!/usr/bin/env python3
"""Research helpers for skill creation."""

import json
import re
import sys
from pathlib import Path
from typing import Any, Dict, List, Optional


def search_github_patterns(query: str, limit: int = 10) -> List[Dict[str, Any]]:
    """Return placeholder pattern matches for existing skills."""
    return [
        {
            "skill_name": "example-skill",
            "pattern_matched": query or "example pattern",
            "relevance_score": 0.8,
            "path": ".agents/skills/example-skill",
        }
    ][:limit]


def search_web_best_practices(topic: str, limit: int = 5) -> List[Dict[str, Any]]:
    """Return placeholder best-practice resources for a topic."""
    safe_topic = topic.replace(" ", "-") or "skill-design"
    return [
        {
            "title": f"Best practices for {topic or 'skill design'}",
            "source": "Example Resource",
            "url": f"https://example.com/best-practices-{safe_topic}",
            "summary": f"Key practices for implementing {topic or 'skill design'} solutions.",
            "relevance_score": 0.9,
        }
    ][:limit]


def analyze_existing_skills(directory: str) -> Dict[str, Any]:
    """Analyze SKILL.md files in a directory for simple category patterns."""
    skills_dir = Path(directory)
    if not skills_dir.exists():
        return {"error": f"Directory {directory} does not exist"}

    skill_files = list(skills_dir.rglob("SKILL.md"))
    analysis: Dict[str, Any] = {
        "total_skills_found": len(skill_files),
        "skills": [],
        "categories_distribution": {},
        "recommendations": [],
    }

    for skill_file in skill_files:
        try:
            content = skill_file.read_text(encoding="utf-8")
            info = {
                "path": str(skill_file.relative_to(skills_dir)),
                "name": "unknown",
                "category": "unknown",
                "description": "",
            }
            if content.startswith("---"):
                frontmatter = content.split("---", 2)[1]
                for line in frontmatter.splitlines():
                    if line.startswith("name:"):
                        info["name"] = line.split(":", 1)[1].strip()
                    elif line.startswith("category:"):
                        info["category"] = line.split(":", 1)[1].strip()
                    elif line.startswith("description:"):
                        info["description"] = line.split(":", 1)[1].strip()
            analysis["skills"].append(info)
            category = info["category"]
            analysis["categories_distribution"][category] = analysis["categories_distribution"].get(category, 0) + 1
        except Exception as exc:  # pragma: no cover - CLI helper
            analysis["skills"].append({"path": str(skill_file), "error": str(exc)})

    if analysis["categories_distribution"]:
        category, count = max(analysis["categories_distribution"].items(), key=lambda item: item[1])
        analysis["recommendations"].append(
            f"The most common category is '{category}' with {count} skills. Consider whether the new skill belongs there."
        )
    return analysis


def suggest_skill_name(keywords: List[str], category: str = "", algorithm: str = "keyword-category-suffix") -> List[str]:
    """Suggest skill names based on keywords and category."""
    suggestions: List[str] = []
    clean_keywords = [re.sub(r"[^a-zA-Z0-9_-]", "", word.lower()) for word in keywords if word]
    clean_category = re.sub(r"[^a-zA-Z0-9_-]", "", category.lower())

    if algorithm == "descriptive-phrase":
        verbs = ["analyze", "validate", "generate", "convert", "check", "scan", "find"]
        nouns = clean_keywords[:3] or ["skill", "helper", "tool"]
        for verb in verbs[:2]:
            for noun in nouns[:2]:
                name = f"{verb}-{noun}"
                if clean_category:
                    name = f"{name}-{clean_category}"
                suggestions.append(name)
    else:
        suffixes = ["", "-helper", "-utils", "-assistant", "-tool"]
        for keyword in clean_keywords[:3] or ["skill"]:
            for suffix in suffixes:
                base = f"{keyword}-{clean_category}" if clean_category else keyword
                suggestions.append(f"{base}{suffix}")
    return list(dict.fromkeys(suggestions))[:5]


def validate_skill_name(name: str) -> Dict[str, Any]:
    """Validate a proposed skill name."""
    if not re.match(r"^[a-zA-Z0-9_-]+$", name):
        return {
            "valid": False,
            "reason": "The name can only contain letters, numbers, hyphens, and underscores.",
            "suggestion": re.sub(r"[^a-zA-Z0-9_-]", "", name),
        }
    if len(name) < 2:
        return {"valid": False, "reason": "The name must be at least 2 characters long.", "suggestion": None}
    if len(name) > 50:
        return {"valid": False, "reason": "The name is too long; the maximum is 50 characters.", "suggestion": name[:50]}
    if name.lower() in {"skill", "template", "script", "reference", "asset"}:
        return {"valid": False, "reason": f"'{name}' is reserved or too generic.", "suggestion": f"{name}-skill"}
    return {"valid": True, "reason": "Valid name.", "suggestion": None}


def save_research_results(results: Dict[str, Any], output_file: str) -> bool:
    """Save research results to JSON."""
    try:
        output_path = Path(output_file)
        output_path.parent.mkdir(parents=True, exist_ok=True)
        output_path.write_text(json.dumps(results, indent=2, ensure_ascii=False), encoding="utf-8")
        return True
    except Exception as exc:  # pragma: no cover - CLI helper
        print(f"Error saving research results: {exc}")
        return False


def load_research_results(input_file: str) -> Optional[Dict[str, Any]]:
    """Load research results from JSON."""
    try:
        input_path = Path(input_file)
        if not input_path.exists():
            return None
        return json.loads(input_path.read_text(encoding="utf-8"))
    except Exception as exc:  # pragma: no cover - CLI helper
        print(f"Error loading research results: {exc}")
        return None


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python research_helpers.py <command> [args]")
        print("Commands:")
        print("  suggest-name <keyword1> [keyword2] ... [--category CAT]")
        print("  analyze-skills <directory>")
        print("  validate-name <name>")
        sys.exit(1)

    command = sys.argv[1]
    if command == "suggest-name":
        words: List[str] = []
        category = ""
        i = 2
        while i < len(sys.argv):
            if sys.argv[i] == "--category" and i + 1 < len(sys.argv):
                category = sys.argv[i + 1]
                i += 2
            else:
                words.append(sys.argv[i])
                i += 1
        for idx, suggestion in enumerate(suggest_skill_name(words, category), 1):
            print(f"{idx}. {suggestion}")
    elif command == "analyze-skills":
        if len(sys.argv) < 3:
            print("Usage: python research_helpers.py analyze-skills <directory>")
            sys.exit(1)
        print(json.dumps(analyze_existing_skills(sys.argv[2]), indent=2, ensure_ascii=False))
    elif command == "validate-name":
        if len(sys.argv) < 3:
            print("Usage: python research_helpers.py validate-name <name>")
            sys.exit(1)
        print(json.dumps(validate_skill_name(sys.argv[2]), indent=2, ensure_ascii=False))
    else:
        print(f"Unknown command: {command}")
        sys.exit(1)
