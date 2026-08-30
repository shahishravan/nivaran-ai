# Integration Roadmap

## Phase 1: Controlled imports
CSV upload and manual entry remain the safest validation channels.

## Phase 2: Read-only connectors
Google reviews, commerce reviews, support tickets, and survey sources enter through tenant-scoped read permissions.

## Phase 3: Operational systems
CRM, helpdesk, order, refund, and task systems are exposed as narrow typed tools.

## Phase 4: Approved writes
Public reply, refund, contact, and operational correction tools require policy checks, explicit approval, and idempotency.

## Connector contract
Every connector declares read/write scope, tenant boundary, data fields, rate limits, error behavior, audit events, and revocation process.

No connector should receive broader credentials than its specific recovery task requires.