/**
 * Public identity of the deployed site. This file is the only place to change
 * either value: Astro's `site`, every canonical and Open Graph URL,
 * robots.txt, the sitemap, and the static-site validator all read it.
 */

/**
 * The production origin: `https://`, a hostname, and nothing after it — no
 * path and no trailing slash. Set it to the Cloudflare Pages hostname once the
 * project exists. The static-site validator rejects any other shape.
 */
export const siteOrigin = "https://niebhasanneom.pages.dev";

/**
 * Every public page, in sitemap order. The static-site validator fails the
 * build if a route here was not built, or if a built page is missing here.
 */
export const publicRoutes = [
  "/",
  "/research/netbench",
  "/research/guarded-orchestration",
  "/research/agentic-data-transfer-optimizer",
  "/projects/kona-token-trade",
  "/cv",
];
