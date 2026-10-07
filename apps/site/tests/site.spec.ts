import { expect, test } from "@playwright/test";

const pages = [
  "/",
  "/about/",
  "/publications/",
  "/research/netbench/",
  "/research/guarded-orchestration/",
  "/research/agentic-data-transfer-optimizer/",
  "/projects/kona-token-trade/",
  "/projects/card-personalization/",
  "/projects/loadlens/",
  "/cv/",
];
const navLabels = ["Work", "Publications", "About", "CV"];

test("home page leads with the name, the idea, and the work", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Nieb Hasan Neom",
  );
  await expect(
    page.getByText("the model proposes and the system decides"),
  ).toBeVisible();
  const work = page.locator("#work");
  for (const title of [
    "NetBench",
    "Guarded orchestration",
    "Agentic Data Transfer Optimizer",
    "Kona Token Trade",
    "Card Personalization System",
    "LoadLens",
  ])
    await expect(
      work.getByRole("heading", { level: 3, name: title, exact: true }),
    ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Résumé (PDF)" }).first(),
  ).toHaveAttribute("href", "/Nieb_Hasan_Neom_Resume.pdf");
});

test("navigation is visible on every page", async ({ page }) => {
  for (const path of pages) {
    await page.goto(path);
    const nav = page.getByRole("navigation", { name: "Main" });
    for (const label of navLabels)
      await expect(
        nav.getByRole("link", { name: label, exact: true }),
      ).toBeVisible();
  }
});

test("no page scrolls sideways from 320 to 1440 px", async ({ page }, info) => {
  test.skip(info.project.name !== "chromium", "viewport sweep runs once");
  for (const width of [320, 390, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const path of pages) {
      await page.goto(path);
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - window.innerWidth,
      );
      expect(overflow, `${path} at ${width}px`).toBeLessThanOrEqual(0);
    }
  }
});

test("menu links reach their pages", async ({ page }) => {
  await page.goto("/research/netbench/");
  const nav = page.getByRole("navigation", { name: "Main" });
  await nav.getByRole("link", { name: "Publications", exact: true }).click();
  await expect(page).toHaveURL(/\/publications\/$/);
  await expect(
    nav.getByRole("link", { name: "Publications", exact: true }),
  ).toHaveAttribute("aria-current", "page");
  await nav.getByRole("link", { name: "Work", exact: true }).click();
  await expect(page).toHaveURL(/\/#work$/);
  await expect(page.locator("#work")).toBeInViewport();
});

test("keyboard focus is visible", async ({ page }, info) => {
  test.skip(info.project.name !== "chromium", "keyboard check runs on desktop");
  await page.goto("/");
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("link", { name: "Skip to content" }),
  ).toBeFocused();
  const about = page
    .getByRole("navigation", { name: "Main" })
    .getByRole("link", { name: "About", exact: true });
  await about.focus();
  expect(
    await about.evaluate((el) => getComputedStyle(el).outlineStyle),
  ).not.toBe("none");
});

test("NetBench explorer filters real questions", async ({ page }) => {
  await page.goto("/research/netbench/");
  const explorer = page.locator("[data-explorer]");
  await explorer.scrollIntoViewIfNeeded();
  const count = explorer.locator("[data-count]");
  await expect(count).toContainText("233 matching · 233 scored · 9 excluded");
  await explorer
    .getByRole("button", { name: /^Concurrency Tuning and Scaling/ })
    .click();
  await expect(count).toContainText("9 matching");
  await explorer.getByRole("button", { name: "Hard", exact: true }).click();
  await expect(explorer.locator(".nb-item .hard").first()).toBeVisible();
  await page.getByLabel("Show the excluded items").check();
  await explorer
    .getByRole("button", { name: /^Concurrency Tuning and Scaling/ })
    .click();
  await explorer.getByRole("button", { name: "All levels" }).click();
  await expect(count).toContainText("242 matching");
});

test("guarded orchestration replay blocks until inputs are complete", async ({
  page,
}) => {
  await page.goto("/research/guarded-orchestration/");
  const replay = page.locator("[data-replay]");
  const gate = replay.locator("[data-gate]");
  await replay.getByRole("button", { name: "Next step" }).click();
  await expect(gate).toHaveText("Blocked: 3 inputs missing");
  await replay.getByRole("button", { name: "Next step" }).click();
  await expect(gate).toHaveText("Guard passed: the model runs once");
  for (let i = 0; i < 3; i++)
    await replay.getByRole("button", { name: "Next step" }).click();
  await expect(gate).toHaveText("Blocked: 7 inputs missing");
  await expect(page.getByText(/98\.5|87\.13|178/)).toHaveCount(0);
  await expect(
    page.getByRole("link", { name: /GitHub/ }).first(),
  ).toHaveAttribute(
    "href",
    "https://github.com/arif-zaman/pCorona-Orchestration",
  );
});

test("Kona pages animate the Kafka change and show no performance figures", async ({
  page,
}) => {
  await page.goto("/projects/kona-token-trade/");
  const kafka = page.locator("[data-kafka]");
  for (let i = 0; i < 5; i++)
    await kafka.getByRole("button", { name: "Next step" }).click();
  await expect(kafka.locator('[data-say="after"]')).toHaveText(
    "It reads the waiting event, and the trade completes.",
  );
  await expect(page.getByText(/\d+(\.\d+)?\s?%/)).toHaveCount(0);
  await page.goto("/projects/card-personalization/");
  await expect(page.getByText(/\d+(\.\d+)?\s?%/)).toHaveCount(0);
});

test("publications filter and offer citations", async ({ page }) => {
  await page.goto("/publications/");
  await page.getByRole("button", { name: "Software", exact: true }).click();
  await expect(page.locator(".pub:visible")).toHaveCount(1);
  await page.getByRole("button", { name: "All", exact: true }).click();
  await expect(page.locator(".pub:visible")).toHaveCount(6);
  await page.locator(".pub").first().getByText("Cite").click();
  await expect(page.locator(".pub").first().locator("pre")).toContainText(
    "@inproceedings{neom2026guarded",
  );
});

test("rating charts respond to the keyboard", async ({ page }) => {
  await page.goto("/about/");
  const chart = page.locator("[data-chart]").first();
  await chart.locator("svg").focus();
  await page.keyboard.press("Home");
  await expect(chart.locator("[data-readout]")).toContainText("Sep 2017");
  await expect(page.locator(".gallery img")).toHaveCount(3);
});

test("external links are HTTPS", async ({ page }) => {
  for (const path of pages) {
    await page.goto(path);
    const hrefs = await page
      .locator("a[href]")
      .evaluateAll((links) =>
        links.map((link) => link.getAttribute("href") ?? ""),
      );
    for (const href of hrefs)
      expect(href, `${path} links to ${href}`).toMatch(
        /^(\/|#|https:\/\/|mailto:)/,
      );
  }
});

test("CV offers the résumé and prints to one page", async ({ page }, info) => {
  await page.goto("/cv/");
  await expect(
    page.getByRole("link", { name: /download résumé/i }),
  ).toHaveAttribute("href", "/Nieb_Hasan_Neom_Resume.pdf");
  test.skip(
    info.project.name !== "chromium",
    "PDF output needs desktop Chromium",
  );
  await page.emulateMedia({ media: "print" });
  await expect(
    page.getByRole("heading", { name: "Nieb Hasan Neom" }),
  ).toBeVisible();
  const pdf = await page.pdf({
    preferCSSPageSize: true,
    printBackground: true,
  });
  const pageCount = (pdf.toString("latin1").match(/\/Type\s*\/Page[^s]/g) ?? [])
    .length;
  expect(pageCount).toBe(1);
});
