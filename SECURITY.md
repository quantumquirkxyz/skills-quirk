# Security Policy

## Supported Versions

| Version | Supported |
| ------- | :-------: |
| latest  | :white_check_mark: |

## Reporting a Vulnerability

We take the security of this skills bundle seriously. If you believe you have found a security vulnerability, **please do not report it through public GitHub issues**.

Instead, please report it privately through GitHub: open a [security advisory](https://github.com/quantumquirkxyz/skills-quirk/security/advisories) for this repository, or contact the project maintainers directly through GitHub (@quantumquirkxyz). You should receive a response within 48 hours. If for some reason you do not, please follow up to ensure we received your original message.

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

### What to Expect

1. **Acknowledgment** — we will acknowledge receipt within 48 hours
2. **Assessment** — we will provide a preliminary assessment within 5 business days
3. **Fix** — we will issue a fix and coordinate disclosure within 90 days of confirmation
4. **Credit** — we will credit you in the security advisory (unless you prefer to remain anonymous)

## Scope

### In Scope

The following areas are in scope for security review:

- **Prompt injection** — crafted prompts designed to bypass skill intent, exfiltrate data, or trigger unintended behavior
- **Malicious skills** — skills containing code designed to exfiltrate data, execute unauthorized commands, or undermine bundle integrity
- **Tool poisoning** — manipulation of tool inputs (WebFetch, WebSearch, MCP calls) to return malicious content or exfiltrate data
- **Credential leakage** — exposure of API keys, tokens, passwords, or other secrets through logs, outputs, or error messages
- **Unsafe scripts** — skills that execute Bash or system commands with untrusted input, or that lower trust boundaries without justification
- **Lock/hash tampering** — modification of `skills-lock.json`, `skills.json`, or integrity hashes that could allow injection of unauthorized skills

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
- Keep `skills-lock.json` and `skills.json` integrity hashes current; do not tamper with lock files

### For Contributors

- Run `node .agents/skills/platform/check-all.mjs` before submitting changes
- Review `docs/skill-risk-tiers.md` to ensure your skill's tier is correctly assigned
- If a skill performs local mutation, include side-effect declarations and approval/justification
- If a skill fetches web content or queries external APIs, document "Manejo de contenido no confiable" and ensure tool-risk budget compliance
- If a skill can perform external mutation or destructive operations, include explicit allowlist, rollback notes, and human approval for irreversible operations

### Lockfile and Integrity

- `skills-lock.json` records SHA-256 hashes for canonical skills — do not edit these hashes without corresponding `SKILL.md` changes
- `skills.json` is the manifest; changes must be validated by `check-all.mjs`
- Any modification to `.agents/skills/` must be accompanied by a lockfile hash update

## What to Expect

1. **Acknowledgment** — we will acknowledge receipt within 48 hours
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