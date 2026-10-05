# Slack notification setup

Slack is an alert surface, never an approval system.

1. Create a private `#codex-portfolio` channel.
2. Install the official Codex Slack app only after GitHub and the Codex cloud environment are configured and their requested scopes are reviewed.
3. Create one incoming webhook restricted to the dedicated channel. Store the URL in macOS Keychain or an injected process environment variable named `SLACK_WEBHOOK_URL`; never put it in the repository or Codex project configuration.
4. Configure the user-level Codex `notify` callback to invoke `scripts/codex-notify.sh`. This user-level edit is deliberately manual and outside repository automation.
5. Test with a sanitized `[READY_FOR_REVIEW]` payload that links to a non-sensitive preview.

The notifier accepts only the four prefixes in the autonomy contract and drops other completions. GitHub approval remains the production gate.
