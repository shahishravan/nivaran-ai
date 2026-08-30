# Security Policy

## Supported scope
Nivaran is currently a synthetic Buildathon prototype. It does not process production customer data or execute real publishing, refund, order, or helpdesk actions.

## Reporting a vulnerability
Do not publish credentials, private data, or exploit details in a public issue. Contact the repository owner through the private contact method associated with the hackathon submission and include:
- affected commit and surface;
- reproduction steps;
- expected and observed behavior;
- potential customer or business impact;
- suggested containment, if known.

## Response priorities
Credential exposure, unauthorized action, cross-tenant access, sensitive-data leakage, evidence tampering, and approval bypass are treated as critical.

## Secret handling
Never commit environment files, API keys, tokens, private customer data, or deployment credentials. Rotate any secret that may have entered logs or history.

## Production note
Client-side judge access is not production authentication. Production deployment requires server-side identity, authorization, isolation, auditing, and retention controls.
