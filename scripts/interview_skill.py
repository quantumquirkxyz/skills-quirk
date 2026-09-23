#!/usr/bin/env python3
"""Create a skill through a guided interview."""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path
from typing import Any

import yaml

sys.path.append(str(Path(__file__).parent))
from init_skill import create_skill_structure
from research_helpers import (
    analyze_existing_skills,
    search_github_patterns,
    search_web_best_practices,
    suggest_skill_name,
    validate_skill_name,
)


class SkillCreatorInterview:
    """Run the discovery-to-generation flow for a new skill."""

    def __init__(self, output_dir: str = "./skills", non_interactive: bool = False):
        self.output_dir = Path(output_dir)
        self.non_interactive = non_interactive
        self.templates_dir = Path(__file__).parent.parent / "templates"
        self.interview_state: dict[str, Any] = {
            "phase": "discovery",
            "responses": {},
            "proposals": {},
            "research_results": {},
            "skill_name": "",
            "skill_data": {},
        }
        self.load_templates()

    def load_templates(self) -> None:
        """Load interview questions and proposal templates."""
        try:
            with open(self.templates_dir / "interview_questions.yaml", encoding="utf-8") as handle:
                self.questions = yaml.safe_load(handle) or {}
            with open(self.templates_dir / "proposal_templates.yaml", encoding="utf-8") as handle:
                self.proposal_templates = yaml.safe_load(handle) or {}
        except FileNotFoundError as exc:
            print(f"Warning: could not load templates: {exc}")
            self.questions = {}
            self.proposal_templates = {}

    def ask_question(self, question: str, purpose: str = "", follow_up: str = "") -> str:
        """Ask one interactive question, or return an empty answer in automation."""
        if self.non_interactive:
            return ""

        print(f"\n{question}")
        if purpose:
            print(f"(Purpose: {purpose})")

        response = input("> ").strip()
        if follow_up and response and response.lower() not in {"skip", "s", "quit", "q", "exit"}:
            print(f"\n{follow_up}")
            follow_response = input("> ").strip()
            if follow_response:
                response = f"{response}\nDetails: {follow_response}"
        return response

    def present_proposal(self, proposal: str, context: str = "") -> str:
        """Present a proposal and capture review feedback."""
        if self.non_interactive:
            return "accepted"

        print(f"\n{proposal}")
        if context:
            print(f"(Context: {context})")
        print("\nHow would you like to proceed?")
        print("  a) Accept as-is")
        print("  b) Accept with modifications")
        print("  c) Reject and propose an alternative")
        print("  d) I need more information")

        choice = input("> ").lower().strip()
        if choice.startswith("a"):
            return "accepted"
        if choice.startswith("b"):
            return f"accepted_with_modifications: {input('What changes would you make? ').strip()}"
        if choice.startswith("c"):
            return f"rejected_with_alternative: {input('What would you propose instead? ').strip()}"
        return "needs_more_info"

    def run_discovery_phase(self) -> bool:
        """Collect the core problem, users, inputs, outputs, and domain."""
        print("\n" + "=" * 60)
        print("PHASE 1: DISCOVERY")
        print("=" * 60)
        print("I will ask a few questions to understand the skill you want to create.")

        for index, question_data in enumerate(self.questions.get("discovery", []), 1):
            response = self.ask_question(
                question_data["question"],
                question_data.get("purpose", ""),
                question_data.get("follow_up", ""),
            )
            if response.lower() in {"quit", "q", "exit"}:
                print("Interview ended by the user.")
                return False
            if response.lower() in {"skip", "s"}:
                response = ""

            self.interview_state["responses"][f"discovery_{index}"] = {
                "question": question_data["question"],
                "response": response,
                "purpose": question_data.get("purpose", ""),
            }

        self.interview_state["phase"] = "design"
        return True

    def run_design_phase(self) -> bool:
        """Propose a shape for the skill and capture review feedback."""
        print("\n" + "=" * 60)
        print("PHASE 2: COLLABORATIVE DESIGN")
        print("=" * 60)
        print("Based on your answers, I will propose a compact skill design.")

        keywords = self.extract_keywords(self.discovery_text())
        architecture = self.proposal_templates.get("architecture_templates", [{}])[0]
        architecture_text = architecture.get(
            "template",
            "Use a focused workflow skill with one primary script, one domain reference, and validation hooks.",
        )
        architecture_context = f"Detected keywords: {', '.join(keywords[:5]) or 'none'}"
        self.interview_state["proposals"]["architecture"] = {
            "proposal": architecture_text,
            "context": architecture_context,
            "feedback": self.present_proposal(architecture_text, architecture_context),
        }

        resources = self.proposal_templates.get("resource_templates", [{}])[0].get(
            "items",
            [
                "scripts/main.py - Main executable entry point",
                "references/domain.md - Domain guidance and constraints",
                "assets/README.md - Static asset notes",
                "adrs/0001-initial-design.md - Initial design decision",
            ],
        )
        resource_text = "Suggested resources:\n" + "\n".join(f"  - {item}" for item in resources)
        self.interview_state["proposals"]["resources"] = {
            "proposal": resource_text,
            "feedback": self.present_proposal(resource_text, "These files keep the generated skill testable."),
        }

        workflow = self.proposal_templates.get("workflow_templates", [{}])[0]
        steps = workflow.get(
            "steps",
            [
                "Step 1: Clarify the request",
                "Step 2: Gather required context",
                "Step 3: Produce the artifact",
                "Step 4: Validate the result",
            ],
        )
        workflow_text = f"Suggested workflow: {workflow.get('name', 'linear-process')}\n"
        workflow_text += "\n".join(f"  - {step}" for step in steps)
        self.interview_state["proposals"]["workflow"] = {
            "proposal": workflow_text,
            "feedback": self.present_proposal(workflow_text, "The flow favors predictable execution."),
        }

        self.interview_state["phase"] = "research"
        return True

    def run_research_phase(self) -> bool:
        """Collect lightweight research signals for the generated skill."""
        print("\n" + "=" * 60)
        print("PHASE 3: ASSISTED RESEARCH")
        print("=" * 60)

        if not self.non_interactive:
            choice = self.ask_question(
                "Would you like me to gather supporting research for this skill?",
                "Research can surface existing patterns and quality constraints.",
            )
            if choice.lower() in {"no", "n", "skip", "s"}:
                self.interview_state["phase"] = "naming"
                return True

        topic = self.extract_research_topic(self.discovery_text()) or "skill design"
        print(f"\nResearching: {topic}")
        keyword_query = " ".join(self.extract_keywords(self.discovery_text())[:3]) or topic
        self.interview_state["research_results"] = {
            "topic": topic,
            "web_best_practices": search_web_best_practices(topic, limit=3),
            "existing_skills_analysis": analyze_existing_skills(".agents/skills"),
            "similar_patterns": search_github_patterns(keyword_query, limit=5),
        }

        if not self.non_interactive:
            self.present_proposal(
                "Research results have been captured and will be referenced in the generated skill.",
                "You can edit the generated files after creation.",
            )

        self.interview_state["phase"] = "naming"
        return True

    def run_naming_phase(self) -> bool:
        """Suggest and choose a skill name."""
        print("\n" + "=" * 60)
        print("PHASE 4: NAMING")
        print("=" * 60)

        keywords = self.extract_keywords(self.discovery_text()) or ["step"]
        category = self.infer_category(self.discovery_text())
        suggestions = suggest_skill_name(keywords, category) or [f"{keywords[0]}-{category}"]

        print("\nSuggested names:")
        for index, suggestion in enumerate(suggestions[:5], 1):
            validation = validate_skill_name(suggestion)
            status = "valid" if validation["valid"] else "needs review"
            print(f"  {index}. {suggestion} ({status})")

        if self.non_interactive:
            chosen_name = suggestions[0]
        else:
            answer = self.ask_question(
                "Which name should I use? Enter a number or type a full skill name.",
                "The name becomes the generated directory name.",
            )
            if answer.isdigit() and 1 <= int(answer) <= len(suggestions):
                chosen_name = suggestions[int(answer) - 1]
            elif answer.strip():
                chosen_name = answer.strip()
            else:
                chosen_name = suggestions[0]

        validation = validate_skill_name(chosen_name)
        if not validation["valid"]:
            print("The chosen name has validation warnings:")
            for error in validation.get("errors", []):
                print(f"  - {error}")
            fallback = suggestions[0]
            print(f"Using fallback name: {fallback}")
            chosen_name = fallback

        self.interview_state["skill_name"] = chosen_name
        self.interview_state["phase"] = "generation"
        return True

    def run_generation_phase(self) -> bool:
        """Generate the skill directory and interview trace."""
        print("\n" + "=" * 60)
        print("PHASE 5: GENERATION")
        print("=" * 60)

        skill_name = self.interview_state["skill_name"] or "step-workflow"
        skill_data = self.prepare_skill_data()
        skill_dir = create_skill_structure(skill_name, self.output_dir, {"skill_data": skill_data})
        trace_file = skill_dir / f"{skill_name}-interview.json"
        with open(trace_file, "w", encoding="utf-8") as handle:
            json.dump(self.interview_state, handle, indent=2)

        print(f"\nSkill created at: {skill_dir}")
        print(f"Interview trace written to: {trace_file}")
        self.interview_state["phase"] = "complete"
        return True

    def prepare_skill_data(self) -> dict[str, Any]:
        """Turn interview state into generator data."""
        text = self.discovery_text()
        skill_name = self.interview_state["skill_name"] or "step-workflow"
        title = skill_name.replace("-", " ").title()
        return {
            "skill_name": skill_name,
            "title": title,
            "category": self.infer_category(text),
            "version": "1",
            "description": self.first_sentence(text) or f"Guide users through the {title.lower()} workflow.",
            "capabilities": [
                f"run the {title.lower()} workflow",
                "collect required context before acting",
                "validate generated outputs against completion criteria",
            ],
            "outputs": [
                "Completed workflow artifact",
                "Validation notes and follow-up recommendations",
            ],
            "side_effects": ["write-files"],
            "risk": "medium",
            "trust_tier": "3",
            "stop_condition": "The workflow output is generated, validated, and ready for handoff.",
            "long_description": self.first_sentence(text)
            or f"{title} is a focused workflow skill generated from an interactive interview.",
            "usage_context": "Use this skill when the user asks for this workflow by name or describes the matching task.",
            "core_principles": [
                "Clarify the goal before changing files.",
                "Keep generated artifacts small, traceable, and easy to review.",
                "Validate outputs before reporting completion.",
            ],
            "scope": f"{title} workflow execution and supporting documentation.",
            "limitations": "Does not replace domain expert review for high-risk decisions.",
            "example_trigger": f"Use {skill_name} to produce the requested workflow artifact.",
            "example_description": f"Generate and validate the {title.lower()} output from user-provided context.",
            "example_input": "User request, repository context, and any linked source material.",
            "example_output": "Generated artifact plus validation notes.",
            "example_side_effect": "Writes files only when the requested workflow requires it.",
            "research_topic": self.interview_state.get("research_results", {}).get("topic", "skill design"),
        }

    def discovery_text(self) -> str:
        """Return all discovery answers as one text block."""
        return " ".join(
            item["response"]
            for key, item in self.interview_state["responses"].items()
            if key.startswith("discovery_") and item.get("response")
        )

    def extract_keywords(self, text: str) -> list[str]:
        """Extract simple lowercase keywords from free text."""
        stop_words = {
            "the",
            "and",
            "or",
            "but",
            "for",
            "with",
            "from",
            "into",
            "that",
            "this",
            "skill",
            "user",
            "users",
            "create",
            "make",
            "need",
            "needs",
            "should",
            "would",
        }
        words = []
        for raw_word in text.replace("/", " ").replace("_", " ").replace("-", " ").split():
            word = "".join(character for character in raw_word.lower() if character.isalnum())
            if len(word) > 2 and word not in stop_words:
                words.append(word)
        seen: set[str] = set()
        return [word for word in words if not (word in seen or seen.add(word))]

    def extract_research_topic(self, text: str) -> str:
        """Build a compact research topic from extracted keywords."""
        return " ".join(self.extract_keywords(text)[:3])

    def infer_category(self, text: str) -> str:
        """Infer a broad category from the request text."""
        normalized = text.lower()
        category_terms = {
            "frontend": ["frontend", "react", "ui", "ux", "component", "accessibility"],
            "backend": ["backend", "api", "server", "database", "queue"],
            "delivery": ["test", "review", "deploy", "release", "implementation"],
            "skill-dev": ["skill", "agent", "prompt", "workflow"],
            "data": ["data", "etl", "warehouse", "analytics"],
        }
        for category, terms in category_terms.items():
            if any(term in normalized for term in terms):
                return category
        return "workflow"

    def first_sentence(self, text: str) -> str:
        """Return a short description from the first useful answer."""
        cleaned = " ".join(text.split())
        if not cleaned:
            return ""
        return cleaned.split(".")[0].strip()[:220]

    def run_interview(self) -> bool:
        """Execute all interview phases."""
        print("Skill Creator Interview")
        print("=" * 60)
        print("This tool helps you design and generate a Codex skill.")

        for phase in (
            self.run_discovery_phase,
            self.run_design_phase,
            self.run_research_phase,
            self.run_naming_phase,
            self.run_generation_phase,
        ):
            if not phase():
                return False

        print("\nSkill creation complete.")
        return True


def main() -> int:
    parser = argparse.ArgumentParser(description="Create a skill through a guided interview")
    parser.add_argument("--output-dir", default="./skills", help="Directory where the skill will be created")
    parser.add_argument("--non-interactive", action="store_true", help="Run with default answers")
    parser.add_argument("--demo", action="store_true", help="Alias for --non-interactive")
    args = parser.parse_args()

    interview = SkillCreatorInterview(args.output_dir, args.non_interactive or args.demo)
    return 0 if interview.run_interview() else 1


if __name__ == "__main__":
    sys.exit(main())
