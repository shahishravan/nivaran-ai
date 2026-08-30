# System Architecture

Nivaran is a judge-ready interactive prototype built with Next.js, React, TypeScript, Vinext/Vite, Tailwind CSS, and vendored UI primitives.

## Layers
1. **Experience** — Recovery Command, Decision Lab, Review Inbox, Recovery Control, Customer Intelligence, Evaluation Lab, and Agent System.
2. **Domain** — review evidence, urgency, recovery cases, decision paths, SLAs, corrective tasks, and receipts.
3. **Orchestration** — Signal, Recovery, and Response stages with a human checkpoint.
4. **Proof** — evaluation cases, execution traces, policies, confidence, and recovery evidence.

## Current prototype
The current build runs deterministic synthetic scenarios in the client so judges can reliably reproduce every path.

## Production direction
A production version would move state, authentication, policy enforcement, tool execution, audit records, and model calls to controlled server-side services.