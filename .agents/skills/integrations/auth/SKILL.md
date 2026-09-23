---
name: auth
category: integrations
maturity: stable
version: 2
description: Design authentication and authorization as a small, explicit seam — with OAuth2/OIDC, MFA, passkeys, JWT, session management, and clear caller and operator responsibilities.
capabilities:
  - design auth flows (OAuth2, OIDC, SAML, session, JWT, passkeys)
  - define authorization models (RBAC, ABAC, ReBAC, permissions)
  - plan MFA, passwordless, and session management
  - assess auth security (token theft, CSRF, session fixation, brute force)
outputs:
  - Auth design document (flows, protocols, token model, authorization, MFA, security assessment)
sideEffects: []
dependencies: []
stopCondition: Auth design complete; flows documented; security assessment explicit.
risk: medium
trustTier: 3
maxIterations: 6
---

# Auth

Use this skill when a project needs authentication or authorization defined before implementation. Keep the seam small and the responsibilities explicit: who is the user, who can act, and where the trust boundary sits. Treat identity as untrusted input until the project has verified it at the declared boundary.

## Contract

- Input: auth brief, identity context, and security constraints.
- Output: an auth design document covering flows, protocols, token model, authorization, MFA, and security assessment.
- Scope: design the auth shape, not the full implementation.
- Rule: distinguish authentication from authorization.
- Rule: make the trust boundary explicit before choosing providers or protocols.
- Rule: keep the caller contract small enough that backend refactors do not leak into user-facing flows.
- Rule: default to deny when identity, session state, tenant context, or required permission is missing or stale.
- Rule: define session/token lifetime, revocation behavior, and credential or secret handling at the level needed to prevent accidental persistence.
- Rule: separate resource ownership, roles, and service-to-service identity when they are different decisions.
- Rule: identify security-sensitive events that require an audit trail without logging credentials or raw tokens.

## Process

### 1. Identify the identity source, trust boundary, and actors

- **Actors:** human user, service account, job, IoT device, anonymous caller.
- **Identity source:** local database, OAuth2/OIDC provider (Google, Auth0, Keycloak), SAML IdP, LDAP, WebAuthn.
- **Trust boundary:** where does verification happen? Edge (API gateway), service mesh, application layer.

**Completion criterion:** actors and identity source named; trust boundary explicit.

### 2. Choose authentication flows

Select flows appropriate to the client type:

- **Web app:** Authorization Code Flow + PKCE (OAuth2/OIDC); session cookie with SameSite + Secure.
- **SPA / mobile:** Authorization Code Flow + PKCE; token storage in secure enclave / httpOnly cookie.
- **Service-to-service:** mTLS, client credentials, signed JWTs, API keys with rotation.
- **Passwordless:** WebAuthn (passkeys), Magic Link, OTP via email/SMS.
- **MFA:** TOTP (Google Authenticator), push notification, WebAuthn, SMS (least preferred).

**Completion criterion:** flows selected per client type; rationale explicit.

### 3. Design token and session model

- **Access token:** JWT (opaque or self-contained), lifetime, audience, issuer, scopes.
- **Refresh token:** rotation, revocation, storage, reuse detection.
- **Session:** server-side session store vs stateless JWT; session fixation protection; idle/timeout.
- **CSRF protection:** SameSite cookies, CSRF tokens, double-submit cookie.

**Completion criterion:** token/session lifecycle and storage explicit.

### 4. Define authorization model

- **RBAC:** roles, permissions, role hierarchy, permission inheritance.
- **ABAC:** attributes (department, clearance, location, device posture).
- **ReBAC:** relationship-based (parent/child, owner/member, graph traversal).
- **Policy enforcement:** where is the check? API gateway, service mesh, application middleware, database row-level security.

**Completion criterion:** authorization model named; default-deny behavior explicit.

### 5. MFA and passwordless design

- **Enforcement:** required for all users, high-risk actions only, or optional.
- **Recovery:** backup codes, recovery email, admin reset.
- **Passkeys:** WebAuthn registration and authentication flow; platform vs cross-platform authenticators.
- **Risk-based auth:** step-up authentication for sensitive operations; device trust, location, behavior analysis.

**Completion criterion:** MFA/passwordless flow and recovery documented.

### 6. Security assessment

- **Token theft:** XSS, CSRF, token leakage in logs/URLs; mitigation strategies.
- **Session fixation:** session regeneration on login; session invalidation on logout.
- **Brute force:** rate limiting, account lockout, CAPTCHA, anomaly detection.
- **Privilege escalation:** horizontal (user-to-user) and vertical (user-to-admin) checks.
- **Audit trail:** login events, privilege changes, failed auth attempts; retention and redaction.

**Completion criterion:** attack vectors documented with mitigations.

### 7. Provider and protocol selection

- **OAuth2/OIDC providers:** Auth0, Keycloak, Google, Azure AD, AWS Cognito, Okta.
- **SAML:** enterprise SSO integration; assertion consumer service, attribute mapping.
- **Protocol lock-in:** migration path if provider changes; standard claims (sub, email, name).

**Completion criterion:** provider choice justified; lock-in risks named.

## Completion criteria

- the trust boundary is named
- the identity contract includes freshness and failure behavior
- authentication flows are selected per client type
- the authorization model and default-deny behavior are explicit
- MFA/passwordless and session management are designed
- token/session lifecycle and revocation are explicit
- security threats are assessed with mitigations
- lifecycle, audit, and lock-in risks are recorded
