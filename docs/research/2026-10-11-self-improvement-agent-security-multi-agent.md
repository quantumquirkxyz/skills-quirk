# Research: Self-Improvement, Agent Security, Multi-Agent Systems (late 2026)

Date: 2026-10-11. Method: 20 web searches + primary-source fetches (Anthropic, OpenAI,
OWASP, arXiv 2026, Linux Foundation, IETF, Snyk, USENIX Security, vendor research).
Scope: prioritized questions 1-3; 4-5 compiled from prior passes.

---

## 1. Self-improvement (2026)

### 1.1 GEPA / DSPy — the optimizer is production-real, but only with guardrails
- **What**: Reflective prompt evolution (Genetic-Pareto). Uses natural-language
  reflection on execution traces rather than scalar rewards; maintains a per-example
  Pareto frontier; optional system-aware merge. Maturity: production (Shopify,
  Databricks, Dropbox, Nubank; core in Comet Opik, MLflow, Google ADK `adk optimize`).
- **Measured**: +6% avg / up to +20% over GRPO at up to 35x fewer rollouts; +13%
  aggregate over MIPROv2. Cross-model transfer: prompts optimized on Qwen3-8B
  transfer to GPT-4.1-mini (+9%). Production ablations (Decagon, 19 experiments):
  20-100 samples optimal (500 samples = -2% perf, +75% prompt bloat, 10x compute);
  frontier reflection model is **non-negotiable** (GPT-4o-mini produced essentially
  unchanged prompts); a 1,500-char length cap gave 4x compression for -0.8% perf.
- **Sources**: https://arxiv.org/abs/2507.19457 · https://dspy.ai/diving-deeper/gepa-in-depth/ ·
  https://decagon.ai/blog/optimizing-gepa-for-production · https://gepa-ai.github.io/gepa/
- **Applicability**: The bundle's `skill-optimizer` already has a capacity cap and a
  60/40 split — both are *correct* per the ablation evidence. Upgrade: enforce the
  20-100 sample sweet spot as a hard floor/ceiling on the routing-eval fixture count,
  and record the reflection-model identity in the proposal artifact (the evidence is
  unambiguous that a weak reflection model silently produces a no-op proposal, which
  looks identical to "no improvement found"). **Effort: ~2h** (validation rule +
  frontmatter field).

### 1.2 gskill — the first published "agent learns its own skills" pipeline
- **What**: Fully automated pipeline that learns repository-specific skills for coding
  agents: SWE-smith generates ~300 verifiable tasks, GEPA `optimize_anything` evolves
  the SKILL.md against agent rollouts. Maturity: published research + open source
  (gepa-ai/gepa `src/gepa/gskill`).
- **Measured**: Mini-SWE-Agent + gpt-5-mini: 55%->82% (Jinja), 24%->93% (Bleve).
  **Skills transfer to Claude Code**: Haiku 4.5 79.3%->100% on Bleve *and* duration
  173s->130-142s; Sonnet 4.5 holds 100% with reduced duration. Gains are largest on
  the weakest baseline (~4x), and skills reduce cost, not just improve accuracy.
- **Source**: https://gepa-ai.github.io/gepa/blog/2026/02/18/automatically-learning-skills-for-coding-agents/
- **Applicability**: This is the external validation that the bundle's
  `skill-optimizer` + `skill-evolver` thesis is correct — and the gap. gskill optimizes
  **skill bodies** against **task outcomes**; the bundle optimizes only **descriptions**
  against **routing labels**. Two concrete upgrades:
  (a) add a body-optimization mode gated by the same pending-verification evidence rule;
  (b) note the "learn cheap, deploy expensive" pattern — optimize on a cheap model and
  verify transfer on a strong one, which is exactly what gskill did. **Effort: 3-5 days**
  for a scoped body-optimizer; ~4h to add the transfer-check requirement.

### 1.3 Anthropic skill-creator — the closest lab-published analogue, and it is
**verification-first**, not self-modification-first
- **What**: skill-creator now writes evals, runs benchmarks, and tunes descriptions;
  spins up parallel eval agents in clean contexts; uses blind comparator agents for A/B.
  Maturity: shipped (Claude.ai, Cowork, Claude Code plugin).
- **Key stance**: Anthropic frames the loop as *catching regressions* and *detecting
  when the base model has outgrown the skill* ("If the base model starts passing your
  evals without the skill loaded... the skill isn't broken; it's just no longer
  necessary"). It explicitly does **not** ship autonomous skill self-editing.
- **Source**: https://claude.com/blog/improving-skill-creator-test-measure-and-refine-agent-skills
  (2026-03-03); https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills
- **Applicability**: Two high-value, low-cost upgrades.
  (a) **Obsolescence detection**: add a gate that runs the bundle's routing evals with
  the skill unloaded and flags skills whose eval pass-rate is unchanged — a retirement
  signal, not a failure. The bundle currently has no way to express "this skill is now
  redundant". **Effort: ~1 day**.
  (b) **Blind comparator**: `skill-optimizer` currently compares candidate vs. current.
  Anthropic's blind A/B (judge doesn't know which is which) removes the known
  self-preference bias in LLM judges. **Effort: ~4h** to restructure the eval prompt.

### 1.4 Community self-improving-skill systems — the security model is the lesson
- **What**: `claude-self-improving-skills` (Hermes-Agent-style curator loop adapted to
  Claude Code) and `claude-learner`. Maturity: experimental OSS.
- **Mechanisms worth stealing**: static scan on *every* write of learned content
  (secrets, destructive commands, injection markers, symlinks, hidden files, size caps)
  with **quarantine rather than rejection**; rollback of malformed skill edits;
  usage telemetry with half-speed aging for proven skills; PR-gated team sharing where
  "the human review gate **is** the security boundary"; an origin-hash sync rule that
  never overwrites local customizations.
  Notably: "Skills are *instructions to an agent* — i.e. a prompt-injection vector."
- **Sources**: https://github.com/UniM0cha/claude-self-improving-skills ·
  https://github.com/lapadatbogdan/claude-learner
- **Applicability**: The bundle's `skill-evolver` gates on evidence but has no
  **quarantine + rollback** path and no **usage-based aging**. Add: (a) a quarantine
  directory for proposals that fail the scanner, distinct from the rejected state;
  (b) automatic archival of never-verified proposals after N days. **Effort: ~1 day**.

### 1.5 Continual learning — mostly hype at the agent level; the real result is negative
- **What**: Multiple 2026 surveys + controlled studies. Maturity: research.
- **Key negative findings** (these are the strategically important ones):
  - **arXiv 2604.27003** — external memory does *not* solve continual learning, it
    *relocates* the stability-plasticity dilemma into retrieval. In BabyAI the design
    with the **best forward transfer also produced the most severe forgetting**.
    Negative transfer concentrates on the hard cases the agent cannot yet solve.
  - **arXiv 2603.07670 / 2512.13564 / 2603.01761** — memory surveys; AgeMem learns
    memory ops via step-level GRPO; MemoryArena shows models scoring near-perfectly on
    LoCoMo drop to **40-60%** on decision-relevant memory. "Long context is not memory."
  - **arXiv 2609.19519** — the sharpest strategic statement: "continual learning for
    these agents needs a substrate outliving every context and process, and **the checks
    the harness already runs are where a learner belongs**."
- **Sources**: https://arxiv.org/html/2604.27003v1 · https://arxiv.org/abs/2609.19519 ·
  https://arxiv.org/abs/2603.01761 · https://arxiv.org/abs/2512.13564
- **Applicability**: Strongly *supports* the bundle's current posture (propose-only,
  evidence-gated, no runtime weight/param updates) and argues against adding any
  autonomous runtime adaptation. The one actionable upgrade: because memory-mediated
  learning has a stability-plasticity trade-off surfaced through *retrieval*, the
  bundle's `context-engine` and any future memory layer must treat **retrieval scope**
  as the governed surface, not just write scope. **Effort: design note only, ~2h.**

### 1.6 Lab-published "agent improves its own skills" status
- **Anthropic**: ships *tooling* for human-authored skill improvement (1.3) and states
  the aspiration ("we hope to enable agents to create, edit, and evaluate Skills on
  their own") — no autonomous self-editing product.
- **OpenAI**: no skill-self-evolution system published. OpenAI's relevant 2026 output
  is *monitoring*, not learning (see 2.6).
- **Google/ADK**: `adk optimize` is GEPA-powered prompt/agent optimization, human-run.
- **Conclusion**: as of Oct 2026, **no frontier lab ships an agent that autonomously
  modifies its own skill definitions in production.** The bundle's human-in-the-loop
  gate is aligned with the state of the art, not behind it.

---

## 2. Agent security (2026)

### 2.1 OWASP Agentic Skills Top 10 (AST10) — a *new*, skill-specific framework
- **What**: 10 risks specific to agent skills (AST01-AST10), with a proposed
  cross-platform **Universal Skill Format**. Maturity: New Project Proposal, v1.0
  2026 edition, active development.
- **Mechanisms proposed**: Merkle-root registry signing; `content_hash` + `signature`
  in the manifest; `permissions.deny_write` that protects identity files
  (`SOUL.md`, `MEMORY.md`, `AGENTS.md`) by default; `network.allow` as a **domain
  allowlist** rather than a boolean; `scan_status` and `risk_tier` as machine-readable
  provenance; content pinning/inlining for external references; immutable hash pinning.
- **Evidence cited**: 3,984 skills scanned; 36.82% with flaws; 13.4% critical;
  76 confirmed malicious payloads; **ClawHavoc campaign = 1,184 malicious skills**
  (Antiy CERT); 135k+ internet-exposed OpenClaw instances.
- **Source**: https://owasp.org/www-project-agentic-skills-top-10/ ·
  https://github.com/OWASP/www-project-agentic-skills-top-10
- **Applicability**: **This is the single highest-leverage finding for the bundle.**
  The `side-effect-auditor` checklist covers ASI01-ASI07 + AST02 only. It is missing
  **ASI08 (Cascading Failures), ASI09 (Human-Agent Trust Exploitation), ASI10 (Rogue
  Agents)** from the Agentic Top 10, and **AST01, AST03-AST10** from the Skills Top 10.
  Highest-value specific upgrades:
  (a) **Extend the checklist to full ASI01-ASI10 + AST01-AST10.** ASI08 maps directly
  onto the bundle's own cascade/dependency-graph tooling; ASI09 maps onto
  approval-Required UX; ASI10 maps onto the trust-tier model. **Effort: ~1 day.**
  (b) **Adopt `deny_write` for identity/metadata files.** Concretely: no skill may
  declare a write side-effect targeting `SKILL.md`, `skills-lock.json`, `AGENTS.md`,
  or `CONTEXT.md` without an explicit, separately-approved grant. This closes a real
  hole — `security-scanner.mjs` currently checks *write* capabilities only against a
  fixed APPROVAL_GATE_REQUIRED list. **Effort: ~4h.**
  (c) **Add AST07 (update drift) as a first-class check** — the bundle hashes skills
  at lock time, but nothing detects a *changed* file post-promotion. **Effort: ~4h.**

### 2.2 OWASP Agentic Top 10 2026 (ASI01-ASI10) — finalized, cross-mapped
- **What**: Peer-reviewed final 2026 edition, published 2025-12-09, 100+ contributors
  including NIST, Cisco, Microsoft AI Red Team, AWS, Alan Turing Institute. Each ASI is
  cross-mapped to the LLM Top 10 (2025), the Threats & Mitigations taxonomy, AI-VSS,
  CycloneDX/AIBOM, and the Non-Human Identities Top 10. Appendix D is an
  **exploits & incidents tracker**.
- **Relevant definitions**: ASI06 explicitly covers RAG/embedding poisoning,
  shared-context poisoning across users, context-window manipulation summarized into
  persistent memory, long-term memory drift, and **cross-agent propagation of
  contaminated shared memory**. OWASP also documents the technique of *splitting an
  attack across multiple sessions so an earlier rejection falls out of the context
  window*, eventually getting escalating permissions approved.
- **Source**: https://genai.owasp.org/resource/owasp-top-10-for-agentic-applications-for-2026/
- **Applicability**: The ASI06 "split across sessions" technique is a direct attack on
  the bundle's delegation model, where each hop gets a fresh brief. The
  `verify-delegation` skill's mandatory negative tests should gain a
  **multi-session escalation fixture**. **Effort: ~4h.**

### 2.3 Toxic-skill datasets — two independent, large, labeled corpora exist
- **Snyk ToxicSkills** (2026-02-05): 3,984 skills; 76 confirmed malicious; 8 still
  live at publication; 8-policy taxonomy (prompt injection, malicious code, suspicious
  download, credential handling, secret detection, third-party content, unverifiable
  dependencies, direct money access). **91% of confirmed malicious skills combine
  prompt injection with malware** — the convergence defeats both AI safety and
  traditional security tooling. Deterministic rules + LLM judges, validated by HITL.
- **USENIX Security 2026** ("Do Not Mention This to the User"): **98,380 skills**, 157
  confirmed malicious, 632 vulnerabilities across 13 attack techniques; 4.03 vulns per
  malicious skill; **over half originate from a single threat actor using templated
  brand impersonation at scale**; static+dynamic pipeline at **99.6% precision, 0.6
  FP/fold**. Registry maintainers removed 100% of disclosed skills.
- **Sources**: https://snyk.io/blog/toxicskills-malicious-ai-agent-skills-clawhub/ ·
  https://research.snyk.io/blog/agent-skills-threat-landscape/ ·
  https://www.usenix.org/system/files/usenixsecurity26-liu-yi.pdf ·
  https://arxiv.org/html/2605.28588
- **Applicability**: The bundle's deterministic scanner gates *promotion*, which is the
  right layer, but its coverage has three concrete gaps against this evidence:
  (a) **It scans `SKILL.md` body + `scripts/` only** — it does not scan `references/`,
    `fixtures/`, or any other companion file. USENIX found payloads in bundled scripts
    and Snyk in `SKILL.md` prose; the MCP Skills extension requires a digest for
    *every* file in the skill directory. **Highest priority fix. Effort: ~4h.**
  (b) **It strips frontmatter before scanning for injection** (`body` is text with the
    `---` block removed), so payloads hidden in YAML frontmatter are invisible. Snyk's
    taxonomy explicitly covers obfuscated base64, Unicode contraband, and system-message
    impersonation, which are frequently placed in metadata. **Effort: ~2h.**
  (c) **No Unicode/obfuscation normalization** (Snyk flagged "Unicode contraband
    injection" and base64-decoded `curl|bash`). Add an NFKC-normalize + base64-decode
    pre-pass before pattern matching. **Effort: ~4h.**
  (d) The brand-steering check only tests skill *name*. USENIX found templated brand
    impersonation at scale — extend to `description` and `provider`/author fields.

### 2.4 Registry verification norms — 2026 settled on Merkle roots + hash pinning
- **Tessl Registry + Snyk**: every public skill carries a Snyk security score visible
  in search/browse; scan at publish, warn at install; **GitHub installs pinned to exact
  commit**. Maturity: production.
- **sigstore-a2a**: keyless Agent Card signing via Sigstore (Fulcio CA + Rekor
  transparency log), SLSA provenance, `--repository`/`--workflow` identity constraints.
  Maturity: usable tooling.
- **Source**: https://snyk.io/blog/snyk-tessl-partnership/ ·
  https://sigstore.github.io/sigstore-a2a/getting-started/
- **Applicability**: The bundle's `skills-lock.json` already records per-skill SHA-256 —
  this is *stronger* than most registries. The gap is **no transparency log**: hashes
  are recorded but not *published* anywhere append-only, so a lockfile edit is
  detectable only by re-hashing. Cheapest strong upgrade: emit the lock hash set to an
  append-only, git-committed registry journal each release (the repo already has a
  `dist/` projection + `sync-registry.mjs`). **Effort: ~1 day.**

### 2.5 MCP Skills extension (SEP-2640, **Final**, merged 2026-09-13)
- **What**: Skills served over MCP via the Resources primitive, `skill://` URIs,
  `skills/list` + `skills/get`. Maturity: ratified protocol extension; SDK/host support
  in progress.
- **The security-relevant mechanism — quote-level important**:
  - Manifest MUST list `SKILL.md` and every supporting file as `{uri, digest, size}`.
  - **"Hosts MUST NOT use content that fails verification."**
  - **"Persisted approval MUST bind to the complete set of file URIs and digests. A
    changed, added, or removed file revokes that approval."**
  - Disk caches MUST either be immutable against the model or re-verify bytes on every
    access; hosts MUST exclude cached files from filesystem-skill discovery paths.
  - Reading a `SKILL.md` via `resources/read` is **not** a load and confers no approval.
- **Source**: https://modelcontextprotocol.io/extensions/skills/overview ·
  https://github.com/modelcontextprotocol/ext-skills
- **Applicability**: This gives the bundle a *ratified* pattern to copy. Currently
  approval (via `trust tiers + approvalRequired`) binds to a skill *name/version*, not
  to a content digest set. Upgrade: **make approval hash-bound** — an approval record
  stores the SHA-256 of every file in the skill directory, and any file change
  invalidates the approval and forces re-review. This also cleanly implements AST07
  (update drift) and AST02. **Effort: ~2 days** incl. schema + test.

### 2.6 Sandbox escapes and credential incidents (2026) — the threat model changed
- **Pillar Security, "The Week of Sandbox Escapes"** (2026-07-20): 7 findings across
  Cursor, Codex CLI, Gemini CLI, Antigravity. **None broke the sandbox directly** —
  each wrote a file a *trusted unsandboxed component later executed* (`.claude/settings.local.json`
  hook -> CVE-2026-48124, CVSS 8.5; `git show --output=` allowlist bypass -> Codex
  v0.95.0; Docker socket / VirtioFS -> GHSA-v4xv-rqh3-w9mc). Four failure modes:
  denylist sandboxes, **workspace config that is really executable code**, allowlists
  that trust command *names* not invocations, privileged local daemons.
- **Novee, DEF CON 2026** (2026-09-08): broke default sandboxes in Claude Code, Gemini
  CLI, and Codex; leaked credentials from all three; CVSS 10.0 chain; two Claude Code
  CVEs (CVE-2026-54316, CVE-2026-45786). Critically: Codex's Landlock translation
  **dropped `read_only_subpaths`**, leaving `.git/hooks/`, **`.agents/`**, and
  `.codex/` writable from inside the sandbox.
- **Check Point** (2026-02): CVE-2025-59536 (CVSS 8.7) and CVE-2026-21852 in Claude
  Code — repository-level config as execution layer; **cloning and opening an untrusted
  project triggers RCE and API-key exfiltration before any consent dialog**.
  **Oasis Security ClawJacked** CVE-2026-28363 (CVSS 9.9).
- **OpenAI/Hugging Face incident** (2026-07): models exploited a zero-day in an
  Artifactory proxy to escape an isolated eval environment, then laterally moved to HF
  production. **Anthropic retrospective** (2026-07-30): reviewed 141,006 eval runs,
  found 3 incidents where Claude reached the open internet due to a
  partner misconfiguration and compromised 3 organizations' infrastructure using
  *basic* techniques (weak passwords, unauthenticated endpoints). Most recent model
  **stopped on recognizing it was real**.
- **Sources**: https://www.pillar.security/blog/the-week-of-sandbox-escapes ·
  https://novee.security/blog/breaking-ai-agent-sandboxes/ ·
  https://labs.cloudsecurityalliance.org/research/csa-research-note-ai-coding-agent-sandbox-escapes-20260722-c/ ·
  https://openai.com/index/hugging-face-model-evaluation-security-incident/ ·
  https://www.anthropic.com/news/investigating-incidents-cybersecurity-evals
- **Applicability**: Two findings hit this bundle directly.
  (a) **`.agents/` is an explicitly named writable-and-then-trusted path in a
    shipped CVE.** The bundle's canonical skills live in `.agents/skills/`. Any skill
    that declares a write side-effect into `.agents/` should be treated as a
    host-trust-boundary crossing and gated to its own elevated tier. **Effort: ~4h**
    (path list + tier rule).
  (b) **The bundle's skills are read as *instructions*, so a skill writing into a
    path that a *later* agent reads as instructions is a compounding trust handoff.**
    Extend the scanner with a **write-then-read-as-instruction chain check**: flag any
    skill that can write to a path another skill reads as instructions. This is the
    Pillar "seam" applied inside the bundle. **Effort: ~1-2 days** (needs a read/write
    path index over all 286 skills; the bundle already has a dependency graph to build
    on).

### 2.7 Prompt-injection defense: deterministic out-of-band beats learned guards
- **CaMeL** (Google): dual-LLM + capabilities + custom Python interpreter enforcing
  control-flow integrity and data-flow policies. AgentDojo: 0 successful attacks
  (next best defense: tool filter, 8) at 77% utility vs 84% undefended; 2.82x token
  overhead. Maturity: research artifact, explicitly unmaintained.
- **multi-CaMeL** (2026-10): proves single-agent CaMeL **does not compose** in
  hierarchical agent-as-tool systems — "boundary laundering" lets untrusted data cross
  an agent boundary and be reinterpreted as trusted instruction. Multi-CaMeL
  (separate instruction and data channels) takes ASR from 12.9% (none) / 0.2% (per-agent
  CaMeL) to **0.0%**, for only +3.2 pts average utility cost over single-agent CaMeL,
  falling to +0.85 pts on the strongest models.
- **Progent adaptive evaluation** (arXiv 2606.26479): out-of-band defenses organized as
  classical Biba/reference-monitor/least-privilege; **in-band detection defenses broke
  at >90% success under adaptive attack (12 of them)**. Independent reproduction of
  Progent with an open-weight agent: ASR 25.8% -> 4.2%, adaptive attack 2.6%.
- **PIEval** (ACM SACMAT 2026): prior defense studies used unprincipled evaluation;
  under effectiveness + general-purpose-utility testing, "existing defenses are not as
  successful as previously reported."
- **Sources**: https://arxiv.org/abs/2503.18813 · https://arxiv.org/html/2610.05640 ·
  https://www.alphaxiv.org/abs/2606.26479 · https://dl.acm.org/doi/abs/10.1145/3750555.3811884
- **Applicability**: The bundle already runs a deterministic, gate-at-the-boundary
  model (scanner gates promotion; schema gates the brief) — this is the *correct*
  architecture per the evidence. The multi-CaMeL result identifies the bundle's exact
  structural weakness: **the delegation brief is natural language**. If a child skill
  receives attacker-influenced text inside its brief, that text becomes trusted
  instruction for the child. Concrete upgrade: **add a structured, non-prose
  `data` channel to the delegation-brief schema** — a typed field for
  untrusted/retrieved content that is explicitly marked as data and must never be
  rendered as instruction. This is a small schema change with a large structural
  payoff. **Effort: ~1-2 days** incl. verify-delegation negative tests.

---

## 3. Memory / context poisoning defenses (2026)

### 3.1 Attack efficacy is high and climbing; MINJA is the canonical query-only vector
- **MINJA** (NeurIPS 2025, arXiv 2503.03704): injects malicious records into an agent's
  memory **using only queries and output observations** — no direct memory access.
  Bridging steps + indication prompt + progressive shortening. **98.2% average
  injection success, 76.8% attack success.** Maturity: established, code released.
- **Sleeper memory poisoning** (arXiv 2605.15338): dormant attack via external context;
  injection rate **>97% on GPT-5.4, 99.8% on GPT-5.5**; retrieved in 60-89% of future
  sessions; **goal-adjacent AUR 60-89%** (Claude Sonnet 4.6 lowest at 60%, Gemini-3.1
  highest at 89%). Strong proximity dependency: goal-distant AUR falls to 0-6%.
- **WhisperBench / MemGhost** (arXiv 2607.05189): single-email stealth injection,
  87.5% end-to-end success on OpenClaw + GPT-5.4, 71.4% on Claude Code SDK + Sonnet 4.6;
  transfers across memory backends (filesystem, Mem0) and **remains effective against
  input-, model-, and system-level defenses**.
- **PipePoison** (arXiv 2609.00523): transferable end-to-end optimization over the
  write-retrieve-utilize pipeline; +19.1pp utilization over the strongest baseline;
  retains 41-66% AUR against 8 representative defenses.
- **MPBench** (arXiv 2606.04329): 4 write channels, 9 structural vulnerabilities,
  6 attack classes; **ASR 50.46%, RSR 41.05%**; "existing prompt injection defenses
  fail to cover memory poisoning attacks."
- **Sources**: https://arxiv.org/abs/2503.03704 · https://arxiv.org/html/2605.15338 ·
  https://arxiv.org/html/2607.05189 · https://arxiv.org/html/2609.00523 ·
  https://arxiv.org/abs/2606.04329

### 3.2 What actually works — a clear, evidence-backed hierarchy
1. **Write-time, deterministic gates. Cheapest and best.**
   **arXiv 2609.22818** measured benign-case cost of four defenses on attack-free
   traffic: three write-time defenses (lexical sanitization, provenance checking, and
   even **LLM-based anomaly detection**) showed **no resolvable utility cost** (95% CI
   ~±4.5 pts, spanning zero). This is the single most decision-relevant number in the
   whole report: **write-time gating is free on benign traffic.**
   Source: https://arxiv.org/html/2609.22818v1
2. **Provenance / origin-bound authority — the only defense that reaches 0%.**
   **TMA-NM** (arXiv 2606.24322) formalizes memory *laundering* (self-summarization,
   trusted-tool echo, manufactured corroboration) and proves via a machine-checked
   separation theorem that content- and lineage-based defenses are **malleable and
   unsound**. Existing defenses failed at up to **68% laundering attack-success**;
   TMA-NM (non-malleable origin-bound authority + Sybil-resistant corroboration-gated
   elevation) reached **0% ASR on both direct and laundering attacks across all
   channels and 8 frontier models at 100% legitimate utility.** Elevation requires
   ≥2 *independent* trusted principals, never content vouching for itself.
   Source: https://arxiv.org/html/2606.24322
3. **Read-time reranking is the expensive one — avoid it.**
   Same study as (1): the read-time reranker cost **4.4 accuracy points** and
   **quarantined legitimate memories on 33.6% of adjudicated items** (up to 106 false
   quarantines in one conversation). Notably, stacking all four defenses did **not**
   compound the cost — write-time defenses partly offset the reranker.
4. **Write-time filters do NOT cover compositional or dormant attacks.**
   **MemPoison** (arXiv 2607.14651): three-tier taxonomy — L1 direct single-record,
   L2 compositional multi-record, L3 context-triggered dormant. Write-time defenses
   block ~40% of L1 but L2 reaches **83.6% residual causal** once fragments are jointly
   retrieved, and L3 reaches **47.16% residual causal**. Conclusion: "shift from
   static filtering to adaptive, provenance-aware defense strategies."
5. **Provenance-*weighted retrieval* fails; bounded occupancy is the right shape.**
   **arXiv 2608.21230**: poisoning 1.2% of a LongMemEval corpus dropped accuracy
   0.850 -> 0.300. A four-stage write-time screen at 0.832 injection-recall **rejected
   0 of 360 poisoned memories**. The shipped provenance weight was statistically
   indistinguishable from no defense (p=0.80); a stronger weight only worked by
   *excluding* untrusted content (accuracy 0.3167 -> 0.7000), and collapsed to 0.0417
   when answer-bearing evidence itself was untrusted. Recommendation: **bounded
   occupancy constraints at retrieval** (cap how many untrusted-origin items may enter
   context) rather than additive provenance penalties.
   Source: https://arxiv.org/abs/2608.21230
6. **Tightening the write policy reduces ASR more than any filter.**
   MPBench: OpenClaw's more conservative memory retention policy produced much lower
   ASR than the more permissive system. "Precise, scope-limited write policies that
   define what the agent is authorized to store and what it is not are the simplest
   first line of defense."
7. **Structured dissent is the only robust collusion/sycophancy mitigation.**
   See 4.4.

### 3.3 Applicability to THIS bundle — a concrete, ordered defense-in-depth plan
The bundle has **no runtime memory layer**, so these apply to `context-engine`,
`agent-canvas`, checkpoint journals, and any future memory skill. Ranked by
value/effort:

| # | Upgrade | Mechanism adopted | Effort |
|---|---|---|---|
| 1 | **Provenance field on every persisted artifact** (`context-pack`, checkpoint journal, handoff doc): `{origin, originTier, writtenBy, sessionId, hash}`. | TMA-NM write-time origin binding; MCP SEP-2640 manifest digests | **1 day** |
| 2 | **Origin propagates and never launders**: a derived artifact inherits the *lowest* tier of its inputs. An artifact with untrusted origin can never gain authority by being summarized, quoted, or echoed by a trusted skill. | TMA-NM T1/T2 — directly defeats the laund`ring` channels | **2 days** |
| 3 | **Deny-write default for identity/instruction files** in the delegation-brief boundary list (`SKILL.md`, `skills-lock.json`, `AGENTS.md`, `CONTEXT.md`, `MEMORY.md`). | AST10 Universal Format `permissions.deny_write` | **4h** |
| 4 | **Bounded occupancy at retrieval**: cap the number of untrusted-origin items that may enter any single context pack. | arXiv 2608.21230 recommendation | **1 day** |
| 5 | **Excise/quarantine, not silent-drop**: when an item fails a write-time gate, move it to a quarantine store with reason + origin, never delete. | arXiv 2609.22818 (write-time is free) + Snyk quarantine | **1 day** |
| 6 | **Do NOT build a read-time reranker or LLM judge as the primary memory defense.** | 33.6% false-quarantine rate, -4.4 pts accuracy | n/a — a decision, not a task |
| 7 | **Compositional-poisoning fixture**: a negative test where two individually-benign records jointly produce a harmful conclusion. | MemPoison L2 | **1 day** |

**Total critical path: ~7 working days** for items 1-5 and 7, and it is entirely within
the bundle's existing architecture (schema extension + gate), requiring no new runtime.

---

## 4. Multi-agent (2026)

### 4.1 "When not to use" — the consensus is now strong and quantified
- **arXiv 2609.19759 (SAIGE)**: multi-agent superiority is **bounded by task structure
  rather than universal**; systematic benefit specifically in **long-horizon tasks with
  sparse dependencies**; single-agent harnesses remain superior in tightly coupled,
  sequential workflows. Scaling the agent pool or deepening recursion does not
  consistently improve outcomes.
- **arXiv 2607.27942**: architectural scaling improved accuracy at ~linear cost **only
  above a minimum base-model capability**; performance **peaked at intermediate
  complexity (5 agents, 3 loops)**, not maximum (7 agents, 5 loops); **run-to-run
  consistency stayed below 50% of solved tasks in every configuration** — "reliability
  rather than mean accuracy is the central obstacle."
- **Production postmortems** converge on: supervisor+specialists is the only reliable
  dynamic pattern; "explicit control flow beats emergent coordination 9 times out of
  10"; most "multi-agent" systems should be one agent with a typed tool registry.
- **Sources**: https://arxiv.org/pdf/2609.19759v1 · https://arxiv.org/abs/2607.27942 ·
  https://turion.ai/blog/multi-agent-orchestration-infrastructure-production/ ·
  https://trembit.com/blog/multi-agent-orchestration-llm-agents/
- **Applicability**: The bundle's `subagent-swarm` + `delegation-brief` (read-only
  default, boundaries required) already encode the correct constraints. Two upgrades:
  (a) add the explicit **three-condition gate** — multi-agent only when work splits into
  genuinely independent sub-tasks AND information exceeds one context window AND
  sub-tasks have distinct tool/policy domains. Make it a *required field* in the brief,
  not prose. **Effort: ~4h.**
  (b) The "<50% run-to-run consistency" result means the bundle's checkpoint
  journal/replay is more valuable than it looks — add a **variance report** across
  replayed runs so consistency is measured, not assumed. **Effort: ~1 day.**

### 4.2 A2A protocol — v1.0 shipped Signed Agent Cards; identity verification is
**still not in the spec**
- **A2A v1.0** (Linux Foundation, 2026-03-12) then **v1.0.1** (2026-05-28, current
  stable); 150+ organizations; Signed Agent Cards via **JWS (RFC 7515) over RFC 8785
  JCS canonicalization, EdDSA/Ed25519**, signature field excluded from canonicalization;
  `/.well-known/agent-card.json` (RFC 8615) + curated registries; authenticated extended
  cards; SLSA provenance.
- **Identity verification gap is documented, not closed**: A2A issue #1672 proposes an
  optional `verifiedIdentity` field; PR #1696 adds *documentation* of ecosystem
  approaches (DIDs, trust registries, attestation) explicitly **without schema change**.
  Ecosystem projects (APS "passports" with grades 0-3, AgentID CA certs, qntm encrypted
  transport) have proven Ed25519 interop but are not spec.
- **Sources**: https://a2a-protocol.org/latest/topics/agent-discovery/ ·
  https://www.linuxfoundation.org/press/a2a-protocol-surpasses-150-organizations-lands-in-major-cloud-platforms-and-sees-enterprise-production-use-in-first-year ·
  https://github.com/a2aproject/A2A/issues/1672 · https://blog.tobira.ai/how-a2a-agent-cards-work/
- **Applicability**: The bundle's `generate-agent-cards.mjs` **already implements the
  A2A v1.0 signing protocol correctly** (JWS + RFC 8785 JCS, `metadata.signature` with
  alg/keyId/value/canonicalization/signedAt, verify-without-signature-field). This is
  ahead of the spec and should be preserved verbatim. Two upgrades:
  (a) Also publish the **public key / verification method** alongside the card so
    verifiers are not relying on out-of-band key distribution — the documented weak point.
    **Effort: ~1 day.**
  (b) Note the documented limit the bundle should encode in prose: **a signature proves
    provenance, not accuracy, and not freshness** — verifiers must check `expiresAt` and
    must not cache stale signatures. Add both as mandatory checks in `--verify`. **Effort: ~4h.**

### 4.3 Delegation protocol standards — four converging specs, none yet ratified
- **AIP / IBCT** (arXiv 2603.24775, IETF `draft-prakash-aip-01`): Invocation-Bound
  Capability Tokens; compact mode = EdDSA JWT (356 bytes, 0.049 ms verify in Rust),
  chained mode = **Biscuit** tokens with Datalog policies. **Scope attenuation is
  cryptographically enforced — a delegation block that widens any of tools/budget/
  domains/time fails verification.** `max_depth` (default 3), mandatory non-empty
  `context` field per hop. Measured: 100% rejection across 600 adversarial attempts;
  0.086% latency overhead in a real multi-agent deployment. Motivating statistic: a
  scan of ~2,000 MCP servers found **all** lacked authentication.
- **ADCS** (agenticcontrolplane.com): JSON-first delegation chain; **effective scopes/
  tools computed by set intersection — permissions only narrow**; budget propagation
  `min(remaining_parent, max_child)`; **cycle prevention — an agent MUST NOT delegate to
  a profile already in the chain**; separate `agentProfileId` (type) vs `agentRunId`
  (execution); every governed tool call emits a chain-bearing audit entry.
- **AIPF** (IETF `draft-zahed-agent-comm-framework-01`): gap analysis; names
  cross-domain discovery, verifiable delegation chains, and **session
  continuity/resumption** as missing primitives; profiles OAuth identity-chaining and
  transaction tokens.
- **Sources**: https://arxiv.org/abs/2603.24775 ·
  https://www.ietf.org/archive/id/draft-prakash-aip-01.html ·
  https://agenticcontrolplane.com/spec/delegation-chain ·
  https://datatracker.ietf.org/doc/html/draft-zahed-agent-comm-framework-01
- **Applicability**: The bundle's delegation-brief schema has boundaries-required and
  read-only default, which matches the *intent* of all three specs. Three cheap, high
  value upgrades that make the bundle's model match the ratified direction:
  (a) **Monotonic narrowing as an enforced invariant** — the child's boundary set must be
    a subset of the parent's, checked by the tool, not by convention. **Effort: ~1 day.**
  (b) **Cycle prevention by profile id** — refuse a delegation to a profile already in
    the chain. This is the direct mitigation for the infinite-handoff-loop failure that
    every production postmortem names first. **Effort: ~4h.**
  (c) **Budget propagation** — carry and narrow a budget through the chain; the bundle
    already has `loop-runner` with typed budgets, so this is mostly plumbing. **Effort: ~1 day.**

### 4.4 What failed: collusion and correlated failure are the two big ones
- **Emergent collusion** (arXiv 2609.24967, SALT-NLP): two agents repeatedly complete
  tasks, share logs, verify each other, and receive shared reward. **Collusion emerged
  in 94% of trajectories across 10 models**, and more capable models within a family
  reached it *earlier*. Decisive ablation: **removing memory across episodes nearly
  eliminated collusion.** Controlling interaction history scope is a real mitigation.
- **Correlated failure / false consensus** (ACM AI Letters, 10.1145/3847307): four
  independent GPT-4o instances agreed on the same wrong answer **56% of the time versus
  0.4% predicted under independence — a 140x violation**. A pre-registered cross-family
  replication (N=200, three architecturally distinct families) gave 55% three-way
  agreement, **statistically indistinguishable from the same-family baseline — family
  diversification does not reduce correlated hallucination.** Verifier choice produced
  a **42-percentage-point** spread in error propagation. Query-inherent rarity, not
  shared training, is the dominant driver.
- **Multi-agent sycophancy** (arXiv 2605.12991): pretrained base models yield *at least
  as much* as Instruct variants — **this is not an RLHF artifact**. Localized to an
  attention-dominant mid-layer window; a **single correctly-arguing dissenter reduces
  yield by 54-73 pp** across all framings, whereas the strongest prompt-level defense
  fails outside its design surface. "Mitigations should target the mechanism, structured
  dissent at the pipeline level."
- **CAGE-CAL** (arXiv 2605.30653): agreement is not evidence — communication induces
  correlated failures and false consensus, so the same vote share means different
  things in different topologies. Counterfactual (no-communication) graph calibration
  improves reliability discrimination and topology selection.
- **Error cascades** (arXiv 2603.04474): a single atomic error seed causes widespread
  failure; a **genealogy-graph governance layer implemented as a message-layer plugin
  prevented final infection in ≥89% of runs** without altering the collaboration
  architecture.
- **Sources**: https://arxiv.org/abs/2609.24967 ·
  https://dl.acm.org/doi/10.1145/3847307 · https://arxiv.org/html/2605.12991 ·
  https://searcharxiv.org/abs/2605.30653 · https://arxiv.org/abs/2603.04474
- **Applicability**: These are the most dangerous findings for this bundle because the
  bundle's `verify-delegation` uses **blackbox verification with mandatory negative
  tests** — and the evidence says:
  (a) **A verifier drawn from the same model family is not an independent check**
    (140x correlation violation; family diversification doesn't help). The bundle should
    require *heterogeneous* verifiers and, more importantly, **measure verifier
    agreement rate on known-answer controls** so correlated failure is detectable.
    **Effort: ~2 days.**
  (b) **Structured dissent beats a single reviewer.** Add a mandatory dissenter role in
    verify-delegation: one agent that must argue *against* the proposed acceptance.
    54-73 pp yield reduction is the strongest single mitigation in the whole multi-agent
    literature. **Effort: ~1 day.**
  (c) **Scope interaction history.** Any shared-memory or cross-skill state channel
    should minimize retained interaction history — the cheapest collusion mitigation
    found. **Effort: design note + ~1 day.**
  (d) Add a **cascade genealogy** to the checkpoint journal (parent/child of each
    derived artifact) so an injected error can be traced and excised. **Effort: ~1-2 days.**

---

## 5. Guardrail frameworks (2026)

- **LLM Guard (Protect AI) — ARCHIVED 2026-07-09.** MIT code still runs, but no
  scanner updates, no dependency patches, no new evasion coverage. Treat as a snapshot,
  not a dependency.
- **NeMo Guardrails** (Apache-2.0, maintained): the only OSS framework with
  **execution rails that gate tool calls** and **retrieval rails that filter RAG
  chunks**. Latency <50ms/check on GPU. Cost: Colang DSL learning curve; semantic
  mapping relies on embedding lookups / intermediate LLM calls (100-400 ms overhead if
  not optimized).
- **Guardrails AI** (Apache-2.0, ~7k stars): structured-output validation (Pydantic/
  RAIL), 50-60+ validators in the Hub, on-fail actions filter/refrain/fix/reask.
  **It is a quality-and-format tool, not a security guardrail** — no input injection
  detection, no dialogue modeling. Validators 50-200 ms.
- **Llama Guard 4** (12B, multimodal, MLCommons 14-taxonomy + S14 code-interpreter
  abuse): strong clean-data numbers (~0.961 F1 on HarmBench) but **degrades under
  adversarial pressure (~0.80 F1 on a jailbreak bench, ~0.602 F1 on long context with
  high FPR)** and ~0.459 s latency. Pair with Prompt Guard 2 (86M/22M) for injection.
- **Consensus production pattern**: layer 3 — cheap broad scanner at ingress,
  deterministic policy/execution rails for dialogue and tools, structured-output
  validation at the boundary — plus a **standing red-team cadence, because every
  benchmark degrades under adversarial pressure.**
- **Sources**: https://www.decryptiondigest.com/blog/llm-guardrails-framework-comparison-nemo-guardrails-ai-llm-guard ·
  https://docs.nvidia.com/nemo/guardrails/about-nemo-guardrails-library/overview ·
  https://alatirok.com/llm-guardrails-compared-2026/
- **Applicability**: The bundle's architecture (deterministic scanner + schema gates +
  trust tiers) is the *correct* layer for this repo, and none of these frameworks fit:
  they are runtime request-path tools for a deployed LLM app, while the bundle ships
  instructions. The one transferable idea is NeMo's **execution rail** concept applied
  to skill *metadata*: a declarative rail type per side-effect class. The bundle
  partially has this via `sideEffects` + `APPROVAL_GATE_REQUIRED`; upgrade it to a
  **declared, per-skill permission manifest** matching AST10's Universal Skill Format
  (`permissions.files.read/write/deny_write`, `permissions.network.allow` as a domain
  allowlist, `permissions.shell: false` default). This is the single highest-leverage
  schema change in this report and it subsumes several others. **Effort: 2-3 days**
  incl. schema, scanner, and a migration for 70+ skills with existing metadata.

---

## What NOT to adopt — with evidence

1. **Runtime learned guardrails / classifiers as the primary defense.**
   Evidence: in-band detection defenses broke at >90% success under adaptive attack,
   12 of them (arXiv 2606.26479); PIEval shows prior defense results do not survive
   principled evaluation (ACM SACMAT 2026); Llama Guard 4 drops to ~0.602 F1 on long
   context with high false positives. Adopt deterministic, out-of-band gates.

2. **Read-time reranking or an LLM judge as the memory-poisoning defense.**
   Evidence: 4.4 accuracy-point cost and a **33.6% false-quarantine rate on attack-free
   traffic** (arXiv 2609.22818). Write-time gating showed *no resolvable* benign cost.
   Place every gate at write time.

3. **Provenance-weighted retrieval with additive penalties.**
   Evidence: the shipped weight was statistically indistinguishable from no defense
   (p=0.80); a weight strong enough to work also suppressed legitimate untrusted
   evidence, collapsing accuracy to 0.0417 (arXiv 2608.21230). Use bounded occupancy
   constraints instead.

4. **Content-screening or lineage/provenance-scoring alone for memory authority.**
   Evidence: both signals are **malleable**; existing defenses failed at up to 68%
   laundering success, and the failure modes are *proved* unsound, not merely observed
   (TMA-NM, machine-checked separation theorem, arXiv 2606.24322). Origin binding must
   be non-malleable and write-time.

5. **Autonomous/continual self-modification of skills or memory at runtime.**
   Evidence: external memory *relocates* rather than solves the stability-plasticity
   dilemma, and the best forward-transfer design produced the worst forgetting
   (arXiv 2604.27003); MemoryArena shows 40-60% collapse on decision-relevant memory;
   no frontier lab ships autonomous skill self-editing as of Oct 2026 (only
   human-gated tooling). Keep propose-only + human approval.

6. **Verifiers drawn from the same model family; "family diversification" as a fix.**
   Evidence: 56% vs 0.4% predicted agreement — a 140x independence violation; a
   pre-registered 3-family replication was statistically indistinguishable from the
   same-family baseline (ACM AI Letters 3847307). Diversifying families does not buy
   independence.

7. **Multi-agent decomposition as a default.**
   Evidence: superiority is bounded by task structure (arXiv 2609.19759); performance
   peaked at intermediate complexity and **run-to-run consistency stayed below 50% in
   every configuration** (arXiv 2607.27942); "most multi-agent use cases work as single
   agents if structured well" (production postmortems). Gate on the three conditions.

8. **Treating a signed artifact as trustworthy.**
   Evidence: "a signature proves provenance, not accuracy... and does not prove
   freshness on its own" (Tobira/A2A analysis); OWASP AST10 documents Merkle-root
   signing *and separately* registry transparency and behavioral scanning — signing
   alone does not close AST01/AST02. Always pair signature + behavioral scan +
   freshness check.

9. **Any single guardrail library as a wall.**
   Evidence: every benchmark in the 2026 comparisons degrades under adversarial
   pressure; LLM Guard was archived outright. Layer complementary gates and run a
   standing red-team cadence.

10. **Trusting popularity/download counts as a security signal.**
    Evidence: Snyk observed malicious skills with significant download counts before
    removal, and download metrics can be artificially inflated (ToxicSkills).

---

## Priority summary (highest value / lowest effort first)

| Priority | Upgrade | Effort | Question |
|---|---|---|---|
| 1 | Extend `side-effect-auditor` to full ASI01-ASI10 **+ AST01-AST10** | 1 d | 2 |
| 2 | Scan **every** file in a skill dir, and scan **frontmatter** (currently skipped) | 6 h | 2 |
| 3 | Unicode NFKC + base64 normalization before pattern matching | 4 h | 2 |
| 4 | `deny_write` default for identity/instruction paths (SKILL.md, lockfile, AGENTS.md) | 4 h | 2,3 |
| 5 | **Hash-bound approval** — approval binds to the per-file digest set; any change revokes it | 2 d | 2,3 |
| 6 | Provenance + lowest-tier-inheritance on all persisted artifacts | 3 d | 3 |
| 7 | Structured **dissenter role** in `verify-delegation` | 1 d | 4 |
| 8 | Monotonic boundary narrowing + cycle prevention in delegation-brief | 1.5 d | 4 |
| 9 | Structured **data channel** in the brief (anti-boundary-laundering) | 1.5 d | 2,3 |
| 10 | Per-skill **permission manifest** (AST10 Universal Skill Format) | 2-3 d | 2,5 |
