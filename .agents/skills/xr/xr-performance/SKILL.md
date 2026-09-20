---
name: xr-performance
category: xr
maturity: stable
version: 1
description: Optimize XR performance — frame rate, motion-to-photon latency, asset budgets, and thermal constraints — with comfort-aware trade-offs.
capabilities:
  - define XR performance budgets
  - diagnose frame, latency, and thermal issues
  - plan comfort-aware optimization
outputs:
  - XR performance plan with budgets, profiling, optimizations, and comfort checks
sideEffects: []
dependencies: []
stopCondition: XR performance targets, profiling evidence, and comfort trade-offs are explicit.
risk: low
trustTier: 1
maxIterations: 6
---

# xr-performance

Use this skill when optimizing AR/VR/MR frame rate, latency, thermal behavior, asset budgets, tracking stability, or comfort-sensitive rendering performance.

## Contract

- Input: target device, runtime, scene complexity, performance targets, profiling data, and interaction requirements.
- Output: XR performance budget, bottleneck analysis, optimization plan, and comfort validation checks.
- Scope: XR runtime and rendering performance; general 3D scene design belongs to frontend/XR development guidance when performance is not the main issue.
- Boundary: prioritize sustained comfort and stable frame pacing over peak visual fidelity.

## Rules

- Rule: define target frame rate, motion-to-photon latency, and device thermal budget.
- Rule: separate CPU, GPU, memory, asset, tracking, and network bottlenecks.
- Rule: include frame pacing, reprojection, and dropped-frame behavior where the platform exposes it.
- Rule: treat comfort regressions as performance failures.
- Rule: validate on target hardware, not only desktop simulators.

## Steps

1. Identify device, runtime, target frame rate, interaction mode, and scene constraints.
2. Capture baseline profiling for CPU, GPU, memory, frame timing, and thermals.
3. Identify dominant bottlenecks and comfort risks.
4. Recommend optimizations: LODs, batching, occlusion, shader simplification, asset budgets, foveation, or interaction changes.
5. Define acceptance tests on target hardware.
6. Document trade-offs and regression checks.

## Completion Criteria

- target hardware and performance budgets are explicit
- bottleneck evidence is documented
- optimization plan accounts for comfort
- validation runs on representative XR hardware
