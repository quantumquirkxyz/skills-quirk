#!/usr/bin/env python3
"""
Research helpers for skill creation
Provides functions to research and gather information for skill design
"""

import json
import os
import subprocess
import sys
from pathlib import Path
from typing import Dict, List, Any, Optional


def search_github_patterns(query: str, limit: int = 10) -> List[Dict[str, Any]]:
    """
    Search for patterns in existing skills
    
    Args:
        query: Search query
        limit: Maximum number of results
        
    Returns:
        List of matching skill patterns
    """
    # This would typically search through existing skills
    # For now, we'll return a placeholder structure
    return [
        {
            "skill_name": "example-skill",
            "pattern_matched": "example pattern",
            "relevance_score": 0.8,
            "path": ".agents/skills/example-skill"
        }
    ]


def search_web_best_practices(topic: str, limit: int = 5) -> List[Dict[str, Any]]:
    """
    Search for web best practices on a topic
    
    Args:
        topic: Topic to search for best practices
        limit: Maximum number of results
        
    Returns:
        List of best practice resources
    """
    # Placeholder implementation
    # In a real implementation, this would use web search APIs
    return [
        {
            "title": f"Best practices for {topic}",
            "source": "Industry Blog",
            "url": f"https://example.com/best-practices-{topic}",
            "summary": f"Key best practices for implementing {topic} solutions",
            "relevance_score": 0.9
        }
    ]


def analyze_existing_skills(directory: str) -> Dict[str, Any]:
    """
    Analyze existing skills in a directory to identify patterns and avoid duplication
    
    Args:
        directory: Directory to search for skills
        
    Returns:
        Analysis results including patterns, gaps, and recommendations
    """
    skills_dir = Path(directory)
    if not skills_dir.exists():
        return {"error": f"Directory {directory} does not exist"}
    
    # Find SKILL.md files
    skill_files = list(skills_dir.rglob("SKILL.md"))
    
    analysis = {
        "total_skills_found": len(skill_files),
        "skills": [],
        "common_capabilities": {},
        "categories_distribution": {},
        "recommendations": []
    }
    
    for skill_file in skill_files:
        try:
            # Read basic info from SKILL.md
            content = skill_file.read_text(encoding='utf-8')
            skill_info = {
                "path": str(skill_file.relative_to(skills_dir)),
                "name": "unknown",
                "category": "unknown",
                "description": ""
            }
            
            # Extract basic info from frontmatter (simplified)
            if content.startswith('---'):
                parts = content.split('---', 2)
                if len(parts) >= 3:
                    frontmatter = parts[1]
                    for line in frontmatter.split('\n'):
                        if line.startswith('name:'):
                            skill_info["name"] = line.split(':', 1)[1].strip()
                        elif line.startswith('category:'):
                            skill_info["category"] = line.split(':', 1)[1].strip()
                        elif line.startswith('description:'):
                            skill_info["description"] = line.split(':', 1)[1].strip()
            
            analysis["skills"].append(skill_info)
            
            # Count categories
            category = skill_info["category"]
            analysis["categories_distribution"][category] = analysis["categories_distribution"].get(category, 0) + 1
            
        except Exception as e:
            analysis["skills"].append({
                "path": str(skill_file.relative_to(skills_dir)),
                "error": str(e)
            })
    
    # Generate recommendations based on analysis
    if analysis["total_skills_found"] > 0:
        most_common_category = max(analysis["categories_distribution"].items(), key=lambda x: x[1], default=(None, 0))
        if most_common_category[0]:
            analysis["recommendations"].append(
                f"La categoría más común es '{most_common_category[0]}' con {most_common_category[1]} skills. "
                f"Considera si tu skill encaja aquí o si necesita una nueva categoría."
            )
    
    return analysis


def suggest_skill_name(keywords: List[str], category: str = "", 
                      algorithm: str = "keyword-category-suffix") -> List[str]:
    """
    Suggest skill names based on keywords and category
    
    Args:
        keywords: List of relevant keywords
        category: Skill category
        algorithm: Naming algorithm to use
        
    Returns:
        List of suggested skill names
    """
    suggestions = []
    
    if algorithm == "keyword-category-suffix":
        # Common suffixes
        suffixes = ["", "-helper", "-utils", "-assistant", "-tool", "-py"]
        
        # Generate combinations
        for keyword in keywords[:3]:  # Limit to top 3 keywords
            for suffix in suffixes:
                if category:
                    name = f"{keyword}-{category}{suffix}"
                else:
                    name = f"{keyword}{suffix}"
                if name not in suggestions:
                    suggestions.append(name)
    
    elif algorithm == "descriptive-phrase":
        # Generate verb-noun combinations
        verbs = ["analyze", "validate", "generate", "convert", "check", "scan", "find"]
        nouns = keywords[:3] if keywords else ["skill", "helper", "tool"]
        
        for verb in verbs[:2]:
            for noun in nouns[:2]:
                name = f"{verb}-{noun}"
                if category:
                    name += f"-{category}"
                suggestions.append(name)
    
    # Limit suggestions and return
    return suggestions[:5]


def validate_skill_name(name: str) -> Dict[str, Any]:
    """
    Validate a proposed skill name
    
    Args:
        name: Proposed skill name
        
    Returns:
        Validation result with suggestions if invalid
    """
    import re
    
    # Check for valid characters (letters, numbers, hyphens, underscores)
    if not re.match(r'^[a-zA-Z0-9_-]+$', name):
        return {
            "valid": False,
            "reason": "El nombre solo puede contener letras, números, guiones y guiones bajos",
            "suggestion": re.sub(r'[^a-zA-Z0-9_-]', '', name)
        }
    
    # Check length
    if len(name) < 2:
        return {
            "valid": False,
            "reason": "El nombre debe tener al menos 2 caracteres",
            "suggestion": None
        }
    
    if len(name) > 50:
        return {
            "valid": False,
            "reason": "El nombre es demasiado largo (máximo 50 caracteres)",
            "suggestion": name[:50]
        }
    
    # Check for reserved names or common conflicts
    reserved_names = ["skill", "template", "script", "reference", "asset"]
    if name.lower() in reserved_names:
        return {
            "valid": False,
            "reason": f"'{name}' es un nombre reservado o muy genérico",
            "suggestion": f"{name}-skill" if name.lower() != "skill" else "custom-skill"
        }
    
    return {
        "valid": True,
        "reason": "Nombre válido",
        "suggestion": None
    }


def save_research_results(results: Dict[str, Any], output_file: str) -> bool:
    """
    Save research results to a JSON file
    
    Args:
        results: Research results to save
        output_file: Path to output file
        
    Returns:
        True if successful, False otherwise
    """
    try:
        output_path = Path(output_file)
        output_path.parent.mkdir(parents=True, exist_ok=True)
        
        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump(results, f, indent=2, ensure_ascii=False)
        
        return True
    except Exception as e:
        print(f"Error al guardar los resultados de investigación: {e}")
        return False


def load_research_results(input_file: str) -> Optional[Dict[str, Any]]:
    """
    Load research results from a JSON file
    
    Args:
        input_file: Path to input file
        
    Returns:
        Loaded research results or None if failed
    """
    try:
        input_path = Path(input_file)
        if not input_path.exists():
            return None
            
        with open(input_path, 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception as e:
        print(f"Error al cargar los resultados de investigación: {e}")
        return None


if __name__ == "__main__":
    # Simple CLI for testing
    if len(sys.argv) < 2:
        print("Uso: python research_helpers.py <comando> [args]")
        print("Comandos:")
        print("  sugerir-nombre <palabraClave1> [palabraClave2] ... [--categoria CAT]")
        print("  analizar-skills <directorio>")
        print("  validar-nombre <nombre>")
        sys.exit(1)
    
    command = sys.argv[1]
    
    if command == "sugerir-nombre":
        keywords = []
        category = ""
        i = 2
        while i < len(sys.argv):
            if sys.argv[i] == "--category" and i + 1 < len(sys.argv):
                category = sys.argv[i+1]
                i += 2
            else:
                keywords.append(sys.argv[i])
                i += 1
        
        suggestions = suggest_skill_name(keywords, category)
        print("Nombres de skill sugeridos:")
        for i, suggestion in enumerate(suggestions, 1):
            print(f"  {i}. {suggestion}")
    
    elif command == "analizar-skills":
        if len(sys.argv) < 3:
            print("Uso: python research_helpers.py analizar-skills <directorio>")
            sys.exit(1)
        
        directory = sys.argv[2]
        results = analyze_existing_skills(directory)
        print(json.dumps(results, indent=2, ensure_ascii=False))
    
    elif command == "validar-nombre":
        if len(sys.argv) < 3:
            print("Uso: python research_helpers.py validar-nombre <nombre>")
            sys.exit(1)
        
        name = sys.argv[2]
        result = validate_skill_name(name)
        print(json.dumps(result, indent=2, ensure_ascii=False))
    
    else:
        print(f"Comando desconocido: {command}")
        sys.exit(1)