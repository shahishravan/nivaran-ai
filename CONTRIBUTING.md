# Contributing

## Principles
Contributions must preserve Nivaran's visible human-approval boundary, synthetic-data honesty, recovery evidence contract, and accessible light/dark experience.

## Setup
```bash
npm ci
npm run dev
```

## Before proposing a change
```bash
npm run lint
npm test
```

## Commit guidance
Use focused commits with descriptive messages. Do not create empty commits, backdate activity, combine unrelated work, or claim planned behavior is implemented.

## Product changes
Document the user problem, acceptance criteria, safety impact, evaluation case, and prototype-versus-production boundary.

## Security
Never commit secrets or private customer information. Follow `SECURITY.md` for responsible reporting.

## Pull requests
Explain what changed, why it matters, how it was tested, screenshots for visual changes, and any limitations or follow-up work.
