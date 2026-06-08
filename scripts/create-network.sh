#!/usr/bin/env bash
set -euo pipefail

NETWORK_NAME="${1:-jamplay-edge}"

if docker network inspect "${NETWORK_NAME}" >/dev/null 2>&1; then
  echo "Network ${NETWORK_NAME} already exists"
else
  docker network create "${NETWORK_NAME}"
  echo "Created network ${NETWORK_NAME}"
fi
