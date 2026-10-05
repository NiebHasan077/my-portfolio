# Autonomy contract

## Agent-owned work

Agents may inspect repository/source state, create isolated branches or worktrees, edit code and documentation, run checks, deploy staging previews, open issues and draft pull requests, execute weekly audits, prepare low-risk draft fixes, and send sanitized status alerts using the approved templates.

## Human approval gates

Explicit approval is required for production merge/deployment, any new or changed professional Claim, new external services/permissions/Slack scopes, security-limit reductions, secrets, spending, destructive actions, public messages outside the alert template, or changes to this contract and `AGENTS.md`.

The owner's explicit instruction is production authorization. This is a single-maintainer repository with no reviewer gate, so there is no second human to sign off and no GitHub “Approve” review to rely on. Agents may not infer authorization from a passing build, a Slack reaction, an earlier approval of different work, or their own judgment that a change is safe.

The automated gate is independent of that authorization and still applies: Cloudflare Pages runs `pnpm check && pnpm build`, so an unapproved or non-public-safe claim fails the deploy rather than reaching the site.

## Goal contract

Long-running goals must state:

- a bounded outcome;
- constraints and prohibited actions;
- objective verification;
- the approval boundary.

Measure the workflow with CI first-pass rate, user interventions, PR rework, review findings, lead time, failed deployments, and rollbacks. Operating rules change only on the owner's explicit instruction, recorded in the decision log.

## Alert contract

Allowed prefixes are `[NEEDS_DECISION]`, `[READY_FOR_REVIEW]`, `[FAILED]`, and `[DEPLOYED]`. Alerts contain only the status, concise summary, required action, and a task/PR/preview link. They exclude prompts, documents, diffs, environment values, visitor data, and secrets.
