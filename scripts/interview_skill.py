#!/usr/bin/env python3
"""
Interactive skill creation tool
Guides users through creating a new skill via conversational interview
"""

import argparse
import json
import os
import sys
import yaml
from pathlib import Path
from typing import Dict, List, Any, Optional
import subprocess

# Import our research helpers
sys.path.append(str(Path(__file__).parent))
from research_helpers import (
    search_github_patterns,
    search_web_best_practices,
    analyze_existing_skills,
    suggest_skill_name,
    validate_skill_name,
    save_research_results,
    load_research_results
)


class SkillCreatorInterview:
    def __init__(self, output_dir: str = "./skills", non_interactive: bool = False):
        self.output_dir = Path(output_dir)
        self.non_interactive = non_interactive
        self.interview_state = {
            "phase": "discovery",
            "responses": {},
            "proposals": {},
            "research_results": {},
            "skill_name": "",
            "skill_data": {}
        }
        
        # Load templates
        self.templates_dir = Path(__file__).parent.parent / "templates"
        self.load_templates()
    
    def load_templates(self):
        """Load interview questions and proposal templates"""
        try:
            with open(self.templates_dir / "interview_questions.yaml", 'r', encoding='utf-8') as f:
                self.questions = yaml.safe_load(f)
            
            with open(self.templates_dir / "proposal_templates.yaml", 'r', encoding='utf-8') as f:
                self.proposals_templates = yaml.safe_load(f)
        except FileNotFoundError as e:
            print(f"Warning: Could not load templates: {e}")
            self.questions = {}
            self.proposals_templates = {}
    
    def ask_question(self, question: str, purpose: str = "", follow_up: str = "") -> str:
        """Ask a question and get user response"""
        if self.non_interactive:
            # In non-interactive mode, return empty string or default
            return ""
        
        print(f"\n{question}")
        if purpose:
            print(f"(Propósito: {purpose})")
        
        response = input("> ").strip()
        
        if follow_up and response:
            print(f"\n{follow_up}")
            follow_response = input("> ").strip()
            if follow_response:
                response += f" Detalles: {follow_response}"
        
        return response
    
    def present_proposal(self, proposal: str, context: str = "") -> str:
        """Present a proposal and get user feedback"""
        if self.non_interactive:
            return "accepted"  # Auto-accept in non-interactive mode
        
        print(f"\n{proposal}")
        if context:
            print(f"(Contexto: {context})")
        
        print("\n¿Cómo quieres proceder?")
        print("  a) Aceptar tal cual")
        print("  b) Aceptar con modificaciones")
        print("  c) Rechazar y proposer alternativa")
        print("  d) Necesito más información")
        
        choice = input("> ").lower().strip()
        
        if choice.startswith('a'):
            return "accepted"
        elif choice.startswith('b'):
            modifications = input("¿Qué modificaciones harías? ").strip()
            return f"accepted_with_modifications: {modifications}"
        elif choice.startswith('c'):
            alternative = input("¿Qué propondrías en su lugar? ").strip()
            return f"rejected_with_alternative: {alternative}"
        else:
            return "needs_more_info"
    
    def run_discovery_phase(self):
        """Run the discovery phase of the interview"""
        print("\n" + "="*60)
        print("FASE 1: DESCUBRIMIENTO")
        print("="*60)
        print("Voy a hacerte algunas preguntas para entender qué skill quieres crear.")
        
        discovery_questions = self.questions.get('discovery', [])
        
        for i, q_data in enumerate(discovery_questions, 1):
            question = q_data['question']
            purpose = q_data['purpose']
            follow_up = q_data.get('follow_up', '')
            
            response = self.ask_question(question, purpose, follow_up)
            self.interview_state["responses"][f"discovery_{i}"] = {
                "question": question,
                "response": response,
                "purpose": purpose
            }
            
            # Allow user to skip or stop early in non-critical questions
            if not self.non_interactive and i < len(discovery_questions):
                if response.lower() in ['salir', 'exit', 'quit', 'q']:
                    print("Entrevista terminada por el usuario.")
                    return False
                elif response.lower() in ['saltar', 'skip', 's']:
                    continue
        
        self.interview_state["phase"] = "design"
        return True
    
    def run_design_phase(self):
        """Run the design phase of the interview"""
        print("\n" + "="*60)
        print("FASE 2: DISEÑO COLABORATIVO")
        print("="*60)
        print("Basándome en tus respuestas, propondré algunas opciones de diseño.")
        
        # Extract key information from discovery
        discovery_responses = {k: v for k, v in self.interview_state["responses"].items() 
                              if k.startswith('discovery_')}
        
        # Simple keyword extraction (in practice, this would be more sophisticated)
        all_text = " ".join([v["response"] for v in discovery_responses.values()])
        keywords = self.extract_keywords(all_text)
        
        # Propose architecture
        arch_template = self.proposals_templates.get('architecture_templates', [{}])[0]
        arch_proposal = arch_template.get('template', 
            "Basado en tus respuestas, propongo un enfoque de workflow multi-paso donde cada paso es manejado por un script especializado.")
        arch_context = f"Palabras clave identificadas: {', '.join(keywords[:5])}"
        
        feedback = self.present_proposal(arch_proposal, arch_context)
        self.interview_state["proposals"]["architecture"] = {
            "proposal": arch_proposal,
            "context": arch_context,
            "feedback": feedback
        }
        
        # Propose resources
        resource_template = self.proposals_templates.get('resource_templates', [{}])[0]
        resource_proposal = "Para los recursos necesarios, sugiero crear los siguientes scripts/references/assets:"
        resource_items = resource_template.get('items', [
            "scripts/main.py - Script principal con lógica de ejecución",
            "scripts/utils.py - Funciones auxiliares y helpers", 
            "references/domain.md - Referencia de dominio específica",
            "assets/examples/ - Ejemplos de uso y outputs esperados"
        ])
        resource_list = "\n".join([f"  - {item}" for item in resource_items])
        resource_proposal_full = f"{resource_proposal}\n{resource_list}"
        
        feedback = self.present_proposal(resource_proposal_full, 
                                        "Estos recursos cubren los aspectos básicos que casi todas las skills necesitan")
        self.interview_state["proposals"]["resources"] = {
            "proposal": resource_proposal_full,
            "feedback": feedback
        }
        
        # Propose workflow
        workflow_template = self.proposals_templates.get('workflow_templates', [{}])[0]
        workflow_name = workflow_template.get('name', 'linear-process')
        workflow_steps = workflow_template.get('steps', [
            "Paso 1: Preparación y validación de inputs",
            "Paso 2: Procesamiento principal", 
            "Paso 3: Generación de outputs",
            "Paso 4: Reporte de resultados"
        ])
        workflow_proposal = f"El flujo de trabajo que imagino sería: {workflow_name.replace('-', ' ').title()}"
        workflow_steps_text = "\n".join([f"  {step}" for step in workflow_steps])
        workflow_proposal_full = f"{workflow_proposal}:\n{workflow_steps_text}"
        
        feedback = self.present_proposal(workflow_proposal_full,
                                        "Este flujo cubre el proceso básico de entrada-procesamiento-salida")
        self.interview_state["proposals"]["workflow"] = {
            "proposal": workflow_proposal_full,
            "feedback": feedback
        }
        
        self.interview_state["phase"] = "research"
        return True
    
    def run_research_phase(self):
        """Run the research assistance phase"""
        print("\n" + "="*60)
        print("FASE 3: INVESTIGACIÓN ASISTIDA")
        print("="*60)
        print("Puedo ayudarte a investigar mejores prácticas y patrones existentes.")
        
        # Ask if user wants research
        if not self.non_interactive:
            want_research = self.ask_question(
                "¿Te gustaría que investigue algunas mejores prácticas actuales para tu skill?",
                "Obtener información actualizada de fuentes externas",
                "Puedo buscar en habilidades existentes, documentación web y mejores prácticas de la industria"
            )
            
            if want_research.lower() in ['no', 'n', 'skip', 'saltar']:
                self.interview_state["phase"] = "naming"
                return True
        
        # Extract topic for research
        discovery_responses = {k: v for k, v in self.interview_state["responses"].items() 
                              if k.startswith('discovery_')}
        all_text = " ".join([v["response"] for v in discovery_responses.values()])
        
        # Simple topic extraction (would be more sophisticated in practice)
        topic = self.extract_research_topic(all_text)
        if not topic:
            topic = "skill design"  # fallback
        
        # Perform research
        print(f"\nInvestigando mejores prácticas para: {topic}")
        
        # Search web best practices
        web_results = search_web_best_practices(topic, limit=3)
        
        # Analyze existing skills for patterns
        skills_analysis = analyze_existing_skills(".agents/skills")
        
        # Search for similar patterns in existing skills
        keyword_query = " ".join(self.extract_keywords(all_text)[:3])
        github_patterns = search_github_patterns(keyword_query, limit=5)
        
        research_results = {
            "topic": topic,
            "web_best_practices": web_results,
            "existing_skills_analysis": skills_analysis,
            "similar_patterns": github_patterns,
            "timestamp": str(Path(__file__).stat().st_mtime)
        }
        
        self.interview_state["research_results"] = research_results
        
        # Present findings
        if not self.non_interactive:
            print("\n" + "-"*50)
            print("RESUMEN DE INVESTIGACIÓN")
            print("-"*50)
            
            if web_results:
                print("\nMejores prácticas encontradas en la web:")
                for i, practice in enumerate(web_results[:2], 1):
                    print(f"  {i}. {practice['title']} ({practice['source']})")
                    print(f"     {practice['summary'][:100]}...")
            
            if github_patterns:
                print("\nPatrones similares en skills existentes:")
                for i, pattern in enumerate(github_patterns[:2], 1):
                    print(f"  {i}. {pattern['skill_name']}: {pattern['pattern_matched']}")
            
            if skills_analysis.get("total_skills_found", 0) > 0:
                print(f"\nAnálisis de skills existentes:")
                print(f"  - {skills_analysis['total_skills_found']} skills encontradas")
                if skills_analysis.get("categories_distribution"):
                    top_category = max(skills_analysis["categories_distribution"].items(), 
                                     key=lambda x: x[1], default=(None, 0))
                    if top_category[0]:
                        print(f"  - Categoría más común: {top_category[0]} ({top_category[1]} skills)")
            
            use_findings = self.ask_question(
                "¿Cómo te gustaría usar estos hallazgos en el diseño de tu skill?",
                "Integrar investigación en el diseño final",
                "Puedes aceptar las sugerencias, modificarlas o ignorarlas según lo que veas pertinente"
            )
            
            self.interview_state["proposals"]["research_findings"] = {
                "research_results": research_results,
                "user_intention": use_findings
            }
        
        self.interview_state["phase"] = "naming"
        return True
    
    def run_naming_phase(self):
        """Run the naming phase"""
        print("\n" + "="*60)
        print("FASE 4: NOMBRADO")
        print("="*60)
        print("Basándome en nuestra conversación, sugeriré algunos nombres para tu skill.")
        
        # Extract keywords from all phases
        all_responses = {}
        all_responses.update(self.interview_state["responses"])
        all_responses.update(self.interview_state["proposals"])
        
        all_text = ""
        for phase_data in [self.interview_state["responses"], self.interview_state["proposals"]]:
            for key, value in phase_data.items():
                if isinstance(value, dict) and "response" in value:
                    all_text += " " + value["response"]
                elif isinstance(value, dict) and "proposal" in value:
                    all_text += " " + value["proposal"]
                elif isinstance(value, str):
                    all_text += " " + value
        
        keywords = self.extract_keywords(all_text)
        
        # Try to infer category from responses
        category = self.infer_category(all_text)
        
        # Generate name suggestions
        suggestions = suggest_skill_name(keywords, category, algorithm="keyword-category-suffix")
        
        # Add some descriptive phrase suggestions
        desc_suggestions = suggest_skill_name(keywords, category, algorithm="descriptive-phrase")
        suggestions.extend(desc_suggestions[:2])  # Add top 2 descriptive suggestions
        
        # Remove duplicates while preserving order
        seen = set()
        unique_suggestions = []
        for suggestion in suggestions:
            if suggestion not in seen:
                seen.add(suggestion)
                unique_suggestions.append(suggestion)
        
        suggestions = unique_suggestions[:5]  # Limit to top 5
        
        print("\nBasándome en nuestras discusiones, aquí tienes algunas sugerencias de nombres:")
        for i, suggestion in enumerate(suggestions, 1):
            validation = validate_skill_name(suggestion)
            status = "✓" if validation["valid"] else "✗"
            print(f"  {i}. {suggestion} {status}")
            if not validation["valid"]:
                print(f"     (Problema: {validation['reason']})")
        
        # Get user choice
        if not self.non_interactive:
            while True:
                choice = self.ask_question(
                    "Selecciona un número (1-5), escribe tu propio nombre, o 'modificar' para cambiar una sugerencia",
                    "Elegir el nombre final para tu skill"
                )
                
                if choice.isdigit():
                    idx = int(choice) - 1
                    if 0 <= idx < len(suggestions):
                        selected_name = suggestions[idx]
                        break
                    else:
                        print("Por favor, elige un número entre 1 y 5")
                elif choice.lower() == "modificar":
                    mod_choice = self.ask_question(
                        "¿Qué número de sugerencia quieres modificar? (1-5) o escribe tu propio nombre completamente",
                        "Modificar una sugerencia de nombre"
                    )
                    if mod_choice.isdigit():
                        idx = int(mod_choice) - 1
                        if 0 <= idx < len(suggestions):
                            base_name = suggestions[idx]
                            modification = self.ask_question(
                                f"¿Cómo quieres modificar '{base_name}'?",
                                "Editar la sugerencia de nombre"
                            )
                            selected_name = f"{base_name}-{modification}" if modification else base_name
                            break
                        else:
                            print("Por favor, elige un número entre 1 y 5")
                    else:
                        selected_name = mod_choice
                        break
                else:
                    selected_name = choice
                    break
            
            # Validate the final choice
            validation = validate_skill_name(selected_name)
            if not validation["valid"]:
                print(f"\nAdvertencia: {validation['reason']}")
                if validation["suggestion"]:
                    use_suggestion = self.ask_question(
                        f"¿Quieres usar la sugerencia '{validation['suggestion']}' en su lugar? (s/n)",
                        "Corrección automática de nombre"
                    )
                    if use_suggestion.lower() in ['s', 'si', 'sí', 'y', 'yes']:
                        selected_name = validation["suggestion"]
                    else:
                        print("Continuando con el nombre tal como lo ingresaste (podría causar problemas)")
            else:
                print(f"\n✓ Nombre '{selected_name}' validado correctamente")
        else:
            # Non-interactive mode: use first valid suggestion or generate one
            selected_name = ""
            for suggestion in suggestions:
                validation = validate_skill_name(suggestion)
                if validation["valid"]:
                    selected_name = suggestion
                    break
            
            if not selected_name:
                # Generate a fallback name
                keyword_part = keywords[0] if keywords else "skill"
                category_part = f"-{category}" if category else ""
                selected_name = f"{keyword_part}{category_part}-helper"
                # Ensure it's valid
                validation = validate_skill_name(selected_name)
                if not validation["valid"]:
                    selected_name = "custom-skill-helper"
        
        self.interview_state["skill_name"] = selected_name
        self.interview_state["phase"] = "generation"
        return True
    
    def run_generation_phase(self):
        """Run the skill generation phase"""
        print("\n" + "="*60)
        print("FASE 5: GENERACIÓN DE LA SKILL")
        print("="*60)
        print(f"Generando la skill '{self.interview_state['skill_name']}'...")
        
        # Prepare skill data for template generation
        self.interview_state["skill_data"] = self.prepare_skill_data()
        
        # Create output directory
        skill_output_dir = self.output_dir / self.interview_state["skill_name"]
        skill_output_dir.mkdir(parents=True, exist_ok=True)
        
        # Create directory structure
        (skill_output_dir / "scripts").mkdir(exist_ok=True)
        (skill_output_dir / "references").mkdir(exist_ok=True)
        (skill_output_dir / "assets").mkdir(exist_ok=True)
        (skill_output_dir / "adrs").mkdir(exist_ok=True)
        
        # Generate SKILL.md from template
        self.generate_skill_file(skill_output_dir)
        
        # Generate main script
        self.generate_main_script(skill_output_dir)
        
        # Generate reference files
        self.generate_reference_files(skill_output_dir)
        
        # Generate initial ADR
        self.generate_initial_adr(skill_output_dir)
        
        # Generate basic assets (placeholder)
        self.generate_basic_assets(skill_output_dir)
        
        print(f"\n✓ Skill generada en: {skill_output_dir}")
        print("\nPróximos pasos sugeridos:")
        print(f"  1. Revisa y personaliza el SKILL.md generado")
        print(f"  2. Implementa la lógica en scripts/main.py")
        print(f"  3. Agrega documentación específica en references/")
        print(f"  4. Prueba tu skill con: python {skill_output_dir}/scripts/main.py --help")
        
        self.interview_state["phase"] = "complete"
        return True
    
    def extract_keywords(self, text: str) -> List[str]:
        """Extract keywords from text (simplified implementation)"""
        # Convert to lowercase and split
        words = text.lower().split()
        
        # Remove common words (stop words)
        stop_words = {
            'el', 'la', 'los', 'las', 'un', 'una', 'y', 'o', 'pero', 'porque', 'como',
            'cuando', 'donde', 'quien', 'que', 'este', 'esta', 'estos', 'estas',
            'para', 'por', 'con', 'sin', 'sobre', 'under', 'entre', 'hacia', 'desde',
            'the', 'a', 'an', 'and', 'or', 'but', 'because', 'as', 'when', 'where',
            'who', 'what', 'which', 'this', 'that', 'these', 'those', 'for', 'with',
            'without', 'about', 'above', 'below', 'between', 'through', 'during',
            'before', 'after', 'above', 'below', 'to', 'from', 'up', 'down', 'in',
            'out', 'on', 'off', 'over', 'under', 'again', 'further', 'then', 'once',
            'skill', 'crear', 'creates', 'created', 'making', 'make', 'hacer',
            'qué', 'como', 'cuál', 'dónde', 'cuándo', 'por qué', 'para qué'
        }
        
        # Filter words: keep alphanumeric words longer than 2 chars that aren't stop words
        keywords = []
        for word in words:
            # Clean word
            cleaned = ''.join(c for c in word if c.isalnum())
            if len(cleaned) > 2 and cleaned not in stop_words and cleaned.isalpha():
                keywords.append(cleaned)
        
        # Count frequency and return top keywords
        from collections import Counter
        word_counts = Counter(keywords)
        return [word for word, count in word_counts.most_common(10)]
    
    def extract_research_topic(self, text: str) -> str:
        """Extract a research topic from text"""
        # Look for domain-specific terms
        domain_indicators = [
            'api', 'web', 'data', 'database', 'security', 'performance', 
            'testing', 'devops', 'cloud', 'ai', 'ml', 'machine learning',
            'skill', 'automation', 'script', 'template', 'document',
            'design', 'architecture', 'pattern', 'best practice'
        ]
        
        text_lower = text.lower()
        for indicator in domain_indicators:
            if indicator in domain_indicators and indicator in text_lower:
                return indicator
        
        # Fallback to first meaningful keyword
        keywords = self.extract_keywords(text)
        return keywords[0] if keywords else "general"
    
    def infer_category(self, text: str) -> str:
        """Infer skill category from text"""
        category_indicators = {
            'workflow': ['workflow', 'proceso', 'process', 'pipeline', 'flujo'],
            'utility': ['utility', 'utilidad', 'helper', 'utils', 'tool'],
            'design': ['design', 'diseño', 'ui', 'ux', 'interface'],
            'analysis': ['analysis', 'análisis', 'analyze', 'analizar', 'check', 'validar'],
            'generation': ['generation', 'generación', 'generate', 'generar', 'create', 'crear'],
            'validation': ['validation', 'validación', 'validate', 'validar', 'test', 'testear'],
            'integration': ['integration', 'integración', 'integrate', 'integrar', 'connect', 'conectar'],
            'conversion': ['conversion', 'conversión', 'convert', 'convertir', 'transform', 'transformar'],
            'monitoring': ['monitoring', 'monitoreo', 'monitor', 'track', 'rastrear', 'log'],
            'deployment': ['deployment', 'despliegue', 'deploy', 'desplegar', 'release', 'liberar']
        }
        
        text_lower = text.lower()
        for category, indicators in category_indicators.items():
            for indicator in indicators:
                if indicator in text_lower:
                    return category
        
        return "general"  # default category
    
    def prepare_skill_data(self) -> Dict[str, Any]:
        """Prepare all collected data for skill template generation"""
        # Extract basic info from discovery
        discovery_responses = {k: v for k, v in self.interview_state["responses"].items() 
                              if k.startswith('discovery_')}
        
        # Initialize with defaults
        skill_data = {
            "name": self.interview_state["skill_name"],
            "description": "Skill creada mediante entrevista interactiva",
            "category": self.infer_category(" ".join([v["response"] for v in discovery_responses.values()])),
            "maturity": "experimental",
            "version": "1",
            "capabilities": [],
            "outputs": [],
            "inputs": [],
            "dependencies": [],
            "side_effects": [],
            "stop_condition": "Usuario puede crear y usar la skill para su propósito previsto",
            "risk": "low",
            "trust_tier": "2",
            "max_iterations": "5",
            "input_description": "Entradas específicas para la skill",
            "output_description": "Salidas específicas de la skill",
            "stop_condition_details": "Criterios de finalización claros y medibles",
            "long_description": "Descripción detallada de la skill y su propósito",
            "rules": [
                "Las skills generadas deben ser compatibles con el método quirk",
                "Las skills deben seguir el principio de divulgación progresiva",
                "Las skills deben tener contratos explícitos y claros"
            ],
            "scope": "Creación de skills específicas para el ecosistema quirk",
            "example_skill_name": self.interview_state["skill_name"],
            "example_one_sentence_desc": "Skill creada mediante entrevista interactiva para resolver un problema específico",
            "example_problem_solved": "Problema identificado durante la fase de descubrimiento",
            "example_description": "Descripción de la skill basada en los requisitos descubiertos",
            "example_input_1": "Input principal identificado en discovery",
            "example_input_2": "Input secundario opcional",
            "example_input_3": "Input de configuración o contexto",
            "example_output_1": "Output principal de la skill",
            "example_output_2": "Output de diagnóstico o información adicional",
            "example_output_3": "Output de estado o progreso",
            "example_output_4": "Output de recomendaciones o siguientes pasos",
            "example_dependency_1": "Dependencia opcional para funcionalidad extendida",
            "example_dependency_1_why": "Razón por la cual esta dependencia es necesaria",
            "example_dependency_2": "Otra dependencia opcional",
            "example_dependency_2_why": "Razón por la cual esta dependencia es necesaria",
            "example_side_effect": "Modificación honesta del repositorio (si aplica)",
            "example_stop_condition": "Objetivo principal de la skill logrado y verificado",
            "example_justification": "Justificación del nivel de riesgo basado en operaciones seguras",
            "example_use_case_lower": "uso típico de la skill",
            "example_output_type": "resultado principal de la skill"
        }
        
        # Try to extract more specific info from responses
        if discovery_responses:
            # Try to get problem statement from first discovery question
            first_response = list(discovery_responses.values())[0] if discovery_responses else None
            if first_response and first_response.get("response"):
                skill_data["example_problem_solved"] = first_response["response"][:100] + "..."
                skill_data["description"] = f"Skill para resolver: {first_response['response'][:100]}..."
            
            # Try to get use cases from second discovery question
            if len(discovery_responses) >= 2:
                second_response = list(discovery_responses.values())[1]
                if second_response and second_response.get("response"):
                    # Extract potential capabilities from use cases
                    use_cases_text = second_response["response"]
                    # Simple extraction: look for verbs that could be capabilities
                    action_verbs = ['analizar', 'validar', 'generar', 'convertir', 'crear', 
                                   'detectar', 'encontrar', 'calcular', 'optimizar', 'mejorar']
                    capabilities = []
                    for verb in action_verbs:
                        if verb in use_cases_text.lower():
                            # Create capability name
                            capability = verb
                            # Try to find object of the verb (simplified)
                            if 'api' in use_cases_text.lower():
                                capability += "-api"
                            elif 'data' in use_cases_text.lower():
                                capability += "-data"
                            elif 'skill' in use_cases_text.lower():
                                capability += "-skill"
                            capabilities.append(capability)
                    
                    if capabilities:
                        skill_data["capabilities"] = capabilities[:3]  # Limit to 3
                    else:
                        skill_data["capabilities"] = ["procesar-inputs", "generar-outputs", "validar-resultados"]
            
            # Try to get more specific description from later responses
            all_responses_text = " ".join([v["response"] for v in discovery_responses.values()])
            if len(all_responses_text.strip()) > 20:
                skill_data["long_description"] = f"Skill diseñada para: {all_responses_text[:200]}..."
        
        # Add research insights if available
        research_results = self.interview_state.get("research_results", {})
        if research_results:
            # Add research-based dependencies or capabilities
            web_practices = research_results.get("web_best_practices", [])
            if web_practices:
                skill_data["dependencies"].append("referencias-externas")
                skill_data["side_effects"].append("actualización-de-referencias")
        
        return skill_data
    
    def generate_skill_file(self, output_dir: Path):
        """Generate SKILL.md from template"""
        template_path = self.templates_dir / "skill_skeleton" / "SKILL.md.template"
        if not template_path.exists():
            print(f"Warning: Template not found at {template_path}")
            return
        
        template_content = template_path.read_text(encoding='utf-8')
        skill_data = self.interview_state["skill_data"]
        
        # Simple template replacement
        content = template_content
        for key, value in skill_data.items():
            placeholder = f"{{{{key}}}}"
            if isinstance(value, list):
                # Handle lists specially
                if key == "capabilities":
                    list_content = "\n".join([f"  - {item}" for item in value])
                    content = content.replace("{{#CAPABILITIES}}\n  - {{.}}\n{{/CAPABILITIES}}", list_content)
                elif key == "outputs":
                    list_content = "\n".join([f"  - {item}" for item in value])
                    content = content.replace("{{#OUTPUTS}}\n  - {{.}}\n{{/OUTPUTS}}", list_content)
                elif key == "inputs":
                    list_content = "\n".join([f"  - {item}" for item in value])
                    # Replace inputs section
                    inputs_start = content.find("Explicit Inputs (what the skill consumes):")
                    inputs_end = content.find("Explicit Outputs (what the skill produces):")
                    if inputs_start != -1 and inputs_end != -1:
                        inputs_section = content[inputs_start:inputs_end]
                        new_inputs = "Explicit Inputs (what the skill consumes):\n" + list_content + "\n"
                        content = content.replace(inputs_section, new_inputs)
                elif key == "dependencies":
                    list_content = "\n".join([f"  - {item} (why: {item} dependency)" for item in value])
                    # Replace dependencies section
                    deps_start = content.find("Dependencies (minimal and intentional):")
                    deps_end = content.find("Side Effects (honest repository modifications):")
                    if deps_start != -1 and deps_end != -1:
                        deps_section = content[deps_start:deps_end]
                        new_deps = "Dependencies (minimal and intentional):\n" + list_content + "\n"
                        content = content.replace(deps_section, new_deps)
                elif key == "side_effects":
                    list_content = "\n".join([f"  - {item}" for item in value])
                    # Replace side effects section
                    se_start = content.find("Side Effects (honest repository modifications):")
                    se_end = content.find("Stop Condition (clear, checkable completion criteria):")
                    if se_start != -1 and se_end != -1:
                        se_section = content[se_start:se_end]
                        new_se = "Side Effects (honest repository modifications):\n" + list_content + "\n"
                        content = content.replace(se_section, new_se)
                elif key == "rules":
                    list_content = "\n".join([f"- Rule: {item}" for item in value])
                    content = content.replace("{{#RULES}}\n- Rule: {{.}}\n{{/RULES}}", list_content)
            elif isinstance(value, bool):
                # Handle boolean values for checkboxes
                if key.endswith("_required") or "risk" in key.lower():
                    continue  # Skip for now
                checkbox = "[x]" if value else "[ ]"
                content = content.replace(f"{{{{key}}}}", checkbox)
            else:
                content = content.replace(f"{{{{key}}}}", str(value))
        
        # Handle remaining list sections with simple replacement
        content = content.replace("{{#CAPABILITIES}}\n  - {{.}}\n{{/CAPABITIES}}", 
                                 "\n".join([f"  - {cap}" for cap in skill_data.get("capabilities", [])]))
        content = content.replace("{{#OUTPUTS}}\n  - {{.}}\n{{/OUTPUTS}}", 
                                 "\n".join([f"  - {out}" for out in skill_data.get("outputs", [])]))
        content = content.replace("{{#RULES}}\n- Rule: {{.}}\n{{/RULES}}", 
                                 "\n".join([f"- Rule: {rule}" for rule in skill_data.get("rules", [])]))
        
        # Write the file
        skill_file = output_dir / "SKILL.md"
        skill_file.write_text(content, encoding='utf-8')
        print(f"  ✓ SKILL.md creado")
    
    def generate_main_script(self, output_dir: Path):
        """Generate main.py from template"""
        template_path = self.templates_dir / "skill_skeleton" / "scripts" / "main.py.template"
        if not template_path.exists():
            print(f"Warning: Template not found at {template_path}")
            return
        
        template_content = template_path.read_text(encoding='utf-8')
        skill_data = self.interview_state["skill_data"]
        
        # Simple template replacement
        content = template_content
        replacements = {
            "{{SKILL_NAME}}": skill_data["name"],
            "{{SKILL_DESCRIPTION}}": skill_data["description"],
            "{{SKILL_VERSION}}": skill_data["version"]
        }
        
        for placeholder, value in replacements.items():
            content = content.replace(placeholder, value)
        
        # Write the file
        scripts_dir = output_dir / "scripts"
        scripts_dir.mkdir(exist_ok=True)
        main_file = scripts_dir / "main.py"
        main_file.write_text(content, encoding='utf-8')
        print(f"  ✓ scripts/main.py creado")
    
    def generate_reference_files(self, output_dir: Path):
        """Generate reference files"""
        # Generate domain.md
        domain_template = self.templates_dir / "skill_skeleton" / "references" / "domain.md.template"
        if domain_template.exists():
            template_content = domain_template.read_text(encoding='utf-8')
            skill_data = self.interview_state["skill_data"]
            
            content = template_content
            replacements = {
                "{{SKILL_NAME}}": skill_data["name"],
                "{{KEY_CONCEPT_1}}": "Concepto principal del dominio",
                "{{KEY_CONCEPT_2}}": "Segundo concepto importante", 
                "{{KEY_CONCEPT_3}}": "Tercer concepto relevante",
                "{{BEST_PRACTICE_1}}": "Mejor práctica 1 para este dominio",
                "{{BEST_PRACTICE_2}}": "Mejor práctica 2 para este dominio",
                "{{BEST_PRACTICE_3}}": "Mejor práctica 3 para este dominio",
                "{{PATTERN_1}}": "Patrón común 1",
                "{{PATTERN_2}}": "Patrón común 2",
                "{{PATTERN_3}}": "Patrón común 3",
                "{{REFERENCE_1_URL}}": "https://example.com/reference1",
                "{{REFERENCE_2_URL}}": "https://example.com/reference2",
                "{{REFERENCE_3_URL}}": "https://example.com/reference3"
            }
            
            for placeholder, value in replacements.items():
                content = content.replace(placeholder, value)
            
            refs_dir = output_dir / "references"
            refs_dir.mkdir(exist_ok=True)
            domain_file = refs_dir / "domain.md"
            domain_file.write_text(content, encoding='utf-8')
            print(f"  ✓ references/domain.md creado")
    
    def generate_initial_adr(self, output_dir: Path):
        """Generate initial ADR"""
        adr_template = self.templates_dir / "skill_skeleton" / "adrs" / "0001-initial-design.md.template"
        if not adr_template.exists():
            print(f"Warning: ADR template not found at {adr_template}")
            return
        
        template_content = adr_template.read_text(encoding='utf-8')
        skill_name = self.interview_state["skill_name"]
        
        content = template_content
        replacements = {
            "{{ADR_NUMBER}}": "0001",
            "{{ADR_TITLE}}": f"Initial-Design-{skill_name}",
            "{{STATUS}}": "Accepted",
            "{{CONTEXT}}": f"Se está creando la skill {skill_name} mediante el proceso de entrevista interactiva",
            "{{DECISION}}": "Usar el enfoque de entrevista interactiva para diseñar y crear la skill",
            "{{#POSITIVE_CONSEQUENCES}}\n- {{.}}\n{{/POSITIVE_CONSEQUENCES}}": "- Diseño centrado en las necesidades reales del usuario\n- Reducción de riesgos de建设错方向\n- Mejor comprensión del problema antes de construir",
            "{{#NEGATIVE_CONSEQUENCES}}\n- {{.}}\n{{/NEGATIVE_CONSEQUENCES}}": "- Requiere más tiempo inicial en la fase de descubrimiento\n- Dependencia de la disponibilidad y claridad del usuario durante la entrevista"
        }
        
        for placeholder, value in replacements.items():
            content = content.replace(placeholder, value)
        
        # Handle list sections
        content = content.replace("{{#POSITIVE_CONSEQUENCES}}\n- {{.}}\n{{/POSITIVE_CONSEQUENCES}}", 
                                 "- Diseño centrado en las necesidades reales del usuario\n- Reducción de riesgos de construir en la dirección equivocada\n- Mejor comprensión del problema antes de construir")
        content = content.replace("{{#NEGATIVE_CONSEQUENCES}}\n- {{.}}\n{{/NEGATIVE_CONSEQUENCES}}", 
                                 "- Requiere más tiempo inicial en la fase de descubrimiento\n- Dependencia de la disponibilidad y claridad del usuario durante la entrevista")
        
        adrs_dir = output_dir / "adrs"
        adrs_dir.mkdir(exist_ok=True)
        adr_file = adrs_dir / "0001-initial-design.md"
        adr_file.write_text(content, encoding='utf-8')
        print(f"  ✓ adrs/0001-initial-design.md creado")
    
    def generate_basic_assets(self, output_dir: Path):
        """Generate basic placeholder assets"""
        assets_dir = output_dir / "assets"
        assets_dir.mkdir(exist_ok=True)
        
        readme_file = assets_dir / "README.md"
        readme_file.write_text(
            f"# Assets for {self.interview_state['skill_name'].replace('-', ' ').title()}\n\n"
            f"Place icons, styles, templates, and other static assets here as needed for the "
            f"{self.interview_state['skill_name']} skill.\n",
            encoding='utf-8'
        )
        print(f"  ✓ assets/README.md creado")
    
    def run_interview(self) -> bool:
        """Run the complete interview process"""
        print("🎙️  Bienvenido al creador interactivo de skills")
        print("Esta herramienta te guiará através de una conversación para crear una nueva skill")
        
        try:
            if not self.run_discovery_phase():
                return False
            
            if not self.run_design_phase():
                return False
                
            if not self.run_research_phase():
                return False
                
            if not self.run_naming_phase():
                return False
                
            if not self.run_generation_phase():
                return False
            
            print("\n" + "="*60)
            print("🎉 ENTREVISTA COMPLETADA EXITOSAMENTE")
            print("="*60)
            print(f"Tu skill '{self.interview_state['skill_name']}' ha sido creada.")
            print(f"Ubicación: {self.output_dir / self.interview_state['skill_name']}")
            print("\nRevisa los archivos generados y personalízalos según necesites.")
            return True
            
        except KeyboardInterrupt:
            print("\n\nEntrevista interrumpida por el usuario.")
            return False
        except Exception as e:
            print(f"\nError durante la entrevista: {e}")
            return False


def main():
    parser = argparse.ArgumentParser(
        description="Herramienta interactiva para crear nuevas skills mediante entrevista conversacional"
    )
    parser.add_argument(
        '--output-dir',
        '--directorio-salida',
        type=str,
        default='./skills',
        help='Directorio donde crear la skill (default: ./skills)'
    )
    parser.add_argument(
        '--non-interactive',
        '--no-interactivo',
        action='store_true',
        help='Ejecutar en modo no interactivo (para testing o CI)'
    )
    parser.add_argument(
        '--demo', 
        action='store_true',
        help='Ejecutar una demostración con respuestas predefinidas'
    )
    
    args = parser.parse_args()
    
    if args.demo:
        # Run a demo with predefined responses
        print("Modo demostración no implementado aún")
        return 1
    
    creator = SkillCreatorInterview(
        output_dir=args.output_dir,
        non_interactive=args.non_interactive
    )
    
    success = creator.run_interview()
    return 0 if success else 1


if __name__ == "__main__":
    sys.exit(main())
