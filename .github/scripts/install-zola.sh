#!/usr/bin/env bash
set -euo pipefail

# Official release: https://github.com/getzola/zola/releases/tag/v0.23.6
# SHA-256: https://github.com/getzola/zola/releases/expanded_assets/v0.23.6
readonly zola_version="0.23.6"
readonly zola_sha256="8f5132b3522412d04e395e0b25f6d68613ad272a873e54a2b3ebf664873024a4"

if [[ "$(uname -s)" != "Linux" || "$(uname -m)" != "x86_64" ]]; then
  echo "This installer requires a Linux x86_64 GitHub Actions runner." >&2
  exit 1
fi

: "${RUNNER_TEMP:?RUNNER_TEMP must be set by GitHub Actions}"
: "${GITHUB_PATH:?GITHUB_PATH must be set by GitHub Actions}"

zola_install_dir="$(mktemp -d "$RUNNER_TEMP/zola.XXXXXX")"
curl --fail --location --proto '=https' --proto-redir '=https' --tlsv1.2 \
  "https://github.com/getzola/zola/releases/download/v${zola_version}/zola-v${zola_version}-x86_64-unknown-linux-gnu.tar.gz" \
  --output "$zola_install_dir/zola.tar.gz"

printf '%s  %s\n' "$zola_sha256" "$zola_install_dir/zola.tar.gz" \
  | sha256sum --check --strict
tar -xzf "$zola_install_dir/zola.tar.gz" -C "$zola_install_dir" zola

if [[ "$("$zola_install_dir/zola" --version)" != "zola $zola_version" ]]; then
  echo "The downloaded Zola version does not match $zola_version." >&2
  exit 1
fi

printf '%s\n' "$zola_install_dir" >> "$GITHUB_PATH"
"$zola_install_dir/zola" --version
