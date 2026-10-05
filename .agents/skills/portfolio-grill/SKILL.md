---
name: portfolio-grill
description: Inspect private career and project sources, interview the portfolio owner one decision at a time, refine the portfolio content glossary, and produce an approval-ready brief and claims ledger. Use when planning or revising this AI systems portfolio, selecting case studies, validating public claims, or resolving ambiguous terminology before implementation.
---

# Portfolio Grill

1. Read `AGENTS.md`, `CONTEXT.md`, `docs/content-intake.md`, the current brief, and the claims ledger before asking questions.
2. Inspect user-provided sources first. Ask no factual question that the sources or repository can answer.
3. Use the installed `grilling` and `domain-modeling` skills. Ask exactly one decision question at a time, include a recommended answer, and wait for the response.
4. Separate verifiable facts from the owner’s decisions. Never infer a professional claim from aspiration or tone.
5. Update `CONTEXT.md` immediately when a domain term is resolved. Keep it implementation-free and use canonical terms consistently.
6. Update `docs/portfolio-brief.md` and `content/claims.json` as understanding changes. A claim remains unpublished until its evidence, public-safety, and approval fields are complete.
7. Offer an ADR only when a choice is hard to reverse, surprising without context, and the result of a real tradeoff.
8. Stop before implementation. Summarize the resolved brief, open decisions, unverified claims, and proposed acceptance criteria, then ask the owner to confirm shared understanding.

Treat raw source documents as private: read them from the sibling vault or explicit attachments and never copy them into Git.
