## Outcome

<!-- State the measurable result. -->

## Evidence

- [ ] Relevant TypeScript and content checks pass
- [ ] Keyboard, mobile, and failure states were reviewed
- [ ] Preview/staging link is attached when behavior is visible
- [ ] No public Claim changed, or every changed Claim has owner approval

## Security and operations

- [ ] No secrets, private sources, visitor data, or unreviewed external service is added
- [ ] CSP, secure headers, dependency review, and privacy boundaries are preserved
- [ ] Rollback path is identified

## Approval boundary

Merging this PR may deploy production. This repository has a single maintainer and no reviewer gate, so the owner merges their own work. Cloudflare Pages runs `pnpm check && pnpm build` before publishing, and a change that fails the claims ledger or any validator is not deployed.
