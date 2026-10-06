import { defineConfig } from "astro/config";
import { siteOrigin } from "./site.config.mjs";

export default defineConfig({
  site: siteOrigin,
  output: "static",
  // Stylesheets stay external so the content security policy in public/_headers
  // can forbid inline styles.
  build: { inlineStylesheets: "never" },
});
