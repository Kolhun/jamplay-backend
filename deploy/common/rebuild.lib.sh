#!/usr/bin/env bash

DEPLOY_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SSH_KEY="${DEPLOY_ROOT}/ssh/github_deploy_key"

rebuild_service() {
  if [[ ! -f "${SSH_KEY}" ]]; then
    echo "SSH key not found: ${SSH_KEY}" >&2
    exit 1
  fi

  echo "Using SSH key: ${SSH_KEY}"
  DOCKER_BUILDKIT=1 docker compose build --no-cache --ssh "default=${SSH_KEY}" || exit 1
  docker compose up -d --force-recreate
  docker builder prune -a -f
}
