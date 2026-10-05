# Content intake and claims review

Raw sources belong in the private sibling folder `../Portfolio-Sources/`, not in Git. Provide only the files needed for the current supervised intake.

## Intake order

1. Résumé in editable form and PDF.
2. LinkedIn export/text and public URL.
3. GitHub profile plus relevant repositories.
4. Three to five target job descriptions.
5. Structured evidence for potential case studies.
6. Optional research notes, papers, SOP, publications, talks, certifications, awards, and education evidence.

For every case study, capture the problem, personal role, architecture, constraints, difficult decisions, dates, measured outcomes, code/demo sources, and public-safe media. Treat an SOP as voice/motivation evidence, never as a factual record or text to publish verbatim.

## Claims workflow

Every public factual or measurable statement receives a unique `claimId` in `apps/site/src/content/claims.json`. It may be published only when:

- `evidence` identifies a source available to the owner/reviewer;
- `publicSafe` is `true`;
- `approved` is `true`;
- `lastVerified` is an ISO date;
- the referring record uses the exact same `claimId`.

An agent may clarify phrasing without changing meaning. New facts, numbers, dates, titles, or scope always require approval. Draft records must keep `publish: false` and remain absent from public rendering.

## Never ingest or publish

Addresses, phone numbers, reference contact details, credentials, keys, confidential employer material, unapproved internal metrics, unreleased proprietary work, or visitor data.
