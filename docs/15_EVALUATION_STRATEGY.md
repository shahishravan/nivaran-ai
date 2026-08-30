# Evaluation Strategy

Nivaran evaluates the complete workflow, not only generated text.

## Dimensions
- Critical-risk recall
- Evidence relevance
- Urgency consistency
- Policy compliance
- Human escalation
- Draft safety and usefulness
- Tool-execution correctness
- Recovery-evidence completeness

## Current prototype
The Evaluation Lab contains 32 deterministic synthetic cases and explicit edge-case slices. These are demonstration results, not production model benchmarks.

## Production method
Use versioned datasets, frozen policies, repeated trials, outcome-based graders, failure taxonomies, and segment-level reporting.

## Release gate
A model or harness update must not reduce safety escalation, approval enforcement, or evidence-completeness performance.