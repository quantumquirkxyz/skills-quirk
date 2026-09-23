# Skill Design Principles

Guiding principles for creating effective, maintainable, and valuable quirk skills.

## 🎯 Core Principles

### 1. Explicit Contracts First
Every skill should begin with a clear definition of:
- **Inputs**: What the skill consumes (types, formats, constraints)
- **Outputs**: What the skill produces (types, formats, guarantees)
- **Side Effects**: Honest accounting of repository modifications
- **Dependencies**: Minimal and intentional external dependencies

> "A skill without an explicit contract is not a skill—it's a mystery box."

### 2. Progressive Disclosure
Reveal complexity only when needed:
- Start with simple, common use cases
- Provide advanced options as optional parameters
- Layer complexity from basic → intermediate → expert
- Use sensible defaults to reduce cognitive load

### 3. Minimal and Focused
Prefer specialization over generalization:
- One skill should do one thing well
- Break complex capabilities into multiple composable skills
- Avoid "kitchen sink" skills that try to do everything
- Small skills are easier to test, maintain, and reuse

### 4. Testability by Design
Every skill should be validating:
- Design with evaluation in mind from the start
- Create clear success criteria that can be automated
- Consider edge cases and error conditions
- Make skills work in isolation (sandbox-friendly)

### 5. Predictability Over Cleverness
Favor consistency and reliability:
- Same inputs should produce same outputs
- Avoid hidden state or unexpected behavior
- Clear documentation of limitations and assumptions
- Error messages that help users recover

### 6. Trazabilidad and Documentation
Document not just what the skill does, but why and how:
- How the skill was created (interview process or worksheets)
- Design decisions and alternatives considered
- Known limitations and future work
- Examples of usage and expected outputs

## 🏗️ Structural Principles

### Skill Boundaries
- **In-scope**: Core functionality that solves a specific problem
- **Out-of-scope**: Features that belong in other skills or external tools
- **Boundary clear**: Obvious where this skill ends and others begin

### Dependency Management
- Minimal: Only depend on what's absolutely necessary
- Intentional: Each dependency has a clear justification
- Loose-coupled: Dependencies should be easy to substitute or mock
- Transparent: Dependencies are explicitly declared and documented

### Error Handling
- Fail fast: Detect and report problems early
- Fail clearly: Error messages should guide users to solutions
- Fail safely: Don't leave repository in inconsistent state
- Recoverable: Users should be able to correct and retry

## 📝 Documentation Principles

### SKILL.md Standards
- Complete YAML frontmatter with all required fields
- Clear Operating Contract section
- Structured skill creation process (worksheets or interview flow)
- Practical examples with realistic inputs/outputs
- Integration guidance with evaluation system
- Honest assessment of risk and limitations
- Guardrails that prevent common mistakes

### Reference Materials
- Domain-specific knowledge in references/
- Best practices and patterns documented
- Troubleshooting guides for common issues
- Examples of expected outputs and edge cases

## 🔧 Development Principles

### Iterative Design
- Start with walking skeleton: simplest version that works
- Add features incrementally based on feedback
- Validate each iteration with actual use cases
- Refactor regularly to maintain simplicity

### User-Centered Design
- Solve real problems faced by actual users
- Consider the user's context and experience level
- Provide clear onboarding and getting started guidance
- Design for both novice and expert users

### Maintenance Mindset
- Design for future you and other contributors
- Clear code organization and naming conventions
- Minimal external dependencies to reduce maintenance burden
- Backward compatibility where possible

## 🚫 Anti-Patterns to Avoid

### ❌ The Mystery Box
Skills with unclear inputs/outputs or hidden behavior
- **Fix**: Define explicit contract upfront
- **Fix**: Document all side effects and dependencies

### ❌ The Kitchen Sink
Skills that try to solve every conceivable problem
- **Fix**: Break into smaller, focused skills
- **Fix**: Say "no" to features that don't align with core purpose
- **Fix**: Recommend complementary skills instead of building everything

### ❌ The Documentation Desert
Skills with minimal or outdated documentation
- **Fix**: Treat documentation as first-class feature
- **Fix**: Update documentation when changing the skill
- **Fix**: Include examples that users can run immediately

### ❌ The Dependency Hell
Skills with excessive, unclear, or conflicting dependencies
- **Fix**: Regularly audit and minimize dependencies
- **Fix**: Prefer built-in solutions over external dependencies
- **Fix**: Document why each dependency is necessary

### ❌ The Prediction Failure
Skills that behave inconsistently or unpredictably
- **Fix**: Design for determinism where possible
- **Fix**: Clearly document sources of non-determinism
- **Fix**: Make randomness or variability explicit and controllable

### ❌ The Evaluation Nightmare
Skills that cannot be properly tested or validated
- **Fix**: Design testability in from the beginning
- **Fix**: Create clear success criteria for validation
- **Fix**: Provide scenario and behavioral fixtures

## ✅ Quality Checklist

Before considering a skill complete, verify:

### Contract Clarity
- [ ] Inputs are explicitly defined and documented
- [ ] Outputs are explicitly defined and documented  
- [ ] Side effects are honestly listed
- [ ] Dependencies are minimal and justified
- [ ] Stop condition is clear and checkable

### Structural Soundness
- [ ] Skill has appropriate directory structure (scripts/, references/, assets/, adrs/)
- [ ] SKILL.md follows standard template with all sections
- [ ] Main script is executable and handles arguments properly
- [ ] Reference materials are relevant and useful

### Usability Factors
- [ ] Common use cases are covered and documented
- [ ] Error handling is graceful and informative
- [ ] Default values are sensible and safe
- [ ] Skill works in sandbox without modification

### Evaluation Readiness
- [ ] Clear path to creating scenario fixtures
- [ ] Clear path to creating behavioral fixtures  
- [ ] Success criteria are measurable and automatable
- [ ] Skill can be run in isolation for testing

### Documentation Quality
- [ ] Examples are realistic and runnable
- [ ] Tutorial or getting started section exists
- [ ] References point to high-quality external resources
- [ ] Design decisions are documented (why choices were made)

## 🔄 Evolution Principles

Skills should evolve gracefully over time:

### Versioning
- Use semantic versioning for breaking changes
- Minor versions for backward-compatible additions
- Patch versions for bug fixes and small improvements
- Clearly document what changed in each version

### Deprecation
- Provide clear migration paths when removing features
- Deprecate gracefully with warnings before removal
- Maintain backward compatibility for reasonable periods
- Document deprecated features and their replacements

### Extension Points
- Design for composability rather than monolithic growth
- Consider hook systems or plugin architectures for extensibility
- Prefer creating new skills over bloating existing ones
- Make it easy for others to build upon your skill

## 💡 Inspiration Sources

Look to these sources for skill design inspiration:
- Unix philosophy: "Make each program do one thing well"
- Domain-driven design: Bounded contexts and ubiquitous language
- API design principles: Consistency, simplicity, orthogonality
- Unix tools: Composable, text-processing focused utilities
- Functional programming: Pure functions, immutability, composability

Remember: The goal is not to build the most feature-rich skill, but to build the most **valuable** skill—one that solves real problems reliably and pleasantly.