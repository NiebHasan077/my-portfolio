# GitHub repository setup

After the owner selects the GitHub account and repository name:

1. Create a public repository without initializing files, then add it as `origin` and push `main`.
2. Enable secret scanning, push protection, Dependabot alerts, private vulnerability reporting, and GitHub Actions.
3. Leave `main` unprotected so the owner can push and merge directly. Do not require a pull request or a reviewer.
4. Add the `SITE_ORIGIN` repository variable after the Pages hostname exists. Never add the Slack webhook as a repository secret; local Codex notification owns that path.
5. Connect Cloudflare Pages to the repository with root directory `/`, build command `pnpm check && pnpm build`, and output directory `apps/site/dist`.

Before the first public deployment, set `siteOrigin` in `apps/site/site.config.mjs` to the Pages hostname. That one value drives Astro's `site`, canonical and Open Graph URLs, `robots.txt`, the sitemap, and the static-site validator.

## Why there is no reviewer gate

This is a single-maintainer repository. GitHub does not let an author approve their own pull request, so a "require one non-author approval" rule with bypass disallowed would make merging impossible for the only maintainer. An operating rule that cannot be followed is worse than an honest one.

The release gate therefore lives in the Cloudflare Pages build command rather than in GitHub review. Pages runs `pnpm check && pnpm build`, so the claims ledger, TypeScript, content validation, and static-site validation all run before anything is published. A push that breaks any of them fails the Pages build, nothing is deployed, and the previous deployment stays live.

That keeps the fail-closed property the repository is built around, and puts it somewhere a hurried merge cannot skip. GitHub Actions still runs on every push for history and for the browser, Lighthouse, and dependency-review checks that do not gate the deploy.

Pull requests remain available and are worth using for anything substantial, because they produce a Pages preview deployment to inspect before `main` changes. They are simply not mandatory.
