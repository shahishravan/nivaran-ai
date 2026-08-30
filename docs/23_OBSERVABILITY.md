# Observability

## Run-level signals
- Run identifier and duration
- Agent stage and state transition
- Model and policy version
- Tool name, status, and latency
- Confidence and escalation reason
- Approval wait time
- Retry count and idempotency key
- Evidence completeness
- Final recovery outcome

## Product signals
Recovery SLA attainment, approval rate, edited-draft rate, escalation rate, repeated issue frequency, evidence-completion time, and reopened cases.

## Safety signals
Blocked tool calls, prompt-injection detections, PII redactions, low-confidence routes, and unauthorized-action attempts.

## Principle
Logs should explain what happened without storing unnecessary customer text or credentials.