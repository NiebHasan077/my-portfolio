const webhook = process.env.SLACK_WEBHOOK_URL;
if (!webhook) process.exit(0);

const raw = process.argv[2] ?? "";
let message = raw;
try {
  const parsed = JSON.parse(raw) as Record<string, unknown>;
  message = String(parsed["last-assistant-message"] ?? parsed.message ?? "");
} catch {
  // The notify hook may provide a plain completion string.
}
const prefix = [
  "[NEEDS_DECISION]",
  "[READY_FOR_REVIEW]",
  "[FAILED]",
  "[DEPLOYED]",
].find((candidate) => message.trim().startsWith(candidate));
if (!prefix) process.exit(0);

const cleaned = message
  .replace(/```[\s\S]*?```/g, "[diff/code omitted]")
  .replace(/(secret|token|key|password)\s*[:=]\s*\S+/gi, "$1=[redacted]")
  .replace(/\s+/g, " ")
  .trim()
  .slice(0, 500);
const allowedUrl = cleaned.match(
  /https:\/\/(?:github\.com|[^\s]+\.pages\.dev|chatgpt\.com)\/[^\s)]+/,
)?.[0];
const payload = {
  text: `${prefix} Portfolio automation`,
  blocks: [
    {
      type: "header",
      text: {
        type: "plain_text",
        text: `${prefix} Portfolio automation`,
        emoji: false,
      },
    },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text:
          cleaned.replace(prefix, "").trim() ||
          "A Codex task requires attention.",
      },
    },
    ...(allowedUrl
      ? [
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: `<${allowedUrl}|Open the review surface>`,
            },
          },
        ]
      : []),
  ],
};
const response = await fetch(webhook, {
  method: "POST",
  headers: { "content-type": "application/json" },
  body: JSON.stringify(payload),
});
if (!response.ok)
  throw new Error(`Slack notification failed with ${response.status}`);
