import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? "github" : "list",
  use: { baseURL: "http://127.0.0.1:4321" },
  webServer: {
    // Test the production build, not the dev server: the scripts and data
    // files behave as they will on the live site. ASTRO_PREVIEW_BACKGROUND
    // keeps the server in the foreground; without it Astro detaches the
    // preview when it thinks an AI agent started it, and Playwright then
    // reports that the server exited early.
    command:
      "pnpm build && ASTRO_PREVIEW_BACKGROUND=1 pnpm preview --host 127.0.0.1 --port 4321",
    url: "http://127.0.0.1:4321",
    reuseExistingServer: !process.env.CI,
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile", use: { ...devices["Pixel 7"] } },
  ],
});
