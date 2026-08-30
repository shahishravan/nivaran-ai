# Nivaran Recovery Harness

A model can recommend an action. The Recovery Harness controls whether that action is allowed, approved, executed, observed, and verified.

## Responsibilities
- Normalize untrusted review input.
- Maintain case state across recovery stages.
- Provide only approved tools to each agent.
- Enforce confidence floors and escalation rules.
- Pause before consequential actions.
- Retry safe reads without duplicating writes.
- Record decisions, policy checks, approvals, and results.
- Require evidence before closure.

## Loop
Observe → analyze → propose → evaluate policy → request approval → execute → verify → close or escalate.

## Product moat
Nivaran's durable value is its recovery policies, permission boundaries, historical outcomes, and verifiable receipts—not dependence on one model.