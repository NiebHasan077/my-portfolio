import { expect, test } from "@playwright/test";

const pages = [
  "/",
  "/research/netbench/",
  "/research/guarded-orchestration/",
  "/research/agentic-data-transfer-optimizer/",
  "/projects/kona-token-trade/",
  "/cv/",
];
const navLabels = ["Research", "Publications", "Experience", "CV"];

test("home page leads with the name, role, and the work", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Nieb Hasan Neom",
  );
  await expect(page.getByText("PhD student in Computer Science")).toBeVisible();
  for (const name of ["News", "Research", "Publications", "Experience"])
    await expect(
      page.getByRole("heading", { level: 2, name, exact: true }),
    ).toBeVisible();
  for (const title of [
    "NetBench: domain adaptation for networking LLMs",
    "Guarded orchestration for scientific models",
    "Agentic Data Transfer Optimizer",
  ])
    await expect(
      page.getByRole("heading", { level: 3, name: title }),
    ).toBeVisible();
  await expect(
    page.locator(".authors strong", { hasText: "N. H. Neom" }).first(),
  ).toBeVisible();
  await expect(page.locator(".frame button")).toHaveCount(0);
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

test("nav links lead to their sections and the CV", async ({ page }) => {
  await page.goto("/research/netbench/");
  const nav = page.getByRole("navigation", { name: "Main" });
  await nav.getByRole("link", { name: "Experience", exact: true }).click();
  await expect(page).toHaveURL(/\/#experience$/);
  await expect(page.locator("#experience")).toBeInViewport();
  await nav.getByRole("link", { name: "CV", exact: true }).click();
  await expect(page).toHaveURL(/\/cv\/$/);
  await expect(
    nav.getByRole("link", { name: "CV", exact: true }),
  ).toHaveAttribute("aria-current", "page");
});

test("keyboard focus is visible", async ({ page }, info) => {
  test.skip(info.project.name !== "chromium", "keyboard check runs on desktop");
  await page.goto("/");
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("link", { name: "Skip to content" }),
  ).toBeFocused();
  await expect(
    page.getByRole("link", { name: "Skip to content" }),
  ).toBeInViewport();
  const research = page
    .getByRole("navigation", { name: "Main" })
    .getByRole("link", { name: "Research", exact: true });
  await research.focus();
  const outline = await research.evaluate(
    (el) => getComputedStyle(el).outlineStyle,
  );
  expect(outline).not.toBe("none");
});

test("detail pages carry their facts and withhold unpublished results", async ({
  page,
}) => {
  await page.goto("/research/netbench/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "NetBench",
  );
  await expect(
    page.getByRole("link", { name: /zenodo archive/i }),
  ).toHaveAttribute("href", "https://doi.org/10.5281/zenodo.21892017");

  await page.goto("/research/guarded-orchestration/");
  await expect(page.getByText("Accepted · WORKS26 at SC26")).toBeVisible();
  await expect(page.getByText("98.5%", { exact: false })).toHaveCount(0);

  await page.goto("/research/agentic-data-transfer-optimizer/");
  await expect(page.getByText(/^In progress/)).toBeVisible();

  await page.goto("/projects/kona-token-trade/");
  await expect(
    page.getByRole("heading", { name: "From synchronous calls to Kafka" }),
  ).toBeVisible();
  await expect(page.getByText(/\d+(\.\d+)?\s?%/)).toHaveCount(0);
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

test("CV offers the PDF and prints to one page", async ({ page }, info) => {
  await page.goto("/cv/");
  await expect(
    page.getByRole("link", { name: /download pdf/i }),
  ).toHaveAttribute("href", "/resume.pdf");
  test.skip(
    info.project.name !== "chromium",
    "PDF output needs desktop Chromium",
  );
  await page.emulateMedia({ media: "print" });
  await expect(
    page.getByRole("heading", { name: "Nieb Hasan Neom" }),
  ).toBeVisible();
  const pdf = await page.pdf({
    path: process.env.RESUME_PDF_OUTPUT,
    preferCSSPageSize: true,
    printBackground: true,
    tagged: true,
  });
  const pageCount = (pdf.toString("latin1").match(/\/Type\s*\/Page[^s]/g) ?? [])
    .length;
  expect(pageCount).toBe(1);
});
