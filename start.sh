#!/usr/bin/env bash
# Jalanin log server LOKAL buat test controller.
# Postgres di port 5544 (hindari bentrok dgn 5432 yg udah kepake di server).
set -e
cd "$(dirname "$0")"

echo "[1/5] (re)create Postgres container di :5544"
docker rm -f locker-pg 2>/dev/null || true
docker run -d --name locker-pg \
  -e POSTGRES_USER=locker -e POSTGRES_PASSWORD=locker -e POSTGRES_DB=locker_logs \
  -p 5544:5432 postgres:16 >/dev/null

echo "[2/5] nunggu Postgres siap..."
until docker exec locker-pg pg_isready -U locker -d locker_logs >/dev/null 2>&1; do
  sleep 1
done

echo "[3/5] bun install"
bun install

echo "[4/5] generate + migrate schema"
bun run db:generate
bun run db:migrate

echo "[5/5] start server di :1212 (Ctrl+C buat stop)"
bun run dev
