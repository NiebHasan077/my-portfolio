import { expect, test } from "@playwright/test";

test("approved identity and selected work are visible", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "networks and distributed infrastructure",
  );
  await expect(page.getByText("NIEB HASAN NEOM / AI SYSTEMS")).toBeVisible();
  await page.getByRole("link", { name: /explore selected work/i }).click();
  await expect(page).toHaveURL(/\/work$/);
  await expect(
    page.getByRole("heading", {
      name: "Guarded Scientific Model Orchestration",
    }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Kona Token Trade" }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", {
      name: "Bangla Sign Language Recognition",
      exact: true,
    }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Agentic Data Transfer Optimizer" }),
  ).toBeVisible();
});

test("case studies, supporting evidence, and resume are reachable", async ({
  page,
}) => {
  await page.goto("/work/kona-token-trade");
  await expect(page.getByText("PUBLIC-SAFE SCOPE")).toBeVisible();
  await expect(page.getByText(/\d+(\.\d+)?\s?%/)).toHaveCount(0);

  await page.goto("/work/guarded-orchestration");
  await expect(page.getByText("WORKS26 @ SC26")).toBeVisible();
  await expect(page.getByText("98.5%", { exact: false })).toHaveCount(0);

  await page.goto("/work/bangla-sign-language");
  await expect(page.getByText("91.67%", { exact: true })).toBeVisible();
  await expect(page.getByText("MULTI-AUTHOR WORK")).toBeVisible();

  await page.goto("/work/agentic-data-transfer-optimizer");
  await expect(page.getByText("NO EFFECTIVENESS CLAIMS")).toBeVisible();

  await page.goto("/experience");
  await expect(
    page.getByText("Computer Systems & Networking Lab"),
  ).toBeVisible();
  await expect(
    page.getByText("Kummer Innovation and Entrepreneurship Doctoral Fellow"),
  ).toBeVisible();

  await page.goto("/about");
  await expect(page.getByText("Codeforces Expert")).toBeVisible();
  await expect(page.getByText("Sports leadership")).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "AI & Agentic Systems" }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: /google scholar/i }),
  ).toHaveAttribute(
    "href",
    "https://scholar.google.com/citations?user=DzIu5CsAAAAJ",
  );

  await page.goto("/resume");
  await expect(
    page.getByRole("heading", { name: "Technical skills" }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: /download pdf/i }),
  ).toHaveAttribute("href", "/resume.pdf");
});

test("résumé is printable", async ({ page }) => {
  await page.goto("/resume");
  await page.emulateMedia({ media: "print" });
  await expect(
    page.getByRole("heading", { name: "Nieb Hasan Neom" }),
  ).toBeVisible();

  if (process.env.RESUME_PDF_OUTPUT) {
    await page.pdf({
      path: process.env.RESUME_PDF_OUTPUT,
      preferCSSPageSize: true,
      printBackground: true,
      tagged: true,
    });
  }
});

test("theme control works by keyboard", async ({ page }) => {
  await page.goto("/");
  const html = page.locator("html");
  const initialTheme = await html.getAttribute("data-theme");
  const toggle = page.getByRole("button", { name: /switch color theme/i });
  await toggle.focus();
  await page.keyboard.press("Enter");
  await expect(html).toHaveAttribute(
    "data-theme",
    initialTheme === "dark" ? "light" : "dark",
  );
});
