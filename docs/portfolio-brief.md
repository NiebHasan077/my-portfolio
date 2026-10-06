# Portfolio brief

## Status

The content brief was owner-approved on 2026-07-22. The site scope was revised on 2026-07-27 to focus on professional work and research without an interactive experiment. The brief was revised again on 2026-09-20 to match the research-track content approved in the claims ledger on the same date, covering the doctoral fellowship, the research lab and advisor, the two accepted 2026 papers, the guarded-orchestration case study, the Agentic Data Transfer Optimizer research record, the published skill groups, and the Google Scholar link. On 2026-10-05 the owner accepted a redesign plan that balances research and engineering for research-engineer roles, moved the site to one light theme and a single home page with detail pages, published NetBench, author lists, and résumé-level Kona detail, and added a photo and an availability line.

## Audience and outcome

The primary audience is interviewers and hiring teams for early-career AI systems, backend, high-performance networking, and industry research-engineering roles in the United States or remote. A successful visit makes the owner's technical judgment, contributions, evidence, and limitations easy to inspect.

## Positioning

The portfolio connects three evidence threads:

1. AI systems and LLM research with reproducible evaluation and explicit limitations, anchored by the accepted WORKS26 orchestration paper.
2. Backend engineering with reliable service communication, latency-conscious design, and secure operations.
3. Distributed-systems and networking research through the active Agentic Data Transfer Optimizer workstreams.

Public role line: PhD student in Computer Science, Missouri S&T. The home page opens with a three-paragraph bio in `apps/site/src/content/profile.json`: what the owner builds, the three research threads and the lab, then the three years at Kona Software Lab. The availability line reads "Seeking Summer 2027 research and research-engineering internships." and should be revisited after that recruiting season.

## Site scope

- A home page with bio, news, research, publications, experience and education, skills, honors, and service, beside a masthead with photo, role, availability, navigation, and contact links.
- Research pages: NetBench (`/research/netbench/`), guarded orchestration (`/research/guarded-orchestration/`), and the Agentic Data Transfer Optimizer (`/research/agentic-data-transfer-optimizer/`).
- One industry page, Kona Token Trade (`/projects/kona-token-trade/`), and the CV (`/cv/`) with a one-page PDF.
- Bangla sign language recognition appears as a publication with a note on the owner's thesis contribution; its case page was retired.
- Direct email, LinkedIn, GitHub, Google Scholar, and CV links.
- No general blog, contact form, database, cookies, third-party analytics, or interactive experiment.
- Static Cloudflare Pages hosting on a free subdomain.

## Approved identity and contact

- Display name: Nieb Hasan Neom.
- Broad location: Rolla, Missouri, United States.
- Email: `niebhasanneom0@gmail.com`.
- LinkedIn: `https://www.linkedin.com/in/nieb-hasan-neom-72b604201/`.
- GitHub: `https://github.com/NiebHasan077`.
- Google Scholar: `https://scholar.google.com/citations?user=DzIu5CsAAAAJ`.
- Never publish the residential address or phone number from private sources.

## Content direction

### Guarded Scientific Model Orchestration

Present the state-aware orchestration layer that extends LLM function calling with workflow semantics: multi-turn input accumulation, typed-schema argument constraints, blocked execution on incomplete state, and correction, what-if, and reset steering. Label it an accepted research case study tied to the WORKS26 paper at SC26. Do not publish the protein-corona backend figures, collaborator-side results, or any evaluation number until each one has its own approved, public-safe ledger entry.

### Kona Token Trade

Present the owner's share of the platform as the résumé states it: 6 of 30 Spring Boot microservices owned and 15 contributed to, the move from synchronous REST to Kafka messaging, two-factor authentication, payment-gateway integration, and qualitative caching. The Card Personalization System, the Seoul training program, mentoring, and the 2024 promotion appear alongside. Diagrams are labeled as simplified illustrations, not the production topology. Do not publish proprietary details or any performance metric.

### Bangla Sign Language Recognition

Show it as a publication with its author list and DOI, noting that it came from the owner's undergraduate thesis and that the owner designed and evaluated the background-elimination preprocessing step. The paper's accuracy figures stay in the ledger but are no longer displayed.

### Agentic Data Transfer Optimizer - Research in Progress

- Data-transfer runtime - prototype implemented: a sender and receiver architecture using multiprocessing workers and zero-copy file transfer over TCP.
- Bounded agentic control - evaluation in progress: Diagnostic and Decision agents reasoning over live telemetry within hard concurrency limits and oscillation controls.

Publish motivation, questions, methodology, controls, limitations, and current status. Do not claim model superiority, completed evaluation, optimizer effectiveness, dataset scale, or performance results without reproducible public-safe evidence and approval.

### NetBench

NetBench returned to the site on 2026-10-05 with fresh ledger entries, because its benchmark, framework, and analysis code are now public on GitHub and archived on Zenodo. Publish its scale, method, reproducibility, licences, and release status as the repository documents them. Publish no results until the paper is public.

### Supporting evidence

Keep honors and service at the end of the home page and the CV: Codeforces Expert (peak 1629), LeetCode Knight (peak 1895), the KonaSL result, the KUET Technical Scholarship, the SC26 student-volunteer role, reviewing for the Journal of Autonomous Intelligence, and the KUET workshop, Math Club, and sports roles. Do not move these above the research and engineering narrative.

## Acceptance criteria

- Every displayed factual or measurable statement maps to an approved, public-safe ledger entry.
- Research and project pages preserve approved individual-contribution boundaries.
- The Agentic Data Transfer Optimizer remains labeled Research in Progress with separate workstream statuses and no unsupported outcome claim.
- Accepted papers stay labeled accepted, with venue and year, until publication makes a canonical link available. Until then an accepted paper may link to the venue's official accepted-papers listing so a reader can verify it.
- `CredSec` remains labeled Preprint; publication impact factors are omitted.
- The public résumé, rendered pages, metadata, alerts, and downloadable files contain no residential address or phone number.
- Raw source documents remain outside the repository.
- Formatting, content validation, tests, build, responsive review, accessibility, metadata, sitemap, redirect, broken-link, and CV-download checks pass locally before review.
