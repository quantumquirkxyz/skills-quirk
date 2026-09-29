---
name: graphic-design-project-management
category: graphic-design
maturity: experimental
version: 1
description: Manage graphic design projects — briefs, iterations, reviews, asset handoff, versioning, and delivery — with explicit scope, timelines, and quality gates.
capabilities:
  - define project scope, timeline, and deliverables
  - manage design iterations and feedback cycles
  - coordinate reviews and stakeholder approvals
  - define asset handoff and versioning standards
  - produce graphic design project management artifact
outputs:
  - Graphic Design Project Management artifact with project plan, iteration schedule, review gates, and handoff standards
sideEffects:
  - write-files
dependencies: []
stopCondition: Graphic design project management plan complete; scope, timeline, iterations, reviews, and handoff standards explicit.
risk: low
trustTier: 2
maxIterations: 6
---

## Operating Contract

- **Input:** Graphic design project request, stakeholder map, deliverable list, and timeline constraints.
- **Output:** Graphic Design Project Management artifact with project plan, iteration schedule, review gates, and handoff standards.
- **Side effects:** writes project plans and management documentation to local files.
- **Dependencies:** none.
- **Stop condition:** Graphic design project management plan complete; scope, timeline, iterations, reviews, and handoff standards explicit.
- **Risk:** low because this skill writes local project documentation only.
- **Boundary:** plans and documents the project; does not execute project management tools or modify external systems.

# Graphic Design Project Management

Use this skill when a graphic design project needs explicit scope, timeline, iteration cycles, review gates, and asset handoff standards. It should translate stakeholder expectations into a durable project plan that keeps quality, feedback, and delivery visible.

## Contract

- Input: project brief, stakeholder map, deliverable list, timeline constraints, and quality requirements.
- Output: graphic design project management artifact with project plan, iteration schedule, review gates, and handoff standards.
- Scope: plan and document the project; do not execute external project management tools.
- Rule: define one owner per deliverable and one approver per review gate.
- Rule: separate creative iteration from stakeholder approval.
- Rule: define acceptance criteria and quality gates before work begins.

## Steps

### 1. Define project scope and deliverables

- List deliverables: posters, social graphics, brand assets, packaging, editorial layouts, presentations.
- Define acceptance criteria per deliverable: format, resolution, color space, brand compliance, accessibility.
- Define out-of-scope items explicitly.
- Identify dependencies between deliverables.

**Completion criterion:** scope and deliverables with acceptance criteria saved.

### 2. Plan timeline and milestones

- Define project phases: discovery, concept, refinement, production, delivery.
- Assign estimated durations and milestone dates.
- Identify critical path and buffer time.
- Define dependencies between phases and deliverables.

**Completion criterion:** timeline with milestones and critical path saved.

### 3. Design iteration cycles

- Define iteration structure: number of rounds, feedback format, revision limits.
- Separate internal review from stakeholder review.
- Define feedback window and response time expectations.
- Specify what constitutes a new iteration versus a minor revision.

**Completion criterion:** iteration schedule with feedback rules saved.

### 4. Define review gates and approval workflow

- Define review stages: internal creative review, stakeholder review, brand review, legal review, final approval.
- Assign owner and approver per gate.
- Define approval criteria per gate.
- Define escalation path for blocked approvals.

**Completion criterion:** review gates with owners, approvers, and criteria saved.

### 5. Specify asset handoff standards

- Define required formats per deliverable: source files, exported files, preview files.
- Define naming conventions: project code, deliverable type, version, date.
- Define folder structure and asset organization.
- Define versioning strategy: semantic versioning or date-based versioning.
- Define documentation requirements: readme, font licenses, color values, production notes.

**Completion criterion:** asset handoff standards saved.

### 6. Document quality gates

- Define quality checks per deliverable: brand compliance, accessibility, resolution, color accuracy, spelling.
- Define who performs each check.
- Define pass/fail criteria.
- Define rework process for failed quality gates.

**Completion criterion:** quality gate checklist with owners and criteria saved.

### 7. Plan stakeholder communication

- Define meeting cadence: standup, review, retro.
- Define communication channels: async updates, synchronous reviews.
- Define escalation path for blockers.
- Define retrospective schedule and format.

**Completion criterion:** stakeholder communication plan saved.

## Completion criteria

- project scope and deliverables are explicit
- timeline with milestones and critical path is defined
- iteration schedule with feedback rules is defined
- review gates with owners and approvers are defined
- asset handoff standards are defined
- quality gate checklist is defined
- stakeholder communication plan is defined

## References

- `../../professional/professional-project-management/SKILL.md` — project scope, milestones, risks, dependencies
- `../../project/to-tickets/SKILL.md` — tracer-bullet ticket decomposition
- `references/domain.md` — graphic design project management terminology and frameworks
- `references/brief-templates.md` — design brief structures and examples
- `references/handoff-standards.md` — asset handoff formats and versioning patterns
