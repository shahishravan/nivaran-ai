# Human Approval Boundary

## Automatic operations
- Parse and normalize review text
- Extract candidate evidence
- Calculate deterministic demo urgency
- Draft a proposed response
- Suggest an owner and SLA

## Approval-required operations
- Publish a public response
- Authorize refund or compensation
- Contact a customer
- Change an order or account
- Create a consequential operational task
- Seal a production recovery receipt

## Approval record
A production record should include approver identity, timestamp, proposed action, edits, policy version, and resulting tool reference.

## Failure behavior
Expired or missing approval blocks execution. Retries must not duplicate an already-authorized write. The owner can reject or modify every proposal.