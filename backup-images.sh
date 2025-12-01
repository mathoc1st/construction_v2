#!/usr/bin/env bash
set -euo pipefail

# Folders
UPLOADS_DIR="/home/mathoc1st/uploads/images"
BACKUP_DIR="/home/mathoc1st/backups/images"

# Create backup folder if it doesn't exist
mkdir -p "$BACKUP_DIR"

# Filename with timestamp
BACKUP_FILE="$BACKUP_DIR/uploads_$(date +%F_%H-%M-%S).tar.gz"

# Create a tar.gz archive
tar -czf "$BACKUP_FILE" -C "$UPLOADS_DIR" .

echo "Backup created: $BACKUP_FILE"

# Remove backups older than 7 days
find "$BACKUP_DIR" -type f -name "uploads_*.tar.gz" -mtime +7 -exec rm {} \;

echo "Old image backups deleted (older than 7 days)"