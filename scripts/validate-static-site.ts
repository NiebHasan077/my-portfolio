import { access, readFile, readdir } from "node:fs/promises";
import { relative, resolve, sep } from "node:path";
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
if (resume?.available && !publicFiles.includes("resume.pdf"))
  errors.push("Résumé is marked available but resume.pdf is absent");
if (!resume?.available && publicFiles.includes("resume.pdf"))
  errors.push(
    "Unapproved resume.pdf is present while the résumé link is gated",
  );

if (errors.length)
  throw new Error(
    `Static validation failed:\n${[...new Set(errors)].join("\n")}`,
  );
console.log(
  `Validated ${routes.length} routes, internal links, metadata, robots, sitemap, and résumé gate.`,
);
