# Recovery Contract

Every urgent incident should produce a machine-readable contract.

## Required fields
- Case identifier
- Risk level and evidence
- Responsible owner
- Response SLA
- Allowed customer actions
- Required approval level
- Corrective operational task
- Evidence required for closure
- State and timestamps

## Example
```json
{
  "case_id": "NRC-101",
  "risk": "critical",
  "sla_minutes": 15,
  "approval_required": true,
  "allowed_actions": ["callback", "refund", "replacement"],
  "required_evidence": ["contact_reference", "financial_reference", "corrective_task", "customer_outcome"]
}
```

Missing evidence keeps the case open; an AI-generated reply is never treated as completed recovery.