# Deployment runbook

## Before publishing

1. Confirm the change describes the measurable outcome and its claim impact.
2. Run `pnpm format:check`, `pnpm check`, `pnpm build`, and the relevant browser checks locally.
3. Inspect the change on desktop and mobile, including theme, navigation, all changed routes, résumé download, metadata, and 404. For anything substantial, open a pull request first so Pages builds a preview to inspect before `main` moves.
4. Confirm the owner asked for this change. There is no reviewer gate on `main`, so this step is a judgment call rather than an enforced one.

## Release

Push or merge to `main` and allow Cloudflare Pages to deploy. Pages runs `pnpm check && pnpm build`, so a change that fails the claims ledger or any validator is not published and the previous deployment stays live.

## Smoke test

Check Home, Work, one completed case study, the Agentic Data Transfer Optimizer research page, About/Contact, Résumé download, theme switching, keyboard navigation, and security headers. Record the commit and Pages deployment URL in the release note.

## Rollback

Restore the prior Pages deployment or revert the approved merge. Re-run the smoke test and document the cause, impact, and corrective follow-up.
