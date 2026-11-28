# Physics Simulation Fixture

## Positive case
Build the pinned simulation environment, save parameters and seeds, run convergence and benchmark checks, and report results with resource limits and provenance.

## Boundary and refusal
If the executable, physics list, benchmark, or convergence target is unavailable, return `BLOCKED` and identify the next safe probe; do not substitute an untracked configuration.

## Negative control
Do not claim convergence from one run, conceal failed benchmarks, or execute an unapproved external command.
