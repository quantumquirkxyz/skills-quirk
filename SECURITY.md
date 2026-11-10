# Security Policy

## Supported Versions

| Version | Supported |
| ------- | :-------: |
| 3.0.0   | :white_check_mark: |

## Reporting a Vulnerability

We take the security of this skills bundle seriously. If you believe you have found a security vulnerability, **please do not report it through public GitHub issues**.

Instead, please report it via [GitHub Security Advisory](https://github.com/quantumquirkxyz/skills-quirk/security/advisories) for this repository. This repository runs on the free GitHub plan, which does not support secret scanning or push protection; security reports are handled through the advisories feature maintainable by repository maintainers. You should receive an acknowledgment within 48 hours if the advisories feature is active; if for some reason you do not, please follow up to ensure we received your original message.

### How to Report

To report a vulnerability, please include:

1. **Type of issue** (e.g., prompt injection, malicious skill, tool poisoning, credential leakage, unsafe script, lock/hash tampering)
2. **Affected components** — full paths or skill names related to the manifestation of the issue
3. **Location** — the location of the affected source (tag/branch/commit or direct URL)
4. **Configuration** — any special configuration required to reproduce the issue
5. **Reproduction steps** — step-by-step instructions to reproduce the issue
6. **Proof of concept** — proof-of-concept or exploit code (if possible)
7. **Impact** — impact of the issue, including how an attacker might exploit it
8. **Suggested fix** — optional but appreciated

## Scope

### In Scope

The following areas are in scope for security review:

- **Prompt injection** — crafted prompts designed to bypass skill intent, exfiltrate data, or trigger unintended behavior
- **Malicious skills** — skills containing code designed to exfiltrate data, execute unauthorized commands, or undermine bundle integrity
- **Tool poisoning** — manipulation of tool inputs (WebFetch, WebSearch, MCP calls) to return malicious content or exfiltrate data
- **Credential leakage** — exposure of API keys, tokens, passwords, or other secrets through logs, outputs, or error messages
- **Unsafe scripts** — skills that execute Bash or system commands with untrusted input, or that lower trust boundaries without justification
- **Lock/hash tampering** — modification of `skills-lock.json` integrity hashes that could allow injection of unauthorized skills

### Out of Scope

- **Third-party dependency policy** — vulnerabilities in third-party dependencies should be reported via their respective channels (npm, Bun, GitHub Actions, etc.). This repository does not run Dependabot or CodeQL; such reports should target the upstream dependency owners directly.

## Security Best Practices

### For Skill Authors

- Never commit secrets, API keys, tokens, or passwords to the repository or skill sandboxes
- Validate all untrusted input before passing it to tools or scripts
- Document tool-risk debt for any skill that consumes untrusted content (see `docs/tool-risk-debt.md`)
- Declare skill risk tiers appropriately in `SKILL.md` frontmatter (`trustTier`)
- Use parameterized prompts; avoid string concatenation that could enable injection
- Sanitize all outputs before returning them to users or writing them to files
- Never log credentials, prompt content, or sensitive user data
- Keep `skills-lock.json` integrity hashes current; do not tamper with lock files. `skills.json` is the manifest; its hash is verified by `check-all.mjs` but is not part of the lockfile integrity system.

### For Contributors

- Run `node .agents/skills/platform/check-all.mjs` before submitting changes
- Review `docs/skill-risk-tiers.md` to ensure your skill's tier is correctly assigned
- If a skill performs local mutation, include side-effect declarations and approval/justification
- If a skill fetches web content or queries external APIs, document "Manejo de contenido no confiable" and ensure tool-risk budget compliance
- If a skill can perform external mutation or destructive operations, include explicit allowlist, rollback notes, and human approval for irreversible operations

## What to Expect

1. **Acknowledgment** — we will acknowledge receipt within 48 hours (best-effort; this repository's free GitHub plan may delay acknowledgment if the advisories feature is temporarily unavailable)
2. **Assessment** — we will provide a preliminary assessment within 5 business days
3. **Fix** — we will issue a fix and coordinate disclosure within 90 days of confirmation
4. **Credit** — we will credit you in the security advisory (unless you prefer to remain anonymous)

## Security Advisories

Security advisories are published on GitHub:

```
https://github.com/quantumquirkxyz/skills-quirk/security/advisories
```

## Acknowledgments

We thank the security researchers and community members who help keep this skills bundle secure.