---
name: math-probability-models
category: skill-dev/sandbox
maturity: stable
version: 1
description: Build probability models — distributions, stochastic processes (Markov, Brownian, Poisson), inference — with explicit assumptions and sanity checks.
capabilities:
  - apply math probability models workflow
  - produce math probability models analysis artifact
  - validate math probability models completion criteria
outputs:
  - Math Probability Models artifact with completed sections, evidence, and limitations
sideEffects: []
dependencies: []
stopCondition: Build probability models complete; required sections present; completion criteria checked.
risk: low
trustTier: 1
maxIterations: 6
---

## Operating Contract

- **Input:** Math Probability Models request, problem context, constraints, and available evidence.
- **Output:** Math Probability Models artifact with completed analysis, decisions, recommendations, and limitations.
- **Side effects:** follow the frontmatter declaration; do not change systems unless explicitly authorized.
- **Dependencies:** declared dependencies, source material, and domain references required by the task.
- **Stop condition:** Build probability models is complete, required sections are present, and completion criteria are checked.
- **Risk:** use the frontmatter risk classification and call out any escalation.
- **Boundary:** stay within the skill's declared scope and side-effect policy.

# Probability & Stochastic Modeling

Construct a **probability model** — distribution, process, or inference — with explicit assumptions and checks against known limits.

## When to use

- User asks for random variables, distributions, stochastic processes, or inference.
- A risk / quant / ML problem needs a probabilistic backbone.

## Process

### 1. Define the space

Name the sample space and events; identify if a sigma-algebra is needed (continuous spaces).

**Completion criterion:** sample space and event space explicit; independence / measurability called out if relevant.

### 2. Choose distribution / process

- Discrete (Bernoulli, Binomial, Poisson, Geometric).
- Continuous (Uniform, Normal, Exponential, Beta, Gamma, t, chi-square).
- Multivariate (Multivariate Normal, Dirichlet, Copulas).
- Stochastic processes (Markov chain, Poisson process, Brownian motion, Lévy, ARMA / GARCH).
- Bayesian: prior + likelihood → posterior.

**Completion criterion:** distribution or process named with type and parameters.

### 3. State parameters

Each parameter is named with value or estimation method (MLE, MAP, moment-matching, prior).

**Completion criterion:** parameters listed with values or estimation procedure.

### 4. Compute / simulate

- Analytical where tractable (mean, variance, CDF, moments).
- Monte Carlo with: seed, sample size N (justified), convergence check.
- For inference: posterior sampling (MCMC, variational, conjugate update).

**Completion criterion:** computation done; sample size or analytical result explicit.

### 5. Validate

- **Limits:** law of large numbers, central limit, stationary distribution, long-run mean.
- **Sanity:** small cases (n=1, 2, 3) checked by hand.
- **Cross-check:** analytical vs simulated mean / variance / tail probability.
- **Calibration:** does the model reproduce known data moments?

**Completion criterion:** validation completed; discrepancy addressed.

### 6. Deliver

Markdown artifact: model, parameters, computation, validation, and an operational interpretation ("expected return X% with std Y% over horizon T").

**Completion criterion:** artifact complete and reproducible.
