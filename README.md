# Nivaran AI

**The Review-to-Recovery OS for local businesses.**

Nivaran converts public customer feedback into a safe decision, an owned recovery workflow, an operational correction, and evidence that the customer outcome was actually resolved.

Built for the Product Space **AI Product Buildathon — Problem Statement 08**.

## Demo access

- Login ID: `judge`
- Password: `nivaran2026`
- No signup, email verification, or social login is required.

The login is intentionally a client-side convenience gate for hackathon evaluation. It is not presented as production security; real authentication would be implemented server-side.

## Why Nivaran is different

Most feedback tools stop at sentiment, themes, summaries, or ticket prioritization. Nivaran closes the loop:

`Signal → Decision → Action → Evidence → Recovery`

| Typical feedback product | Nivaran |
|---|---|
| Classifies sentiment | Explains the risk evidence |
| Drafts a reply | Compares the consequence of multiple actions |
| Creates a ticket | Assigns an owner, SLA, customer action, and operational correction |
| Marks the ticket closed | Requires outcome evidence before recovery is complete |
| Automates a response | Keeps human approval at the decision boundary |

## Product surfaces

1. **Recovery Command** — runs the complete review-to-proof mission.
2. **Decision Lab** — compares ignore, reply-only, and full-recovery paths.
3. **Review Inbox** — ranks synthetic multi-source feedback by urgency.
4. **Recovery Control** — tracks owner, SLA, customer action, root-cause fix, and evidence.
5. **Customer Intelligence** — surfaces recurring operational patterns.
6. **Evaluation Lab** — exposes benchmark slices, edge cases, and safety boundaries.
7. **Agent System** — makes orchestration, confidence, policies, and human checkpoints visible.

## Agent architecture

- **Signal Agent:** sentiment, topic, intent, urgency, and evidence extraction.
- **Recovery Agent:** policy-aware next-best action and escalation path.
- **Response Agent:** contextual English or Hinglish draft.
- **Human checkpoint:** the business owner authorizes customer-facing and operational actions.
- **Recovery receipt:** links the incident, approval, action, correction, and verified outcome.

## Run locally

Prerequisites: Node.js `>=22.13.0`.

```bash
npm ci
npm run dev
```

Production validation:

```bash
npm run build
npm test
```

## Technology

- Next.js 16 + React 19 + TypeScript
- Vinext/Vite for Cloudflare-compatible deployment
- Tailwind CSS and vendored Shadcn UI primitives
- Lucide icons
- Deterministic synthetic demo logic; no private customer data

## Responsible-AI boundary

- No response is auto-published.
- Safety ambiguity is escalated for human verification.
- Confidence and decision evidence remain visible.
- The included evaluation scores describe a deterministic synthetic prototype, not production accuracy.
- All names, reviews, metrics, and outcomes in the demo are synthetic.

## Submission assets

- [DEMO_SCRIPT.md](DEMO_SCRIPT.md) — a judge-focused 3–4 minute walkthrough.
- [SUBMISSION_CHECKLIST.md](SUBMISSION_CHECKLIST.md) — final Product Space checks.
- Public GitHub repository containing this complete source.
- Public demo video and public deployed product links.

## License

MIT — see [LICENSE](LICENSE).
