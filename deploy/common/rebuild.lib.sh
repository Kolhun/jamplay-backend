#!/usr/bin/env bash

DEPLOY_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SSH_KEY="${DEPLOY_ROOT}/ssh/github_deploy_key"
ENV_FILE="${DEPLOY_ROOT}/.env"

rebuild_service() {
  local service="$1"
  local compose_file="${DEPLOY_ROOT}/${service}/docker-compose.yml"

  if [[ ! -f "${SSH_KEY}" ]]; then
    echo "SSH key not found: ${SSH_KEY}" >&2
    exit 1
  fi

  if [[ ! -f "${ENV_FILE}" ]]; then
    echo "Env file not found: ${ENV_FILE}" >&2
    echo "Copy .env.example to .env and edit GIT_REPO" >&2
    exit 1
  fi

  if [[ ! -f "${compose_file}" ]]; then
    echo "Compose file not found: ${compose_file}" >&2
    exit 1
  fi

  echo "Using SSH key: ${SSH_KEY}"
  echo "Using env file: ${ENV_FILE}"
  echo "Service: ${service}"

  DOCKER_BUILDKIT=1 docker compose \
    -f "${compose_file}" \
    --env-file "${ENV_FILE}" \
    build --no-cache --ssh "default=${SSH_KEY}" || exit 1

  docker compose \
    -f "${compose_file}" \
    --env-file "${ENV_FILE}" \
    up -d --force-recreate

  docker builder prune -a -f
}
