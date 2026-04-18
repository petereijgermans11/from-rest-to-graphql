#!/usr/bin/env bash
# Removes the local dj-console Postgres container so the next `docker run` starts
# with an empty data directory. Use when you want a completely fresh database
# without relying on Hibernate ddl-auto (e.g. after switching ddl-auto away from create).
set -euo pipefail

CONTAINER_NAME="${DJ_CONSOLE_PG_CONTAINER:-dj-console-postgres}"

if docker ps -a --format '{{.Names}}' | grep -qx "$CONTAINER_NAME"; then
  echo "Stopping and removing container: $CONTAINER_NAME"
  docker stop "$CONTAINER_NAME" >/dev/null
  docker rm "$CONTAINER_NAME" >/dev/null
  echo "Done."
else
  echo "No container named $CONTAINER_NAME found (nothing to remove)."
fi

echo ""
echo "Start Postgres again, for example:"
echo "  docker run --name $CONTAINER_NAME \\"
echo "    -e POSTGRES_PASSWORD=postgres \\"
echo "    -e POSTGRES_USER=postgres \\"
echo "    -e POSTGRES_DB=djconsole \\"
echo "    -p 5432:5432 \\"
echo "    -d postgres:18"
echo ""
echo "Then: cd dj-console-api && mvn spring-boot:run"
