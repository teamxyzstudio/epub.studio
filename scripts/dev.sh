#!/usr/bin/env bash
# The shell default `node` on this machine is v12, which Astro cannot run.
# Pin the toolchain to the Node version in .nvmrc before handing off to Astro.
set -euo pipefail
NODE_VERSION="$(cat "$(dirname "$0")/../.nvmrc")"
NODE_BIN="$HOME/.nvm/versions/node/v${NODE_VERSION}/bin"
[ -d "$NODE_BIN" ] || { echo "Node v${NODE_VERSION} not installed (nvm install ${NODE_VERSION})" >&2; exit 1; }
export PATH="$NODE_BIN:$PATH"
exec npx astro dev --port "${PORT:-4321}"
