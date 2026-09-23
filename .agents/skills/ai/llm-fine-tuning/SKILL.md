---
name: llm-fine-tuning
category: skill-dev/sandbox
maturity: stable
version: 1
description: Fine-tune LLMs — LoRA, QLoRA, full fine-tuning, data preparation, evaluation, deployment — with reproducibility, efficiency, and safety controls.
capabilities:
  - design fine-tuning strategies (LoRA, QLoRA, full fine-tuning)
  - prepare and curate training datasets (prompt/response, instruction tuning, preference data)
  - configure training hyperparameters, adapters, and quantization
  - evaluate fine-tuned models against base models and benchmarks
  - plan deployment serving strategy (vLLM, TGI, LoRAX, adapters)
outputs:
  - Fine-tuning plan (method, data, hyperparameters, compute estimate)
  - Dataset curation report (sources, splits, quality checks, prompt templates)
  - Evaluation report (benchmarks, human eval design, safety checks)
  - Deployment manifest (serving config, adapter registry, monitoring rules)
sideEffects: []
dependencies: []
stopCondition: Fine-tuning plan saved; dataset report complete; evaluation report generated; deployment manifest filled.
risk: medium
trustTier: 3
maxIterations: 8
---

## Contract

- **Input:** base model, task description, dataset description, compute constraints, performance target.
- **Output:** fine-tuning plan + dataset curation report + evaluation report + deployment manifest.
- **Side effects:** may trigger training jobs, consume compute, write artifacts when executed.
- **Dependencies:** ML framework (PyTorch), fine-tuning library (PEFT, bitsandbytes, TRL), dataset tooling, serving infrastructure.
- **Stop condition:** plan documented; dataset validated; evaluation criteria set; deployment config ready.
- **Risk:** medium — training costs are significant; model quality affects downstream users; safety and bias risks exist.
- **Boundary:** designs fine-tuning workflow; does not execute production training jobs unless explicitly instructed.

# LLM Fine-Tuning

Fine-tune a **large language model** using efficient methods (LoRA, QLoRA, full fine-tuning) with reproducible data pipelines and safety controls.

## Process

### 1. Frame the fine-tuning task
- Task type: instruction tuning, continuation, chat, code, summarisation, classification, RAG adapter.
- Base model selection: open-weight model (Llama, Mistral, Gemma, Qwen, Phi) appropriate for task and compute.
- Performance target: benchmark (MMLU, HumanEval, GSM8K) or domain-specific metric.
- Compute constraints: GPU memory, training time budget, cost ceiling.

**Completion criterion:** task type named; base model selected with justification; compute budget defined.

### 2. Data preparation
- Source identification: public datasets, internal data, synthetic generation, human annotations.
- Prompt template design: system prompt, few-shot examples, response format, safety preamble.
- Data quality checks: duplicates, PII removal, toxicity screening, label consistency, length distribution.
- Train / validation / test split; holdout for contamination testing.
- Dataset format: JSONL, chat template, or preference pairs (DPO/RLHF).

**Completion criterion:** dataset curation report complete; splits defined; quality checks passed.

### 3. Fine-tuning method selection
- **LoRA:** low-rank adapters; 4-bit or 8-bit quantisation; memory-efficient; good for most tasks.
- **QLoRA:** LoRA with quantised base model (NF4, double quantisation); minimal VRAM; suitable for single-GPU.
- **Full fine-tuning:** full parameter update; highest quality; requires large GPU cluster; risk of catastrophic forgetting.
- **Prefix tuning / prompt tuning:** lightweight; less expressive; suitable for small datasets.
- Selection criteria: dataset size, compute budget, base model size, downstream latency requirements.

**Completion criterion:** fine-tuning method selected with compute estimate and adapter config.

### 4. Training configuration
- Hyperparameters: learning rate, batch size, gradient accumulation steps, warmup ratio, epochs.
- Optimiser and scheduler: AdamW, paged AdamW, cosine or linear schedule.
- Regularisation: dropout, weight decay, gradient clipping.
- Reproducibility: seed, deterministic flags, versioned data and code, experiment tracking (W&B, MLflow).
- Safety: toxicity detector during training, output filtering, refusal behaviour preservation.

**Completion criterion:** training configuration documented with seeds and versions.

### 5. Evaluation
- Automatic benchmarks aligned with task (perplexity, BLEU, ROUGE, MMLU, HumanEval, MT-Bench, custom evals).
- Comparison against base model (delta metrics, qualitative samples).
- Human evaluation design: criteria, rubrics, annotator agreement targets, sample size.
- Safety and bias evaluation: toxicity, demographic parity, jailbreak resistance.
- Efficiency: inference latency, memory footprint, adapter size.

**Completion criterion:** evaluation report with benchmark scores, human eval plan, and safety check results.

### 6. Deployment
- Serving infrastructure: vLLM, TGI, LoRAX, text-generation-inference, Sagemaker endpoint, local.
- Adapter management: LoRA registry, base model serving, dynamic adapter switching.
- Monitoring: request latency, token throughput, error rate, output quality (drift detection), safety flags.
- Rollback: revert to base model or previous adapter version; versioned checkpoints.

**Completion criterion:** deployment manifest complete; monitoring rules defined; rollback plan present.

## Rules

- Rule: document compute requirements and cost estimates before starting training.
- Rule: use reproducible seeds, versioned datasets, and experiment tracking for every run.
- Rule: run safety and bias evaluation before promoting any fine-tuned model to production.
- Rule: compare fine-tuned model against base model on held-out test set; report delta metrics.
- Rule: implement monitoring for output quality and safety flags in production serving.
