#!/usr/bin/env python3
"""
Skill initialization tool
Creates skill structure from scratch or from interview results
"""

import argparse
import json
import os
import sys
from pathlib import Path
from typing import Dict, Any, Optional
import shutil

def load_interview_results(json_file: str) -> Dict[str, Any]:
    """Load skill data from interview results JSON file"""
    try:
        with open(json_file, 'r', encoding='utf-8') as f:
            return json.load(f)
    except FileNotFoundError:
        print(f"Error: Interview results file '{json_file}' not found")
        sys.exit(1)
    except json.JSONDecodeError as e:
        print(f"Error: Invalid JSON in '{json_file}': {e}")
        sys.exit(1)

def validate_skill_md_sections(skill_md_path: Path) -> bool:
    """Validate that SKILL.md has required sections according to new standard"""
    try:
        content = skill_md_path.read_text(encoding='utf-8')
    except FileNotFoundError:
        print(f"Error: SKILL.md not found at {skill_md_path}")
        return False
    
    # Check for required sections in the new standard
    required_sections = [
        "## Operating Contract",
        "# ",  # Skill title (will be more specific)
        "## Contract",
        "## Structured Skill Creation Process",
        "## Skill Template Structure",
        "## Worksheet Templates and Examples",
        "## Integration with Evaluation System",
        "## Completion Criteria",
        "## Guardrails"
    ]
    
    missing_sections = []
    for section in required_sections:
        if section not in content:
            missing_sections.append(section)
    
    if missing_sections:
        print("Warning: SKILL.md is missing recommended sections:")
        for section in missing_sections:
            print(f"  - {section}")
        return False
    
    return True

def create_skill_structure(skill_name: str, output_dir: Path, 
                          interview_data: Optional[Dict[str, Any]] = None):
    """Create the basic skill directory structure"""
    skill_path = output_dir / skill_name
    
    # Remove existing skill directory if it exists
    if skill_path.exists():
        print(f"Warning: Skill directory '{skill_path}' already exists. Removing...")
        shutil.rmtree(skill_path)
    
    # Create directory structure
    skill_path.mkdir(parents=True)
    (skill_path / "scripts").mkdir()
    (skill_path / "references").mkdir()
    (skill_path / "assets").mkdir()
    (skill_path / "adrs").mkdir()
    
    print(f"Created skill structure in: {skill_path}")
    
    # Generate SKILL.md
    create_skill_md(skill_path, skill_name, interview_data)
    
    # Generate basic script
    create_basic_script(skill_path / "scripts", skill_name)
    
    # Generate reference files
    create_reference_files(skill_path / "references", skill_name)
    
    # Generate initial ADR
    create_initial_adr(skill_path / "adrs", skill_name)
    
    # Generate basic assets
    create_basic_assets(skill_path / "assets", skill_name)
    
    return skill_path

def create_skill_md(skill_path: Path, skill_name: str, 
                   interview_data: Optional[Dict[str, Any]] = None):
    """Generate SKILL.md file"""
    # Determine skill description and other metadata
    if interview_data and "skill_data" in interview_data:
        data = interview_data["skill_data"]
        description = data.get("description", f"A skill for {skill_name}")
        category = data.get("category", "general")
        version = data.get("version", "1")
        maturity = data.get("maturity", "experimental")
        capabilities = data.get("capabilities", [])
        outputs = data.get("outputs", [])
        risk = data.get("risk", "low")
        trust_tier = data.get("trust_tier", "2")
        max_iterations = data.get("max_iterations", "5")
        stop_condition = data.get("stop_condition", "Skill completed successfully")
    else:
        # Default values
        description = f"A skill for {skill_name}"
        category = "general"
        version = "1"
        maturity = "experimental"
        capabilities = ["process-input", "generate-output"]
        outputs = ["result", "status"]
        risk = "low"
        trust_tier = "2"
        max_iterations = "5"
        stop_condition = "Skill completed successfully"
    
    # Format capabilities and outputs for YAML
    capabilities_yaml = "\n".join([f"  - {cap}" for cap in capabilities])
    outputs_yaml = "\n".join([f"  - {out}" for out in outputs])
    
    skill_md_content = f"""---
name: {skill_name}
category: {category}
maturity: {maturity}
version: {version}
description: {description}
capabilities:
{capabilities_yaml}
outputs:
{outputs_yaml}
sideEffects: []
dependencies: []
stopCondition: {stop_condition}
risk: {risk}
trustTier: {trust_tier}
maxIterations: {max_iterations}
---

## Operating Contract

- **Input:** Inputs específicos para la skill {skill_name}
- **Output:** Outputs específicos de la skill {skill_name}
- **Side effects:** follow the frontmatter declaration; do not broaden scope without explicit user direction.
- **Dependencies:** declared dependencies, referenced skills, and source materials required by the task.
- **Stop condition:** {stop_condition} is complete, evidence is captured, and completion criteria are checked.
- **Risk:** use the frontmatter risk classification and call out any escalation.
- **Boundary:** stay within the skill's declared scope, trust tier, and side-effect policy.

#{skill_name.replace('-', ' ').title()}

{description}

## Contract

- Input: Entradas específicas para procesar con esta skill
- Output: Resultados procesados y/o generados por esta skill
- Scope: Creación y uso de skills específicas para el ecosistema quirk
- Rule: Las skills generadas deben ser compatibles con el método quirk
- Rule: Las skills deben seguir el principio de divulgación progresiva y diseño de contrato explícito
- Rule: Las skills deben ser testeables usando el sistema evaluate-skill

## Structured Skill Creation Process

Esta skill te guía a través de la creación de una skill utilizando worksheets estructurados que aseguran abordar todos los aspectos críticos del diseño de skills.

### Fase 1: Skill Conception Worksheet

Complete esta worksheet para explorar y validar su concepto de skill.

#### Worksheet 1.1: Core Concept Definition
```
Skill Name (propuesta): ________________________________
Descripción en una oración: ________________________________________________________
________________________________________________________

¿Qué problema específico resuelve esta skill? _______________________________________
________________________________________________________

¿Esta es una nueva capacidad o mejora a una existente? [ ] Nueva  [ ] Mejora
Si es mejora, ¿qué skill(s) existente(s) se relaciona con ella? ________________________
________________________________________________________
```

#### Worksheet 1.2: Use Case Validation
```
Liste 3 casos de uso concretos donde esta skill sería valiosa:
1. _________________________________________________________
2. _________________________________________________________
3. _________________________________________________________

¿Quiénes son los usuarios principales/tipos de agentes que se beneficiarían?
_________________________________________________________

¿Qué pasaría si esta skill no existiera? (Describa la complejidad del workaround)
_________________________________________________________
_________________________________________________________

¿Cómo sabe que esto aborda un comportamiento repetidamente útil?
_________________________________________________________
```

#### Worksheet 1.3: Capability Definition
```
Liste las capacidades específicas que esta skill proporcionará (use formato - capability-name):
- _________________________________________________
- _________________________________________________
- _________________________________________________

Para cada capability, especifique:
Capability: ________________________
  Entradas requeridas: ________________________________________
  Salidas producidas: _______________________________________

Capability: ________________________
  Entradas requeridas: ________________________________________
  Salidas producidas: _______________________________________
```

### Fase 2: Skill Design Worksheets

#### Worksheet 2.1: Skill Contract Design
```
Descripción (siguiendo la guía de estilo de skills quirk):
_________________________________________________________
_________________________________________________________
_________________________________________________________

Entradas explícitas (qué consume la skill):
- ________________________________________
- ________________________________________
- ________________________________________

Salidas explícitas (qué produce la skill):
- ________________________________________
- ________________________________________
- ________________________________________

Dependencias (mínimas e intencionales):
- ________________________________________ (por qué: ____________________)
- ________________________________________ (por qué: ____________________)

Efectos secundarios (modificaciones honnestas al repositorio):
- ________________________________________
- ________________________________________

Condición de parada (criterios de finalización claros y verificables):
_________________________________________________________
_________________________________________________________

Nivel de riesgo (evaluación honnesta): [ ] bajo  [ ] medio  [ ] alto
Justificación: ___________________________________________
```

#### Worksheet 2.2: Skill Body Structure Plan
```
Enfoque: [ ] basado en pasos  [ ] basado en referencias  [ ] híbrido

¿Qué va en SKILL.md (instrucciones procedimentales esenciales):
_________________________________________________________
_________________________________________________________

¿Qué va en references/ (material de referencia detallado):
_________________________________________________________
_________________________________________________________

¿Cómo se integra esta skill con el sistema de elementos de trabajo (si es relevante):
_________________________________________________________
_________________________________________________________
```

#### Worksheet 2.3: Evaluatability Design Plan
```
¿Cómo se probará esta skill con el sistema evaluate-skill?

Fixturas de escenario necesarias (describir rutas esperadas):
_________________________________________________________
_________________________________________________________

Fixturas de comportamiento necesarias (formatos de salida esperados):
_________________________________________________________
_________________________________________________________
```

### Fase 3: Skill Generation and Validation

#### Worksheet 3.1: Skill Generation
```
Siga estos pasos para generar su skill:
1. Cree un directorio: .skill-sandbox/<nombre-de-su-skill>/
2. Cree SKILL.md con el YAML frontmatter adecuado de la Worksheet 2.1
3. Cree el directorio references/ y añada cualquier plantilla necesaria
4. Configure los directorios básicos scripts/ y assets/ si es necesario
5. Añade comentarios TODO útiles que guíen la completación

Use las plantillas en las references/ de esta skill como puntos de partida.
```

#### Worksheet 3.2: Validation Integration
```
Cree artefactos de validación para su skill:

Fixturas de escenario (en .skill-sandbox/<nombre-de-skill>/scenarios/):
- [ ] Escenario de prueba de funcionalidad básica
- [ ] Escenario de caso límite  
- [ ] Escenario de condición de error

Fixturas de comportamiento (en .skill-sandbox/<nombre-de-skill>/behavioral-fixtures/):
- [ ] Formato de salida esperado para el artefacto principal
- [ ] Formato de salida esperado para el artefacto secundario (si aplica)

Ejecute la validación:
- node .skill-sandbox/validations/validate-sandbox-skills.mjs
- node .agents/skills/platform/evaluate-scenarios.mjs (cuando las fixturas estén listas)
- node .agents/skills/platform/evaluate-behavioral-fixtures.mjs (cuando las fixturas estén listas)
```

## Skill Template Structure

Al generar una nueva skill usando las worksheets, se produce esta estructura:

```
.skill-sandbox/<nombre-de-skill>/
├── SKILL.md
├── references/
│   ├── [plantillas-de-artefactos-segun-necesidad]
│   └── [ejemplos-de-salidas-segun-necesidad]
├── scripts/
│   └── [scripts-de-ayuda-segun-necesidad]
└── assets/
    └── [activos-de-salida-segun-necesidad]
```

## Worksheet Templates and Examples

Esta skill proporciona plantillas y ejemplos para ayudarle a completar las worksheets efectivamente.

### Ejemplo: Worksheet 1.1 completado (para una skill hipotética "ejemplo-versionador")
```
Nombre de la skill (propuesta): ejemplo-versionador
Descripción en una oración: Analiza cambios en APIs para recomendar estrategias de versionamiento apropiadas basadas en principios de versionado semántico.

¿Qué problema específico resuelve esta skill? Ayuda a desarrolladores a determinar cuándo hacer cambios que rompen compatibilidad vs cambios compatibles hacia atrás en APIs mediante el análisis de diferencias y la provisión de recomendaciones explícitas de versionamiento.

¿Esta es una nueva capacidad o mejora a una existente? [x] Nueva  [ ] Mejora
Si es mejora, ¿qué skill(s) existente(s) se relaciona con ella? N/A
```

### Ejemplo: Worksheet 2.1 completado (para la misma skill)
```
Descripción (siguiendo la guía de estilo de skills quirk):
Esta skill analiza diferencias en APIs para determinar el estrategia de versionamiento apropiada siguiendo principios de versionado semántico. Úsela cuando necesite comprender el impacto de los cambios en API y obtener orientación explícita sobre números de version.

Entradas explícitas (qué consume la skill):
- Diferencia de API o descripción de cambios
- Versión actual de la API
- Documentación de pautas para cambios que rompen compatibilidad

Salidas explícitas (qué produce la skill):
- Número de version recomendado (mayor/menor/revisión)
- Lista de cambios que rompen compatibilidad detectados
- Lista de cambios compatibles hacia atrás
- Explicación de la razón del versionamiento

Dependencias (mínimas e intencionales):
- codebase-design (por qué: para comprender las costuras e interfaces de la API)
- domain-modeling (por qué: para usar la terminología de dominio correcta en las explicaciones)

Efectos secundarios (modificaciones honnestas al repositorio):
- write-docs (crea documento de recomendación de versionamiento)

Condición de parada (criterios de finalización claros y verificables):
El usuario ha recibido una recomendación específica de versionamiento con una explicación clara de qué cambios son rompiendo vs compatibles, y comprende las implicaciones del versionado semántico.

Nivel de riesgo (evaluación honnesta): [x] bajo  [ ] medio  [ ] alto
Justificación: Esta skill solo lee código y escribe documentación - no hay modificaciones al repositorio que puedan causar daño.
```

## Integración con el Sistema de Evaluación

Todas las skills creadas con este creador deberían diseñarse para funcionar con el sistema evaluate-skill:

### Fixturas de Escenario
- Cree archivos JSON de escenario que definan rutas esperadas a través de skills para tareas comunes
- Incluya aserciones estáticas para validar que la skill produzca resultados correctos
- Siga el formato usado en evaluate-skill/scenarios/

### Fixturas de Comportamiento
- Cree archivos markdown que definan los formatos de salida esperados para los artefactos de la skill
- Incluya secciones requeridas (recomendación, razonamiento, análisis de cambios) y prohíba texto de marcador de posición
- Siga el formato usado en evaluate-skill/behavioral-fixtures/

## Criterios de Completación

El usuario ha completado esta skill cuando:

- Ha completado todas las worksheets con información específica y accionable
- Ha generado una plantilla completa de skill en el sandbox desde sus worksheets completadas
- Ha validado el concepto de skill utilizando las herramientas de validación del sandbox
- Ha delineado cómo la skill se integra con el sistema de evaluación
- Tiene un plan claro para iterar sobre la skill basado en los comentarios de validación

## Guardianas (Guardrails)

- Siempre valide los conceptos de skill contra skills existentes para prevenir duplicación
- Diseñe skills para que sean mínimas y enfocadas - prefiera crear múltiples skills pequeñas sobre una grande
- Asegúrese de que las skills puedan ser testeadas en aislamiento usando el entorno de sandbox
- Siga los principios del método quirk rigurosamente en el diseño de skills
- Considere cómo la skill encaja en flujos de trabajo más grandes antes de crearla
- Recuerde que la predecibilidad es la virtud raíz - diseña para comportamiento consistente
- Use las worksheets para asegurar decisiones explícitas y verificables en cada paso
"""
    
    (skill_path / "SKILL.md").write_text(skill_md_content, encoding='utf-8')
    print(f"  ✓ SKILL.md creado")

    """Main entry point for the skill."""
def create_basic_script(scripts_dir: Path, skill_name: str):
    """Generate basic script file"""
    skill_title = skill_name.replace("-", " ").title()
    script_content = f'''#!/usr/bin/env python3

\"\"\"{skill_title} - A skill for {skill_name}\"\"\"

import argparse
import logging
import sys
from pathlib import Path

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

def main():
    """Main entry point for the skill."""
    parser = argparse.ArgumentParser(
        description=f"{skill_title} - A skill for {skill_name}"
    )
    parser.add_argument(
        '--version', 
        action='version', 
        version='1.0.0'
    )
    # Add skill-specific arguments here
    parser.add_argument(
        '--input', 
        type=str, 
        help='Input for the skill processing'
    )
    parser.add_argument(
        '--output', 
        type=str, 
        help='Output file or directory'
    )
    
    args = parser.parse_args()
    
    try:
        logger.info("Starting {skill_name}")
        # TODO: Implement skill logic here
        if args.input:
            logger.info(f"Processing input: {{args.input}}")
        if args.output:
            logger.info(f"Writing output to: {{args.output}}")
        logger.info("Skill execution completed successfully")
        return 0
    except Exception as e:
        logger.error(f"Error executing {{skill_name}}: {{e}}")
        return 1

'''
    
    main_script = scripts_dir / "main.py"
    main_script.write_text(script_content, encoding='utf-8')
    # Make executable
    main_script.chmod(0o755)
    print(f"  ✓ scripts/main.py creado")



def create_reference_files(refs_dir: Path, skill_name: str):
    """Generate reference files"""
    refs_dir.mkdir(exist_ok=True)
    
    # Generate domain.md
    domain_content = f"""# Dominio para {skill_name.replace('-', ' ').title()}

## Visión General
Este documento proporciona conocimiento de dominio específico y referencias para la skill {skill_name}.

## Conceptos Clave
- Concepto principal del dominio {skill_name}
- Segundo concepto importante relacionado con {skill_name}
- Tercer concepto relevante para aplicaciones prácticas

## Mejores Prácticas
- Mejor práctica 1 para trabajar con {skill_name}
- Mejor práctica 2 para asegurar calidad en {skill_name}
- Mejor práctica 3 para mantenimiento y escalabilidad

## Patrones Comunes
- Patrón de diseño 1 comúnmente usado en {skill_name}
- Patrón de integración 2 para conectar con otros sistemas
- Patrón de manejo de errores 3 para robustez

## Referencias
- [Referencia 1: Guía oficial](https://example.com/official-guide)
- [Referencia 2: Tutorial práctico](https://example.com/practical-tutorial)
- [Referencia 3: Mejores prácticas de la industria](https://example.com/industry-best-practices)
"""
    
    (refs_dir / "domain.md").write_text(domain_content, encoding='utf-8')
    print(f"  ✓ references/domain.md creado")

def create_initial_adr(adrs_dir: Path, skill_name: str):
    """Generate initial ADR"""
    adrs_dir.mkdir(exist_ok=True)
    
    adr_content = f"""# 0001-Initial-Design-{skill_name.replace('-', '_')}

## Status
Accepted

## Context
Se está creando la skill {skill_name} como parte del proceso de inicialización de skills.
Se necesita establecer las decisiones de diseño iniciales que guiarán el desarrollo de esta skill.

## Decision
Usar una estructura básica de skill con:
- SKILL.md con formato YAML estándar
- Directorio scripts/ para lógica de ejecución
- Directorio references/ para documentación de dominio
- Directorio assets/ para recursos estáticos
- Directorio adrs/ para registro de decisiones de arquitectura

## Consecuencias

### Positivas
- Estructura clara y consistente con otras skills en el ecosistema
- Fácil de entender y mantener para nuevos contribuyentes
- Separación clara de responsabilidades entre componentes
- Cumple con los estándares del método quirk

### Negativas
- Puede ser más estructurado de lo necesario para skills muy simples
- Requiere crear múltiples directorios incluso para functionality mínima
- Sobrecarga inicial de setup para skills de propósito único
"""
    
    (adrs_dir / "0001-initial-design.md").write_text(adr_content, encoding='utf-8')
    print(f"  ✓ adrs/0001-initial-design.md creado")

def create_basic_assets(assets_dir: Path, skill_name: str):
    """Generate basic placeholder assets"""
    assets_dir.mkdir(exist_ok=True)
    
    # Create a basic README or placeholder
    placeholder_file = assets_dir / "README.md"
    placeholder_file.write_text(
        f"# Assets for {skill_name.replace('-', ' ').title()}\n\n"
        f"Place icons, styles, templates, and other static assets here as needed for the {skill_name} skill.\n\n"
        f"## Suggested Structure\n\n"
        f"- `icons/` - SVG/PNG icons for visual outputs\n"
        f"- `styles/` - CSS or styling resources\n"
        f"- `templates/` - File templates for generated outputs\n"
        f"- `examples/` - Sample inputs and expected outputs\n",
        encoding='utf-8'
    )
    print(f"  ✓ assets/README.md creado")

def main():
    parser = argparse.ArgumentParser(
        description="Inicializa una nueva skill desde cero o desde resultados de entrevista"
    )
    parser.add_argument(
        'skill_name',
        type=str,
        help='Nombre de la skill a crear'
    )
    parser.add_argument(
        '--output-dir',
        '--directorio-salida',
        type=str,
        default='./skills',
        help='Directorio donde crear la skill (default: ./skills)'
    )
    parser.add_argument(
        '--from-interview',
        '--desde-entrevista',
        type=str,
        help='Archivo JSON con resultados de entrevista para usar como entrada'
    )
    parser.add_argument(
        '--validate-only',
        action='store_true',
        help='Solo validar una skill existente sin crear nada'
    )
    
    args = parser.parse_args()
    
    output_dir = Path(args.output_dir)
    output_dir.mkdir(parents=True, exist_ok=True)
    
    if args.validate_only:
        # Validate existing skill
        skill_path = output_dir / args.skill_name
        if not skill_path.exists():
            print(f"Error: Skill directory '{skill_path}' does not exist")
            sys.exit(1)
        
        skill_md_path = skill_path / "SKILL.md"
        if not skill_md_path.exists():
            print(f"Error: SKILL.md not found in '{skill_path}'")
            sys.exit(1)
        
        print(f"Validating skill: {args.skill_name}")
        is_valid = validate_skill_md_sections(skill_md_path)
        
        if is_valid:
            print(f"✓ Skill '{args.skill_name}' passes validation")
            sys.exit(0)
        else:
            print(f"✗ Skill '{args.skill_name}' has validation issues")
            sys.exit(1)
    
    # Load interview data if provided
    interview_data = None
    if args.from_interview:
        print(f"Loading interview results from: {args.from_interview}")
        interview_data = load_interview_results(args.from_interview)
    
    # Create the skill
    try:
        skill_path = create_skill_structure(
            args.skill_name, 
            output_dir, 
            interview_data
        )
        
        print(f"\n✓ Skill '{args.skill_name}' creada exitosamente en: {skill_path}")
        print("\nPróximos pasos:")
        print(f"  1. Revisa y personaliza el SKILL.md generado")
        print(f"  2. Implementa la lógica en {skill_path}/scripts/main.py")
        print(f"  3. Agrega documentación específica en {skill_path}/references/")
        print(f"  4. Prueba tu skill con: python {skill_path}/scripts/main.py --help")
        
    except Exception as e:
        print(f"Error creating skill: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
