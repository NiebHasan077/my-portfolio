#!/bin/sh
set -eu

ROOT_DIR=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)
NODE_BIN=${PORTFOLIO_NODE_BIN:-node}
exec "$NODE_BIN" "$ROOT_DIR/node_modules/tsx/dist/cli.mjs" "$ROOT_DIR/scripts/notify-slack.ts" "${1:-}"
