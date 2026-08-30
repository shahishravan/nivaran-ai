# Data Model

## ReviewSignal
Source, rating, text reference, sentiment, intent, topic, urgency, confidence, and evidence spans.

## RecoveryCase
Case ID, customer reference, risk, owner, SLA, current state, selected action, and timestamps.

## DecisionPath
Path ID, expected consequence, required steps, unresolved risk, trust movement, and readiness.

## Approval
Approver, proposed action, edits, decision, policy version, and timestamp.

## CorrectiveTask
Operational cause, owner, due date, status, and verification reference.

## RecoveryEvidence
Evidence type, source reference, verifier, timestamp, and integrity metadata.

## RecoveryReceipt
Links signal, decision, approval, customer action, correction, evidence, and final outcome.