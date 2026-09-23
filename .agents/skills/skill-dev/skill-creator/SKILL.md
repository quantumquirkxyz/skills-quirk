---
name: skill-creator
category: skill-dev
maturity: estable
version: 4
description: Transformado de guía estática a herramienta interactiva de entrevista y diseño colaborativo que entrevista a los usuarios para entender qué skill quieren crear, propone y refina funcionalidades, investiga para complementar el diseño, sugiere nombres y genera skills completas con SKILL.md, scripts/, references/, assets/, ADRs y validación
capabilities:
  - realizar entrevista interactiva de creación de skill
  - proponer arquitecturas y recursos de skill basados en la entrada del usuario
  - realizar investigación asistida para enriquecer el diseño de la skill
  - sugerir nombres de skill basados en palabras clave y categoría
  - generar estructura completa de skill desde los resultados de la entrevista
  - validar skills contra estándares de calidad
  - mantener compatibilidad con los scripts existentes init_skill.py y package_skill.py
outputs:
  - Artefacto de creador de skill interactivo con hallazgos de entrevista, propuestas de diseño, resultados de investigación y skill generada
  - Estructura completa de skill lista para usar
  - Informe de validación y verificación de criterios de completado
sideEffects: []
dependencies: []
stopCondition: El usuario ha completado la entrevista interactiva y generado una estructura de skill válida, o ha validado una skill existente usando métodos tradicionales
risk: low
trustTier: 1
maxIterations: 10
---

## Contrato de Operación

- **Entrada:** Solicitud de creación de skill, respuestas del usuario durante la entrevista, archivo opcional de resultados de entrevista, parámetros de validación
- **Salida:** Artefacto de creación interactiva de skill o resultados de validación
- **Efectos secundarios:** seguir la declaración del frontmatter; no ampliar el alcance sin dirección explícita del usuario.
- **Dependencias:** dependencias declaradas, habilidades referenciadas y materiales de origen requeridos por la tarea.
- **Condición de parada:** El usuario ha completado la entrevista interactiva y generado una estructura de skill válida, o ha validado una skill existente usando métodos tradicionales.
- **Riesgo:** use la clasificación de riesgo del frontmatter y señale cualquier escalada.
- **Límite:** manténgase dentro del alcance declarado de la skill, el nivel de confianza y la política de efectos secundarios.

# Creador Interactivo de Skills para quirk Skills

Esta skill ha sido transformada de una guía estática basada en worksheets en una **herramienta de entrevista interactiva y diseño colaborativo** que guía a los usuarios a través de la creación de nuevas skills mediante conversación. Soporta tanto el modo interactivo (basado en chat) como el modo no interactivo (basado en script) para flexibilidad en diferentes contextos de uso.

## 🆕 Nuevo: Modo de Entrevista Interactiva

La skill ahora cuenta con un protocolo de entrevista conversacional que:

1. **Descubre** las necesidades de skill del usuario a través de preguntas específicas
2. **Diseña colaborativamente** la arquitectura y los recursos de la skill
3. **Realiza investigación asistida** para enriquecer el diseño con las mejores prácticas actuales
4. **Sugiere nombres apropiados** basados en palabras clave y categoría
5. **Genera una estructura completa de skill** con todos los archivos necesarios
6. **Valida el resultado** contra los estándares de calidad

## 🔄 Modo Tradicional (Legacy)

Para mantener la compatibilidad hacia atrás, la skill aún soporta el enfoque tradicional basado en worksheets a través de su documentación. Los usuarios que prefieran el método estructurado de worksheets pueden seguir la sección "Proceso Tradicional de Creación de Skill" abajo.

## 🎯 Selección de Modos

- **Modo Interactivo**: Use cuando desee una conversación guiada para explorar su idea de skill
- **Modo Tradicional**: Use cuando prefiera completar worksheets a su propio ritmo
- **Modo de Script No Interactivo**: Use `interview_skill.py` para uso automatizado o en CI/CD

## 📋 Protocolo de Entrevista Interactiva

La entrevista sigue un proceso estructurado de 5 fases:

### Fase 1: Descubrimiento (5-7 preguntas)
Comprender el problema central, casos de uso, dominio, entradas/salidas, skills similares existentes y experiencia requerida.

### Fase 2: Diseño Colaborativo (Iterativo)
El agente propone arquitectura, recursos y flujos de trabajo basados en las respuestas de descubrimiento; el usuario refina e itera.

### Fase 3: Investigación Asistida (Opcional)
El agente y el usuario pueden solicitar investigación sobre mejores prácticas, patrones existentes y conocimiento específico del dominio.

### Fase 4: Nombramiento
El agente sugiere 3-5 nombres de skill basados en palabras clave y categoría; el usuario elige, modifica o propone su propio nombre.

### Fase 5: Generación
El agente crea una estructura completa de skill: SKILL.md, scripts/, references/, assets/, adrs/, y ejecuta validación inicial.

## 🧩 Proceso Tradicional de Creación de Skill (Legacy)

Para los usuarios que prefieren el enfoque original basado en worksheets, esta skill aún apoya la metodología estructurada:

### Fase 1: Worksheet de Concepción de Skill
Explore y valide su concepto de skill a través de worksheets estructurados que cubren concepto central, casos de uso y capacidades.

### Fase 2: Worksheets de Diseño de Skill
Diseñe el contrato, estructura corporal y evaluabilidad de su skill a través de worksheets guiados.

### Fase 3: Generación y Validación de Skill
Genere su skill en el sandbox y cree artefactos de validación.

## 🛠️ Scripts Asociados

Esta skill funciona con varios scripts complementarios:

### `interview_skill.py`
Herramienta de línea de comandos interactiva (o no interactiva) que ejecuta el protocolo de entrevista:
```bash
# Modo interactivo
python interview_skill.py

# Modo no interactivo (para CI/automatización)
python interview_skill.py --no-interactivo --directorio-salida ./mis-skills

# Especificar directorio de salida
python interview_skill.py --directorio-salida ./skills/personalizado
```

### `research_helpers.py`
Biblioteca de funciones reutilizables para investigación:
```python
from research_helpers import (
    buscar_patrones_github,
    buscar_mejores_practicas_web, 
    analizar_skills_existentes,
    sugerir_nombre_skill
)

# Buscar patrones en skills existentes
patrones = buscar_patrones_github("versionado de api")

# Obtener sugerencias de nombres
nombres = sugerir_nombre_skill(["api", "version"], "devops")
```

### `init_skill.py` (Actualizado)
Crea estructura de skill desde cero o desde resultados de entrevista:
```bash
# Desde cero
python init_skill.py mi-nueva-skill

# Desde resultados de entrevista
python init_skill.py mi-nueva-skill --desde-entrevista resultados_entrevista.json
```

### `package_skill.py` (Actualizado)
Valida skills para completitud y conformidad:
```bash
# Validación básica
python package_skill.py ./mi-skill

# Omitir verificaciones específicas (útil durante desarrollo)
python package_skill.py ./mi-skill --no-verificar-entrevista --no-verificar-adr
```

## 📁 Estructura de Skill Generada

Al crear una skill a través de cualquiera de los modos, se genera la siguiente estructura:

```
<nombre-de-skill>/
├── SKILL.md                  # Documentación completa de skill con frontmatter YAML
├── scripts/
│   └── main.py              # Script ejecutable de skill con registro y argumentos
├── references/
│   └── domain.md            # Conocimiento y referencias específicas del dominio
├── assets/
│   └── README.md            # Marcador de posición para activos estáticos
└── adrs/
    └── 0001-initial-design.md # Registro inicial de decisión de arquitectura
```

## 📝 Estructura de Plantilla de Skill

El `SKILL.md` generado sigue el estándar de skill de quirk con:

- **Frontmatter YAML**: Metadatos estándar incluyendo nombre, categoría, madurez, versión, descripción, capacidades, salidas, efectosSecundarios, dependencias, condiciónDeParada, riesgo, nivelDeConfianza, maxIteraciones
- **Contrato de Operación**: Definición clara de entradas, salidas, efectos secundarios, dependencias, condición de parada, riesgo y límites
- **Documentación de Skill**: Secciones completas que cubren contrato, proceso de diseño, ejemplos, integración con evaluación, criterios de completado y principios rectores
- **Rastreabilidad**: Sección que documenta cómo se creó la skill (proceso de entrevista o worksheets tradicionales)

## 🔑 Principios de Diseño

Las skills creadas con esta herramienta deberían seguir estos principios:

1. **Contratos Explícitos**: Definir claramente lo que la skill consume y produce
2. **Divulgación Progresiva**: Revelar la complejidad gradualmente según sea necesario
3. **Enfoque Mínimo**: Preferir múltiples skills pequeñas sobre una skill grande monolítica
4. **Capacidad de Prueba**: Diseñar skills para que puedan validadas usando el sistema evaluate-skill
5. **Rastreabilidad**: Documentar cómo y por qué se creó la skill
6. **Reproducibilidad**: Asegurar que las skills produzcan resultados consistentes dados los mismos inputs
7. **Compatibilidad**: Mantener compatibilidad con otras skills y herramientas quirk existentes

## 🧪 Integración con el Sistema de Evaluación

Todas las skills deberían diseñarse para funcionar con el sistema evaluate-skill:

### Fixturas de Escenario
Crear archivos JSON de escenario que definan rutas esperadas a través de skills para tareas comunes, incluyendo aserciones estáticas para validación.

### Fixturas de Comportamiento
Crear archivos markdown que definan los formatos de salida esperados, requiriendo secciones específicas y prohibiendo texto de marcador de posición.

## ✅ Criterios de Completado

### Completado en Modo Interactivo
El usuario ha completado el proceso interactivo de creación de skill cuando:

- Han pasado por las 5 fases de la entrevista (descubrimiento, diseño, investigación, nombramiento, generación)
- Han revisado y confirmado la estructura de skill generada
- La skill generada pasa la validación básica con `package_skill.py`

### Completado en Modo Tradicional  
El usuario ha completado el proceso tradicional de creación de skill cuando:

- Han completado todos los worksheets con información específica y accionable
- Han generado una plantilla completa de skill en el sandbox desde sus worksheets completadas
- Han validado el concepto de skill utilizando las herramientas de validación del sandbox
- Han delineado cómo la skill se integra con el sistema de evaluación
- Tienen un plan claro para iterar sobre la skill basado en los comentarios de validación

### Completado en Modo de Script
El script no interactivo ha completado cuando:

- Ha procesado todas las entradas requeridas (ya sea respuestas interactivas o JSON de entrevista)
- Ha generado una estructura completa de skill
- Ha ejecutado las verificaciones de validación
- Ha salido con un código de estado de éxito

## 🛡️ Principios Rectores

- Siempre valide los conceptos de skill contra skills existentes para prevenir duplicación
- Diseñe skills para que sean mínimas y enfocadas - prefiera crear múltiples skills pequeñas sobre una grande
- Asegúrese de que las skills puedan ser testeadas en aislamiento usando el entorno de sandbox
- Siga los principios del método quirk rigurosamente en el diseño de skills
- Considere cómo la skill encaja en flujos de trabajo más grandes antes de crearla
- Recuerde que la predecibilidad es la virtud raíz - diseña para comportamiento consistente
- Use el proceso de entrevista para asegurar decisiones explícitas y verificables en cada paso
- Mantenga la compatibilidad hacia atrás con los scripts existentes `init_skill.py` y `package_skill.py`

## 📚 Referencias

Para referencias detalladas sobre principios de diseño de skills, consulte:
- `references/skill_design_principles.md` - Directrices para crear skills efectivas
- Skills existentes en `.agents/skills/` para patrones e inspiración
- La documentación del método quirk para principios fundamentales

## 📖 Ejemplos

Vea el directorio `templates/` para:
- Plantillas de esqueleto de skill utilizadas durante la generación
- Banco de preguntas de entrevista (`interview_questions.yaml`)
- Plantillas de propuestas para diseño colaborativo (`proposal_templates.yaml`)
- Plantillas de script para skills generadas

## 🔧 Desarrollo y Mantenimiento

Esta skill mantiene compatibilidad con herramientas existentes mientras agrega nuevas capacidades interactivas:

### Compatibilidad Hacia Atrás
- Todas las invocaciones existentes de `init_skill.py` y `package_skill.py` continúan funcionando
- El enfoque tradicional basado en worksheets permanece documentado y utilizable
- Las skills generadas siguen la misma estructura y estándares que antes

### Nuevas Características
- Protocolo de entrevista interactiva con 5 fases distintas
- Capacidades de investigación asistida mediante búsqueda web y análisis de skills
- Algoritmos inteligentes de sugerencia de nombres
- Generación completa de skill con todos los componentes necesarios
- Validación mejorada incluyendo rastreabilidad y evidencia de entrevista

## 🎉 Primeros Pasos

Para crear una nueva skill de forma interactiva:
```bash
python interview_skill.py
```

Para crear una skill no interactivamente (para automatización):
```bash
python interview_skill.py --no-interactivo --directorio-salida ./skills
```

Para validar una skill existente:
```bash
package_skill.py ./ruta/a/skill
```

Para crear una skill desde resultados de entrevista:
```bash
python init_skill.py mi-skill --desde-entrevista resultados_entrevista.json
```
