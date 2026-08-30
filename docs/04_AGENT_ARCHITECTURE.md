# Agent Architecture

## Signal Agent
Extracts sentiment, intent, topic, urgency, risk language, and supporting evidence.

## Recovery Agent
Maps structured evidence to the safest next action, escalation policy, owner, and SLA.

## Response Agent
Creates a contextual English or Hinglish draft while preserving recovery decisions and brand-safety rules.

## Orchestrator
Passes structured evidence between stages and records the execution trace. It cannot bypass policy or approval gates.

## Human checkpoint
The business owner remains the final authority for public responses, refunds, customer contact, and operational changes.

## Recovery receipt
Links the original signal, decision, approval, actions, corrective task, and verified outcome.

The Buildathon implementation demonstrates these roles deterministically; production would connect controlled model and business-tool services.