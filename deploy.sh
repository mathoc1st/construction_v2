#!/usr/bin/env bash
set -euo pipefail

cleanup() {
    echo "Deployment failed! Removing containers..."
    docker compose down
}

# Only run cleanup on errors
trap cleanup ERR

ENV="dev"
COMPOSE_FILE="docker-compose.dev.yml"

for arg in "$@"; do
  case $arg in
    --env=*)
      ENV="${arg#*=}"
      ;;
  esac
done

if [ "$ENV" = "prod" ]; then
  COMPOSE_FILE="docker-compose.yml"
  set -a
  source .env.prod
  set +a
else
  set -a
  source .env.dev
  set +a
fi

echo "Using env: $ENV"
echo "Using compose file: $COMPOSE_FILE"


if [ ! -f "./wait-for-postgres.sh" ]; then
  echo "Error: wait-for-postgres.sh not found"
  exit 1
fi

echo "Starting postgres..."
docker compose -f "$COMPOSE_FILE" up postgres -d

echo "Waiting for Postgres..."
./wait-for-postgres.sh --env="$ENV"

if [ "$ENV" = "prod" ]; then
  echo "Starting backup service..."
  docker compose -f "$COMPOSE_FILE" up pgbackups -d
fi

echo "Building app..."
docker compose -f "$COMPOSE_FILE" build app

echo "Starting app..."
docker compose -f "$COMPOSE_FILE" up app -d

trap - ERR
echo "Deployment successfully finished"