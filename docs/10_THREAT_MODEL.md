# Threat Model

## Assets
Feedback, policies, recovery cases, approval records, operational tasks, evidence, and credentials.

## Threats
- Prompt injection inside review text
- Unauthorized publishing
- Refund or compensation abuse
- Cross-tenant data access
- Sensitive-data leakage
- Duplicate writes during retries
- Tampered evidence
- Overconfident classification
- Exposed credentials

## Mitigations
Treat external text as data, isolate instructions, constrain tools, validate arguments, require approval, use idempotency keys, minimize PII, preserve audit events, and escalate low-confidence or safety-sensitive cases.

Human approval reduces but does not eliminate risk; high-stakes outcomes need evidence and correction mechanisms.