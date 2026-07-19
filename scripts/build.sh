#!/usr/bin/env bash
set -euo pipefail
NODE_VERSION="$(cat "$(dirname "$0")/../.nvmrc")"
export PATH="$HOME/.nvm/versions/node/v${NODE_VERSION}/bin:$PATH"
exec npx astro build "$@"
