# Plan: Rediseño interactivo de `skill-creator`

## Objetivo
Transformar `skill-creator` de guía estática a **herramienta interactiva de entrevista y diseño colaborativo** que:
- Entrevista al usuario para entender qué skill quiere crear
- Propone, sugiere y refina funcionalidades basándose en la conversación
- Investiga (agente + scripts) para complementar el diseño
- Sugiere nombres para la nueva skill
- Genera skill completa: `SKILL.md`, `scripts/`, `references/`, `assets/`, ADRs, validación
- Mantiene compatibilidad con scripts actuales (`init_skill.py`, `package_skill.py`)

---

## Arquitectura del flujo

### Fase 1: Entrevista conversacional (modo chat)
Protocolo documentado en `SKILL.md` que el agente sigue:
1. **Descubrimiento** → Entender problema, casos de uso, ejemplos concretos
2. **Diseño colaborativo** → Proponer arquitectura, recursos, flujos; iterar con usuario
3. **Investigación asistida** → Agent search/web + scripts para validar/enriquecer
4. **Nombrado** → Sugerir 3-5 nombres; usuario elige o propone
5. **Generación** → Crear estructura completa + `SKILL.md` listo para usar

### Fase 2: Script opcional `interview_skill.py` (terminal)
Mismo flujo pero automatizado para uso no-interactivo/CI.

---

## Entregables a crear/modificar

### 1. `SKILL.md` (reescrito completamente)
- **Nueva sección**: "Modo Entrevista Interactiva" con protocolo paso a paso
- **Preguntas canónicas** por fase (descubrimiento, diseño, investigación, nombrado)
- **Plantillas de propuesta** (arquitectura, recursos, flujos)
- **Guía de estilo** para propuestas del agente (imperativo, específicas, accionables)
- **Mantenimiento**: Sección "Modo Tradicional" para scripts existentes

### 2. `scripts/interview_skill.py` (NUEVO)
```python
# CLI interactivo que ejecuta el protocolo de entrevista
# Uso: python interview_skill.py [--output-dir ./skills] [--non-interactive]
# Flujo:
#   1. Preguntas de descubrimiento (input usuario)
#   2. Genera propuestas basadas en respuestas + heurísticas
#   3. Usuario acepta/modifica/rechaza propuestas
#   4. Investigación opcional (llamadas a web search, GitHub API, etc.)
#   5. Sugerencia de nombres (algoritmo: palabras clave + sufijos comunes)
#   6. Genera estructura completa en output-dir/
#   7. Ejecuta validación automática
```

### 3. `scripts/research_helpers.py` (NUEVO)
Módulo con funciones de investigación reutilizables:
- `search_github_patterns(query)` → Patrones en skills existentes
- `search_web_best_practices(topic)` → Buenas prácticas actuales
- `analyze_existing_skills(directory)` → Análisis de skills locales
- `suggest_skill_name(keywords, category)` → Algoritmo de命名

### 4. `scripts/init_skill.py` (ACTUALIZADO)
- Nuevo flag `--from-interview <json-file>` para consumir salida de entrevista
- Genera estructura más completa (incluye ADRs, templates de tests)
- Valida que `SKILL.md` tenga secciones requeridas por nuevo estándar

### 5. `scripts/package_skill.py` (ACTUALIZADO)
- Validaciones extendidas: entrevista completa, ADRs presentes, tests template
- Nuevo check: `SKILL.md` incluye sección "Cómo se creó esta skill" (trazabilidad)

### 6. `templates/` (NUEVO directorio)
```
templates/
├── skill_skeleton/           # Estructura base generada
│   ├── SKILL.md.template     # Con placeholders {{NAME}}, {{DESCRIPTION}}, etc.
│   ├── scripts/
│   │   └── main.py.template  # Script base con logging, args, error handling
│   ├── references/
│   │   └── domain.md.template
│   ├── assets/
│   └── adrs/
│       └── 0001-initial-design.md.template
├── interview_questions.yaml  # Banco de preguntas por fase/categoría
└── proposal_templates.yaml   # Plantillas de propuestas del agente
```

### 7. `references/skill_design_principles.md` (NUEVO)
Documento de referencia cargado bajo demanda:
- Principios de diseño de skills efectivas
- Patrones comunes (workflow, integración, dominio, utilidad)
- Anti-patrones a evitar
- Checklist de calidad

### 8. ADR inicial generado por la propia skill
`adrs/0001-interactive-interview-redesign.md` documentando:
- Decisión: entrevista conversacional + script opcional
- Alternativas consideradas
- Consecuencias

---

## Flujo detallado de la entrevista (protocolo en SKILL.md)

### Paso 1: Descubrimiento (5-7 preguntas)
| Pregunta | Propósito |
|----------|-----------|
| "¿Qué problema resuelve la skill?" | Propósito central |
| "Dame 3 ejemplos concretos de cómo un usuario la invocaría" | Casos de uso reales |
| "¿Qué dominio/área cubre?" | Categorización |
| "¿Qué inputs recibe y qué outputs produce?" | Interfaz |
| "¿Hay skills existentes similares?" | Evitar duplicación |
| "¿Qué conocimientos especializados necesita?" | Referencias requeridas |

### Paso 2: Diseño colaborativo (iterativo)
Agente propone → Usuario refina:
- **Arquitectura sugerida**: "Basado en tus respuestas, propongo: workflow multi-paso con scripts X, referencias Y, assets Z"
- **Recursos propuestos**: Lista concreta de scripts/references/assets con justificación
- **Flujos de trabajo**: Secuencia de pasos que la skill guiará

### Paso 3: Investigación asistida (bajo demanda)
- Agent: `web_search("best practices for X skill design")`
- Script: `python research_helpers.py --topic "X" --output research.json`
- Resultados integrados en propuestas

### Paso 4: Nombrado
Algoritmo: `keywords + category + suffixes` → 5 sugerencias
Usuario: elige, modifica, o propone propio

### Paso 5: Generación final
- Escribe `SKILL.md` completo con todas las secciones
- Crea `scripts/`, `references/`, `assets/` con código base
- Genera `adrs/0001-initial-design.md`
- Ejecuta `quick_validate.py` y `package_skill.py --dry-run`

---

## Criterios de validación (Definition of Done)

1. **Entrevista completa**: Usuario puede crear skill end-to-end solo conversando
2. **Script funcional**: `interview_skill.py` produce skill válida en modo no-interactivo
3. **Compatibilidad**: `init_skill.py` y `package_skill.py` siguen funcionando sin cambios
4. **Documentación**: `SKILL.md` explica ambos modos claramente
5. **Calidad generada**: Skills creadas pasan `package_skill.py` sin errores
6. **Trazabilidad**: Cada skill generada incluye ADR de su diseño

---

## Riesgos y mitigaciones

| Riesgo | Mitigación |
|--------|------------|
| Entrevista muy larga/abrumadora | Preguntas opcionales, saltos inteligentes, resumen progresivo |
| Propuestas del agente genéricas | Banco de plantillas por categoría + learning from existing skills |
| Investigación poco fiable | Validación humana obligatoria antes de integrar |
| Nombres sugeridos inadecuados | Usuario siempre tiene última palabra; algoritmo solo sugiere |
| Complejidad de mantenimiento | Separación clara: protocolo (SKILL.md) vs implementación (scripts) |

---

## Orden de implementación sugerido

1. **Diseñar banco de preguntas y plantillas** (`templates/interview_questions.yaml`, `proposal_templates.yaml`)
2. **Escribir `interview_skill.py`** con flujo básico (sin investigación)
3. **Crear `research_helpers.py`** con funciones básicas
4. **Integrar investigación en `interview_skill.py`**
5. **Actualizar `init_skill.py`** para consumir JSON de entrevista
6. **Reescribir `SKILL.md`** con protocolo completo + modo tradicional
7. **Crear `templates/skill_skeleton/`** y `references/skill_design_principles.md`
8. **Actualizar `package_skill.py`** con validaciones nuevas
9. **Auto-ejecutar**: Usar el nuevo `skill-creator` para crear su propia ADR inicial
10. **Testing**: Crear 2-3 skills de prueba usando ambos modos

---

## Preguntas abiertas para resolver antes de implementar

1. **¿Dónde vivirá el estado de la entrevista?** ¿Archivo JSON temporal en `.scratch/`? ¿En memoria durante chat?
2. **¿Nivel de detalle en propuestas de código?** ¿Solo signatures + docstrings? ¿Implementaciones completas para patrones comunes?
3. **¿Integración con `websearch` tool del agente?** ¿Llamadas directas desde `interview_skill.py` via subprocess?
4. **¿Versionado de plantillas?** ¿`templates/` versionado junto con skill-creator?
5. **¿Manejo de habilidades multi-idioma?** ¿El `SKILL.md` generado solo en español/inglés según entrevista?

---

## Próximo paso recomendado
Resolver **Pregunta 1** (estado de entrevista) y **Pregunta 2** (nivel de detalle en código propuesto) para definir estructura de datos y templates base.