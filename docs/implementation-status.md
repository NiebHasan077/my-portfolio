# Implementation status

## Implemented locally

- Static Astro portfolio redesigned on 2026-10-05: one home page (bio, news, research, publications, experience, skills, honors, service), detail pages for NetBench, guarded orchestration, the Agentic Data Transfer Optimizer, and Kona Token Trade, a CV page, and a 404. Old `/work`, `/experience`, `/about`, and `/resume` addresses redirect through `public/_redirects`.
- One light theme with self-hosted Source Serif 4 and Source Sans 3. Navigation stays visible at every width, and the site ships no JavaScript.
- Content security policy and security headers in `public/_headers`; styles stay external so the policy forbids inline styles and all scripts.
- Typed public content for identity, news, three research records, two projects, five publications with author lists, the NetBench software release, experience, education, five skill groups, honors, and service.
- Research-track identity published from the ledger: Kummer Innovation and Entrepreneurship Doctoral Fellow, the Computer Systems & Networking Lab and advisor, an anticipated May 2030 graduation, and the accepted WORKS26 and IEEE eScience 2026 papers.
- Claims-ledger validation that fails closed when a published record references an unapproved or non-public-safe claim.
- Web CV and a one-page downloadable PDF generated from its print stylesheet.
- CI for formatting, type/content checks, tests, build validation, browser checks, Lighthouse, dependency review, and weekly report-only audits.
- Pages-only Cloudflare deployment and rollback documentation plus sanitized Slack notification support.

## Deployment

- Source: `github.com/NiebHasan077/my-portfolio`, `main` unprotected by design, secret scanning and push protection enabled.
- Hosting: Cloudflare Pages project `niebhasanneom`, live at `https://niebhasanneom.pages.dev` since 2026-10-05. `siteOrigin` in `apps/site/site.config.mjs` matches it.

## Owner-gated setup remaining

- Enable Dependabot alerts and private vulnerability reporting on the repository; both are off.
- Configure the private Slack webhook and local Codex notifier if desired.
- Review two report-only weekly audits before enabling low-risk draft-fix proposals.

## Held claims and their release trigger

Three entries sit in the ledger with `approved: false`, so no published record may reference them and content validation still passes.

- `project-kona-cache-exclusion` records that no Kona Token Trade performance metric is published. It is an exclusion record and stays unapproved permanently.
- `research-guarded-orchestration-backend` carries the 178-classifier protein-corona backend and its 87.13% AUC-ROC. These are collaborator-side model figures rather than a result of the orchestration layer.
- `research-guarded-orchestration-measurements` carries the 98.5% feature-extraction accuracy across 300 cases and the 300 of 300 reliability scenarios. This is the orchestration layer's own measured result.

Both research entries were held on 2026-09-20 rather than rejected. Neither figure has a source a reader can verify until the WORKS26 proceedings page is public in November 2026, and the case-study page currently earns more from stating the omission than it would gain from an uncheckable number. The resume carries the figures to recruiters in the meantime.

Release trigger: the WORKS26 proceedings page goes live. At that point approve both entries with a citable link, reference them from the guarded-orchestration record, rewrite the Results section on `/research/guarded-orchestration/`, and update the browser assertion in `apps/site/tests/site.spec.ts` that currently requires `98.5%` to be absent.

The application domain itself is now covered by the approved `research-guarded-orchestration-domain` entry, which carries no measured result. It backs the sentence on the case-study page naming protein-corona prediction, which previously had no ledger entry behind it.

## Claims intentionally withheld

- Kona Token Trade performance metrics.
- Comparative results, model superiority, or optimization effectiveness for the Agentic Data Transfer Optimizer until reproducible public-safe evidence is supplied and approved.
- NetBench results. The site publishes the benchmark's scale and method, which the public repository documents, and links the results once the paper is public.
- Collaborator-side and backend evaluation figures behind the accepted orchestration paper.
- Private addresses, phone numbers, test scores, and any unapproved extracurricular detail.

## Local QA baseline

Formatting, TypeScript/content validation, browser tests, production build, internal-link/metadata/sitemap/redirect checks, the visible-wording check, résumé privacy scans, one-page PDF rendering, responsive browser inspection from 320 to 1440 px, and keyboard navigation must pass before review.
