---
name: os-processes
category: os
maturity: stable
version: 1
description: Design operating system process management — scheduling, signals, process states, concurrency, and inter-process communication — with explicit isolation boundaries.
capabilities:
  - analyze process lifecycle
  - reason about scheduling and IPC
  - diagnose concurrency and isolation issues
outputs:
  - process-system analysis with states, scheduling, IPC, and isolation assumptions
sideEffects: []
dependencies: []
stopCondition: Process states, scheduling assumptions, IPC, and failure behavior are explicit.
risk: low
trustTier: 1
maxIterations: 6
---

# os-processes

Use this skill when reasoning about process lifecycle, scheduling, signals, forks, exec, IPC, synchronization, process isolation, or OS-level concurrency behavior.

## Contract

- Input: OS context, process model, workload, synchronization needs, and observed symptoms or design goal.
- Output: process-state analysis, scheduling/IPC design, and failure or race-condition notes.
- Scope: process and IPC reasoning; memory-specific issues belong to os-memory.
- Boundary: distinguish process behavior, thread behavior, and application-level task scheduling.

## Rules

- Rule: name process states and transitions before explaining lifecycle behavior.
- Rule: identify ownership of file descriptors, signals, child processes, and exit status.
- Rule: separate CPU scheduling, blocking I/O, locks, and IPC delays.
- Rule: treat signal handling and process cleanup as failure paths, not afterthoughts.
- Rule: call out isolation boundaries for privileges, namespaces, cgroups, and resources when relevant.

## Steps

1. Identify processes, parents/children, threads, and resource ownership.
2. Trace lifecycle: start, fork/exec, wait, signal, termination, and cleanup.
3. Analyze scheduling, blocking points, IPC channels, and synchronization.
4. Identify races, deadlocks, orphan/zombie risks, and resource leaks.
5. Recommend design or diagnostic steps.
6. Define tests or observations that would confirm the process behavior.

## Completion Criteria

- lifecycle and ownership boundaries are explicit
- scheduling and IPC assumptions are documented
- failure modes such as leaks, races, and zombies are considered
- verification or diagnostic steps are provided
