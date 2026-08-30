# Scalability

## Functional scale
Separate ingestion, signal analysis, recovery planning, response drafting, approvals, tool execution, and evidence verification.

## Data scale
Partition cases by tenant, index open cases by risk and SLA, archive immutable receipts, and keep analytical aggregates separate from transactional state.

## Execution scale
Use durable queues, bounded concurrency, retries for safe operations, idempotency for writes, and dead-letter review for repeated failure.

## Model scale
Route simple classification and drafting separately from complex recovery planning. Evaluate every model-harness combination before rollout.

## Organizational scale
Policies, approval limits, brand voice, SLAs, and escalation paths must be configurable per business and location.

Scale is not increased autonomy; permission boundaries remain fixed unless explicitly governed.