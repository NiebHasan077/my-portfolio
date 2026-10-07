import { access, readFile, readdir, stat } from "node:fs/promises";
import { relative, resolve, sep } from "node:path";
import { gzipSync } from "node:zlib";
import { publicRoutes, siteOrigin } from "../apps/site/site.config.mjs";

const root = process.cwd();
const dist = resolve(root, "apps/site/dist");
const routes: string[] = publicRoutes;
const errors: string[] = [];

if (!/^https:\/\/[a-z0-9-]+(\.[a-z0-9-]+)+$/i.test(siteOrigin))
  errors.push(
    `siteOrigin must be https:// plus a hostname, with no path or trailing slash: ${siteOrigin}`,
  );

const routeFile = (route: string) =>
  route === "/"
    ? resolve(dist, "index.html")
    : resolve(dist, route.slice(1), "index.html");

for (const route of routes) {
  const file = routeFile(route);
  let html = "";
  try {
    html = await readFile(file, "utf8");
  } catch {
    errors.push(`Missing built route ${route}`);
    continue;
  }
  if (!/<title>[^<]+<\/title>/.test(html)) errors.push(`${route} has no title`);
  if (!/<meta name="description" content="[^"]+"/.test(html))
    errors.push(`${route} has no description`);
  if (!html.includes(`<link rel="canonical" href="${siteOrigin}/`))
    errors.push(`${route} has no canonical URL on ${siteOrigin}`);

  for (const match of html.matchAll(/href="(\/[^"]*)"/g)) {
    const href = match[1]!;
    if (href.startsWith("/#") || href === "/favicon.svg") continue;
    const path = href.split("#")[0]!;
    const target = /\.[a-z0-9]+$/i.test(path)
      ? resolve(dist, path.slice(1))
      : routeFile(path || "/");
    try {
      await access(target);
    } catch {
      errors.push(`${route} links to missing ${href}`);
    }
  }
}

const [robots, sitemap, links, publicFiles] = await Promise.all([
  readFile(resolve(dist, "robots.txt"), "utf8"),
  readFile(resolve(dist, "sitemap.xml"), "utf8"),
  readFile(resolve(root, "apps/site/src/content/links.json"), "utf8"),
  readdir(resolve(dist)),
]);
if (!robots.includes(`Sitemap: ${siteOrigin}/sitemap.xml`))
  errors.push("robots.txt does not name the built sitemap");
for (const route of routes) {
  const loc = `${siteOrigin}${route === "/" ? "/" : `${route}/`}`;
  if (!sitemap.includes(`<loc>${loc}</loc>`))
    errors.push(`Sitemap omits ${route}`);
}

// A page that was built but never listed in publicRoutes would be missing from
// the sitemap and from every check above, so find built pages independently.
const builtPages = (await readdir(dist, { recursive: true }))
  .filter((file) => file === "index.html" || file.endsWith(`${sep}index.html`))
  .map((file) => {
    const dir = relative(dist, resolve(dist, file, ".."));
    return dir ? `/${dir.split(sep).join("/")}` : "/";
  });
for (const page of builtPages)
  if (!routes.includes(page))
    errors.push(
      `Built page ${page} is missing from publicRoutes in site.config.mjs`,
    );
const resume = (
  JSON.parse(links) as Array<{ kind: string; available: boolean; href: string }>
).find((link) => link.kind === "resume");
const resumeFile = resume?.href.replace(/^\//, "") ?? "";
if (resume?.available && !publicFiles.includes(resumeFile))
  errors.push(`Résumé is marked available but ${resume.href} is absent`);
if (!resume?.available && publicFiles.some((file) => file.endsWith(".pdf")))
  errors.push("A PDF is present while the résumé link is gated");

// Old addresses redirect through public/_redirects. Each target must be a
// built page, and no source may shadow a page that still exists.
const redirects = (await readFile(resolve(dist, "_redirects"), "utf8"))
  .split("\n")
  .map((line) => line.trim())
  .filter((line) => line && !line.startsWith("#"))
  .map((line) => line.split(/\s+/));
for (const [source, target, status] of redirects) {
  if (!source || !target || !["301", "302", "308"].includes(status ?? ""))
    errors.push(`Malformed redirect: ${source} ${target} ${status}`);
  const path = (target ?? "").split("#")[0]!.replace(/(.)\/$/, "$1");
  const isFile =
    /\.[a-z0-9]+$/i.test(path) && publicFiles.includes(path.slice(1));
  if (!routes.includes(path) && !isFile)
    errors.push(
      `Redirect ${source} points at ${target}, which is not a public page`,
    );
  const shadowed = source?.replace(/(.)\/$/, "$1");
  if (shadowed && builtPages.includes(shadowed))
    errors.push(`Redirect source ${source} shadows a built page`);
}

// Visitors should read about the work, not about how the site vets its claims.
// The vocabulary below belongs in the repository, never in rendered text.
const internalTerms = [
  /public[- ]safe/i,
  /claims? ledger/i,
  /approved claims?/i,
  /evidence[- ]boundary/i,
  /evidence[- ]first/i,
  /intentionally absent/i,
  /effectiveness claims?/i,
  /approval state/i,
  /built as evidence/i,
  /owner approval/i,
];
// Every figure a visitor reads must appear in an approved claim, so a number
// cannot slip into prose without evidence. Years, versions, identifiers, SVG
// drawings, code and citation blocks, and figures marked as dataset samples or
// illustrations are exempt.
const approvedText = (
  JSON.parse(
    await readFile(resolve(root, "apps/site/src/content/claims.json"), "utf8"),
  ) as Array<{ statement: string; approved: boolean }>
)
  .filter((claim) => claim.approved)
  .map((claim) => claim.statement)
  .join(" ")
  .replace(/(\d),(\d)/g, "$1$2");
const numbersIn = (text: string) =>
  text
    .replace(
      /doi:\S+|arXiv\S*|\bv?\d+\.\d+\.\d+\b|NB-[A-Z]+-\d+-q\d+|\d{4}\.\d{4,5}/g,
      " ",
    )
    .replace(/(\d),(\d)/g, "$1$2")
    .match(/\d+(?:\.\d+)?/g) ?? [];

const htmlFiles = (await readdir(dist, { recursive: true })).filter((file) =>
  file.endsWith(".html"),
);
const scriptBudget = 30_000;
for (const file of htmlFiles) {
  const html = await readFile(resolve(dist, file), "utf8");
  const description =
    html.match(/<meta name="description" content="([^"]*)"/)?.[1] ?? "";
  const text = html
    .replace(/<script[\s\S]*?<\/script>/g, " ")
    .replace(/<style[\s\S]*?<\/style>/g, " ")
    .replace(/<[^>]+>/g, " ");
  for (const term of internalTerms)
    if (term.test(text) || term.test(description))
      errors.push(`${file} shows internal wording matching ${term}`);

  // Scripts: only bundled modules from /_astro/, never inline code.
  let scriptBytes = 0;
  for (const script of html.matchAll(
    /<script\b([^>]*)>([\s\S]*?)<\/script>/g,
  )) {
    const attrs = script[1]!;
    if (/type="application\/ld\+json"/.test(attrs)) continue;
    const src = attrs.match(/src="(\/_astro\/[^"]+\.js)"/)?.[1];
    if (!src || script[2]!.trim())
      errors.push(
        `${file} has an inline or third-party script; the policy allows only /_astro/ modules`,
      );
    else
      scriptBytes += gzipSync(
        await readFile(resolve(dist, src.slice(1))),
      ).length;
  }
  if (scriptBytes > scriptBudget)
    errors.push(
      `${file} loads ${scriptBytes} bytes of compressed script; the budget is ${scriptBudget}`,
    );

  if (file === "404.html") continue;
  const visible = html
    .replace(/<head>[\s\S]*?<\/head>/, " ")
    .replace(/<script[\s\S]*?<\/script>/g, " ")
    .replace(/<svg[\s\S]*?<\/svg>/g, " ")
    .replace(
      /<figure[^>]*data-(?:dataset|illustrative)[\s\S]*?<\/figure>/g,
      " ",
    )
    .replace(/<code[\s\S]*?<\/code>/g, " ")
    .replace(/<pre[\s\S]*?<\/pre>/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&[a-z]+;|&#\d+;/g, " ");
  for (const number of new Set(numbersIn(visible))) {
    const value = Number(number);
    if (value < 10 && !number.includes(".")) continue;
    if (/^(19[89]\d|20[0-3]\d)$/.test(number)) continue;
    if (!approvedText.includes(number))
      errors.push(
        `${file} shows the figure ${number}, which no approved claim contains`,
      );
  }
}
const jsFiles = (await readdir(dist, { recursive: true })).filter(
  (file) => /\.m?js$/.test(file) && !file.startsWith(`_astro${sep}`),
);
if (jsFiles.length)
  errors.push(
    `dist contains JavaScript outside /_astro/: ${jsFiles.join(", ")}`,
  );

const ogBytes = (await stat(resolve(dist, "og.jpg"))).size;
if (ogBytes > 200_000)
  errors.push(`og.jpg is ${ogBytes} bytes; keep the social image under 200 KB`);

if (errors.length)
  throw new Error(
    `Static validation failed:\n${[...new Set(errors)].join("\n")}`,
  );
console.log(
  `Validated ${routes.length} routes, ${redirects.length} redirects, internal links, metadata, robots, sitemap, wording, figures, scripts, and résumé gate.`,
);
