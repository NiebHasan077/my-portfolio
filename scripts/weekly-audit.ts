import { appendFile, mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const site = process.env.SITE_ORIGIN;
const findings: string[] = [];
const checks: string[] = [];

if (!site) {
  checks.push("site: skipped (origin not configured)");
} else {
  try {
    const response = await fetch(site, {
      headers: { origin: site },
    });
    checks.push(`site: HTTP ${response.status}`);
    if (!response.ok) findings.push(`site returned HTTP ${response.status}`);
  } catch (error) {
    findings.push(
      `site unavailable: ${error instanceof Error ? error.message : "unknown error"}`,
    );
  }
}

const report = `# Weekly portfolio audit\n\n- Mode: report-only\n- Generated: ${new Date().toISOString()}\n- Material findings: ${findings.length}\n\n## Checks\n\n${checks.map((item) => `- ${item}`).join("\n")}\n\n## Findings\n\n${findings.length ? findings.map((item) => `- ${item}`).join("\n") : "No material runtime findings. CI, dependency, accessibility, SEO, résumé consistency, and content freshness checks are reported by their dedicated jobs."}\n\nReport-only trial: no draft fixes may be created.\n`;
const outputDir = resolve(process.cwd(), "artifacts");
await mkdir(outputDir, { recursive: true });
await writeFile(resolve(outputDir, "weekly-audit.md"), report);
if (process.env.GITHUB_STEP_SUMMARY)
  await appendFile(process.env.GITHUB_STEP_SUMMARY, report);
if (process.env.GITHUB_OUTPUT)
  await appendFile(
    process.env.GITHUB_OUTPUT,
    `material_findings=${findings.length}\n`,
  );
console.log(report);
