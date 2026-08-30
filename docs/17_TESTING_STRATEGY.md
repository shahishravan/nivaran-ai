# Testing Strategy

## Automated checks
- Production build completes.
- Server-rendered output contains critical product copy.
- Interactive components expose required controls.
- Recovery, approval, and synthetic-data boundaries remain present.
- Documentation and submission assets are committed.

## Manual checks
- Judge login works without signup.
- Every navigation surface opens.
- Recovery Command reaches a sealed receipt.
- Decision paths can be compared.
- Recovery cases advance correctly.
- Evaluation Lab reruns.
- Light and dark themes remain readable.
- Mobile and desktop layouts remain usable.

## Release rule
Run `npm ci`, `npm run lint`, `npm test`, and an incognito link check before recording or submitting.