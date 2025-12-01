#!/usr/bin/env bash
set -euo pipefail

cleanup() {
    echo "Deployment failed! Removing containers..."
    docker compose down
}

# Only run cleanup on errors
trap cleanup ERR

if [ ! -f "./wait-for-postgres.sh" ]; then
  echo "Error: wait-for-postgres.sh not found"
  exit 1
fi

echo "Starting up the postgres container..."
docker compose up postgres -d 

echo "Waiting for Postgres to be ready..."
# Run the wait-for-postgres script
./wait-for-postgres.sh

echo "Applying prisma migrations..."
docker compose up --build -d prisma-migrate
docker compose run --rm prisma-migrate

echo "Starting up the postgres backup container..."
docker compose up pgbackups -d

echo "Building the app..."
docker compose build app 

echo "Starting the app..."
docker compose up app -d

echo "Deployment successfully finished"

# Remove trap so it doesn’t run on normal exit
trap - ERR