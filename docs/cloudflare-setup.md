# Cloudflare Pages setup

The portfolio needs only Cloudflare Pages on the free plan.

## Project settings

- Connect the GitHub repository to Pages.
- Build command: `pnpm check && pnpm build`.
- Build output directory: `apps/site/dist`.
- Node version: read automatically from `.node-version` in the repository root.
- Environment variable `PNPM_VERSION` = `11.9.0`. The build image ships an older pnpm and does not read the version from `package.json` or the lockfile, so without this the install fails.
- After the project exists, set `siteOrigin` in `apps/site/site.config.mjs` to its `*.pages.dev` hostname and push.
- Production branch: `main`.
- Keep preview deployments enabled for pull requests.

No server-side runtime, database, analytics product, or runtime secret is required.

## Release

Push or merge to `main` and Pages deploys it. The build command is the release gate: `pnpm check && pnpm build` runs the claims ledger, TypeScript, content validation, and static-site validation, so an unapproved claim or a broken route fails the build and is never published. Run the deployment smoke checks afterwards and inspect Home, About, Publications, one research page with its interactive piece, the CV and the résumé download, one old address such as `/resume.pdf` redirecting, the 404 route, and the response headers.

## Rollback

Restore the previous Pages deployment or revert the approved merge. Confirm the main routes, public résumé, metadata, and security headers after rollback.
