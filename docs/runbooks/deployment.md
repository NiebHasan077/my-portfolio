# Deployment runbook

## Before publishing

1. Confirm the change describes the measurable outcome and its claim impact.
2. Run `pnpm format:check`, `pnpm check`, `pnpm build`, and the relevant browser checks locally.
3. Inspect the change on desktop and mobile, including navigation, all changed routes, the CV download, metadata, redirects, and 404. For anything substantial, open a pull request first so Pages builds a preview to inspect before `main` moves.
4. Confirm the owner asked for this change. There is no reviewer gate on `main`, so this step is a judgment call rather than an enforced one.

## Release

Push or merge to `main` and allow Cloudflare Pages to deploy. Pages runs `pnpm check && pnpm build`, so a change that fails the claims ledger or any validator is not published and the previous deployment stays live.

## Smoke test

Check Home on a laptop and a phone, each research page, the Kona page, the CV and its PDF download, that `/work` and `/resume` redirect, keyboard navigation, and that the response carries the `Content-Security-Policy` header. Record the commit and Pages deployment URL in the release note.

## Rollback

Restore the prior Pages deployment or revert the approved merge. Re-run the smoke test and document the cause, impact, and corrective follow-up.
