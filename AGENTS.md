# Repository policy for agents

## Mission

Maintain a public, evidence-first AI systems engineering portfolio. Optimize for technical clarity, accessibility, performance, privacy, and accurate professional claims.

## Commands

- Install: `pnpm install --frozen-lockfile` in CI; `pnpm install` locally.
- Type and content checks: `pnpm check`.
- Production build and static validation: `pnpm build`.
- Browser tests: `pnpm test:e2e` after installing Playwright Chromium.
- Weekly audit: `pnpm audit:weekly`.

## Source and claim boundaries

- Raw résumés, SOPs, exports, experiment notes, and private screenshots live in the private sibling vault, never this repository.
- Do not invent dates, metrics, roles, education, employers, publications, awards, links, project outcomes, or research results.
- Every factual or measurable public claim must reference a claims-ledger entry with evidence, `publicSafe: true`, and `approved: true`.
- Draft records may build only when visibly labeled and configured with `publish: false`.
- Never copy an SOP verbatim; use it only to understand motivation and voice.
- Never expose private source documents, credentials, environment data, or diffs in alerts.

## Security boundaries

- Keep the public site static unless a reviewed architectural decision explicitly changes that boundary.
- Preserve content security policy, secure headers, dependency review, secret scanning, and HTTPS-only external links.
- Do not add analytics, cookies, forms, storage, external services, permissions, or billing without explicit approval.
- Never commit `.env*`, webhook URLs, account IDs, tokens, or a public résumé that has not passed claim review.

## Autonomy and approvals

Agents may inspect sources, edit in isolated branches or worktrees, run checks, deploy staging previews, open issues or draft PRs, perform audits, and emit sanitized template alerts.

Agents require explicit approval for production merge/deployment, public claim changes, external permissions or scopes, spending, secrets, destructive actions, public messages outside alert templates, or operating-rule changes.

`main` is unprotected because this is a single-maintainer repository, so nothing mechanical stops an agent from pushing to it. That makes the rule above stricter, not looser: an agent may push to `main` only when the owner asked for that specific change. A green build is not authorization.

## Conventions

- Prefer Astro components and static rendering; add client JavaScript only when it materially improves usability.
- Treat `CONTEXT.md` as a glossary only. Put implementation details in architecture docs and create ADRs only for hard-to-reverse, surprising tradeoffs.
- Keep dependencies intentional and external assets HTTPS-only.
- Keep research status and limitations visible. Do not turn an active workstream into a completed result without evidence and owner approval.

## Definition of done

A change is done when relevant TypeScript and content checks pass, keyboard/mobile/theme states are reviewed, documentation matches behavior, privacy scans pass, and a preview can be inspected. Production work additionally needs the owner's explicit instruction, a successful deployment smoke test, and a verified rollback path.
