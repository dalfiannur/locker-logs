# Locker Logs API

REST API for logging locker access events. Built with Hono, Bun, Drizzle ORM, and PostgreSQL.

## Setup

### Docker

```bash
API_SECRET=my-secret PORT=3000 docker compose up -d
```

Run migrations:

```bash
DATABASE_URL=postgresql://locker:locker@localhost:3000/locker_logs bun run db:generate
DATABASE_URL=postgresql://locker:locker@localhost:3000/locker_logs bun run db:migrate
```

### Local Development

1. Copy `.env.example` to `.env` and configure values
2. Install dependencies: `bun install`
3. Run migrations: `bun run db:generate && bun run db:migrate`
4. Start server: `bun run dev`

## Environment Variables

| Variable | Description | Default |
|---|---|---|
| `DATABASE_URL` | PostgreSQL connection string | — |
| `PORT` | Server port | `3000` |
| `API_SECRET` | Bearer token for authorization | — |

## Authentication

All endpoints require a Bearer token:

```
Authorization: Bearer <API_SECRET>
```

## Endpoints

### POST `/api/logs`

Create a log entry.

**Body:**

```json
{
  "t": "2026-03-06T10:00:00Z",
  "no": 5,
  "id": "ABC123"
}
```

| Field | Type | Description |
|---|---|---|
| `t` | string (ISO 8601) | Timestamp of the event |
| `no` | number | Locker number |
| `id` | string | Card UID |

### GET `/api/logs`

Get log entries with optional filters and cursor-based pagination.

**Query Parameters:**

| Param | Type | Description |
|---|---|---|
| `locker` | number | Filter by locker number |
| `card_uid` | string | Filter by card UID |
| `timestamp_from` | string (ISO 8601) | Timestamp range start |
| `timestamp_to` | string (ISO 8601) | Timestamp range end |
| `received_from` | string (ISO 8601) | Received range start |
| `received_to` | string (ISO 8601) | Received range end |
| `cursor` | number | ID of last item from previous page |
| `limit` | number | Page size (default: 20, max: 100) |

**Response:**

```json
{
  "data": [
    {
      "id": 1,
      "timestamp": "2026-03-06T10:00:00.000Z",
      "locker": 5,
      "cardUid": "ABC123",
      "received": "2026-03-06T10:00:05.000Z"
    }
  ],
  "next_cursor": null
}
```
