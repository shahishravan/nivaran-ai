# Security Model

## Prototype boundary
The judge login is a client-side convenience gate, not production authentication. The demonstration uses synthetic data and contains no real customer secret.

## Production controls
- Server-side authentication and role authorization
- Secret storage outside client bundles
- Tenant isolation
- Least-privilege tool permissions
- Approval for consequential writes
- Encryption in transit and at rest
- Append-only audit events
- Rate limits and retention controls

## Action classes
Read-only analysis may run automatically. Publishing, refunds, direct contact, export, and operational changes require authorization.

Nivaran demonstrates safe product behavior; it does not claim the prototype is production security.