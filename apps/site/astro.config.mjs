import { defineConfig } from "astro/config";
import { siteOrigin } from "./site.config.mjs";

export default defineConfig({
  site: siteOrigin,
  output: "static",
});
