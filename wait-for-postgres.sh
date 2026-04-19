#!/usr/bin/env bash
set -euo pipefail

POSTGRES_HOST="${POSTGRES_HOST:-localhost}"
POSTGRES_PORT="${POSTGRES_PORT:-5432}"
POSTGRES_USER="${POSTGRES_USER:-construction_user}"
POSTGRES_DB="${POSTGRES_DB:-construction}"

RETRIES=10
INTERVAL=5
START_PERIOD=5

echo "Waiting for Postgres $POSTGRES_DB at $POSTGRES_HOST:$POSTGRES_PORT..."

sleep "$START_PERIOD"

for i in $(seq 1 "$RETRIES"); do
  if pg_isready -h "$POSTGRES_HOST" -p "$POSTGRES_PORT" -d "$POSTGRES_DB" > /dev/null 2>&1; then
    echo "Postgres is ready!"
    exit 0
  fi

  echo "Postgres not ready yet ($i/$RETRIES)"
  sleep "$INTERVAL"
done

echo "ERROR: Postgres did not become ready after $RETRIES attempts."
exit 1