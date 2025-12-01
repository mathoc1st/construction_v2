#!/usr/bin/env bash
set -euo pipefail

# Environment variables
POSTGRES_HOST="${POSTGRES_HOST:-localhost}"
POSTGRES_PORT="${POSTGRES_PORT:-5432}"
POSTGRES_USER="${POSTGRES_USER:-construction_user}"
POSTGRES_DB="${POSTGRES_DB:-construction}"

# Healthcheck parameters
RETRIES=5
INTERVAL=10
START_PERIOD=15

sleep $START_PERIOD

for i in $(seq 1 $RETRIES); do
  if pg_isready -h "$POSTGRES_HOST" -p "$POSTGRES_PORT" -U "$POSTGRES_USER" -d "$POSTGRES_DB" > /dev/null 2>&1; then
    echo "Postgres is ready!"
    exit 0
  else
    echo "Postgres is not ready yet. Retrying ($i/$RETRIES)..."
    sleep $INTERVAL
  fi
done