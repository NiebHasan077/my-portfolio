# Incident runbook

1. Confirm the affected route, browser, deployment, and first known failure time.
2. For suspected privacy or credential exposure, stop publishing the affected artifact and use private reporting channels only.
3. Compare the failing deployment with the previous known-good Pages deployment and the source commit.
4. Restore the prior deployment or revert the approved merge when user-facing correctness, privacy, or security is at risk.
5. Re-run navigation, résumé, metadata, asset, content-gate, and security-header checks.
6. Record cause, impact, recovery, and a reviewed prevention change. Never include secrets or private source content in the incident record.
