import type { APIRoute } from "astro";
import { publicRoutes } from "../../site.config.mjs";

export const GET: APIRoute = ({ site }) => {
  if (!site) throw new Error("astro.config.mjs must set `site`");
  const urls = publicRoutes
    .map((route) => new URL(route === "/" ? route : `${route}/`, site).href)
    .map((href) => `  <url><loc>${href}</loc></url>`)
    .join("\n");
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
    { headers: { "Content-Type": "application/xml; charset=utf-8" } },
  );
};
