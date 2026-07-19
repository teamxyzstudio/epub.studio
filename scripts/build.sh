#!/usr/bin/env bash
# Build wrapper that works in both environments:
#  - this dev machine, where the default `node` is v12 and the real one lives
#    in nvm (pinned by .nvmrc)
#  - CI / cloud sandboxes (routines), which have no nvm but ship a modern node
set -euo pipefail

NODE_VERSION="$(cat "$(dirname "$0")/../.nvmrc")"
NVM_BIN="$HOME/.nvm/versions/node/v${NODE_VERSION}/bin"

if [ -d "$NVM_BIN" ]; then
  export PATH="$NVM_BIN:$PATH"
elif command -v node >/dev/null 2>&1; then
  MAJOR="$(node -p 'process.versions.node.split(".")[0]')"
  if [ "$MAJOR" -lt 18 ]; then
    echo "Node >=18 required (found $(node -v)); install ${NODE_VERSION} via nvm or use a newer runtime" >&2
    exit 1
  fi
else
  echo "No node found; install Node ${NODE_VERSION}" >&2
  exit 1
fi

exec npx astro build "$@"
