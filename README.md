# AI Systems Portfolio

An evidence-first portfolio for AI systems, high-performance networking research, and backend engineering. The site is a static Astro application backed by typed public content and a claims ledger that prevents unapproved professional claims from publishing.

## Workspace

- `apps/site` - static Astro website, typed public content, and browser tests.
- `scripts` - content, static-site, notification, and audit utilities.
- `docs` - approved brief, architecture, operating contract, and runbooks.
- `.agents/skills/portfolio-grill` - repository-scoped evidence interview workflow.

## Local development

Use Node 22+ and pnpm 11.

```bash
pnpm install
pnpm check
pnpm build
pnpm dev
```

The local site starts at `http://localhost:4321` by default.
`pnpm resume:pdf` regenerates the downloadable CV (`apps/site/public/resume.pdf`) from the `/cv/` page's print stylesheet.

## Release boundary

Preview deployments and draft pull requests may be automated. Production merge/deployment, new public professional claims, external permissions, spending, destructive actions, and operating-rule changes require the owner's explicit instruction.

This is a single-maintainer repository, so `main` carries no reviewer gate. The release gate is the Cloudflare Pages build command, `pnpm check && pnpm build`, which runs the claims ledger and every validator before anything is published. A change that fails them is never deployed and the previous deployment stays live.
