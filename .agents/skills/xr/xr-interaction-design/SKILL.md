---
name: xr-interaction-design
category: xr
maturity: stable
version: 1
description: Design XR interactions — spatial input, comfort, locomotion, hand tracking, and feedback — with clear constraints on immersion and usability.
capabilities:
  - design spatial interaction models
  - evaluate locomotion and comfort trade-offs
  - plan XR input feedback and validation
outputs:
  - XR interaction design with input model, comfort constraints, feedback, and validation tasks
sideEffects: []
dependencies: []
stopCondition: Spatial input, feedback, comfort constraints, and validation tasks are explicit.
risk: low
trustTier: 1
maxIterations: 6
---

# xr-interaction-design

Use this skill when designing AR/VR/MR interactions involving spatial input, hand tracking, controllers, gaze, locomotion, gestures, haptics, or immersive feedback.

## Contract

- Input: user task, environment, device capabilities, input methods, comfort constraints, and safety considerations.
- Output: XR interaction model with input mappings, feedback, comfort constraints, error recovery, and validation tasks.
- Scope: XR interaction design; performance optimization belongs to xr-performance.
- Boundary: never trade basic comfort, safety, or task clarity for immersion alone.

## Rules

- Rule: define the user's posture, physical space, dominant input method, and session length.
- Rule: map every action to input, feedback, cancellation, and recovery behavior.
- Rule: account for fatigue, reach limits, motion sickness, occlusion, and tracking loss.
- Rule: provide multimodal feedback when spatial precision or attention is uncertain.
- Rule: validate interactions in-device with realistic posture and environment.

## Steps

1. Define user task, environment, device, session length, and safety constraints.
2. Choose input model: hands, controllers, gaze, voice, body, anchors, or hybrid.
3. Map actions, states, feedback, errors, and cancellation paths.
4. Analyze comfort, locomotion, reach, fatigue, and tracking-loss risks.
5. Prototype and test the interaction in the target XR context.
6. Document validation results, trade-offs, and iteration criteria.

## Completion Criteria

- input model and feedback are explicit
- comfort and safety constraints are documented
- recovery paths handle tracking and input failures
- validation tasks match realistic XR use
