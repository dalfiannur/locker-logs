import { Hono } from "hono";
import { db } from "../db";
import { logs } from "../db/schema";
import { and, eq, gte, lte, lt, desc } from "drizzle-orm";

const app = new Hono();

app.post("/", async (c) => {
  const body = await c.req.json<{
    t: string;
    no: number;
    id: number | string;
    dev_class?: string;
  }>();

  const [log] = await db
    .insert(logs)
    .values({
      timestamp: new Date(body.t),
      locker: body.no,
      cardUid: String(body.id),
      deviceClass: body.dev_class ?? null,
    })
    .returning();

  return c.json(log, 201);
});

app.get("/", async (c) => {
  const {
    locker,
    card_uid,
    device_class,
    timestamp_from,
    timestamp_to,
    received_from,
    received_to,
    cursor,
    limit: limitParam,
  } = c.req.query();

  const limit = Math.min(Number(limitParam) || 20, 100);
  const conditions = [];

  if (locker) conditions.push(eq(logs.locker, Number(locker)));
  if (card_uid) conditions.push(eq(logs.cardUid, card_uid));
  if (device_class) conditions.push(eq(logs.deviceClass, device_class));
  if (timestamp_from) conditions.push(gte(logs.timestamp, new Date(timestamp_from)));
  if (timestamp_to) conditions.push(lte(logs.timestamp, new Date(timestamp_to)));
  if (received_from) conditions.push(gte(logs.received, new Date(received_from)));
  if (received_to) conditions.push(lte(logs.received, new Date(received_to)));
  if (cursor) conditions.push(lt(logs.id, Number(cursor)));

  const result = await db
    .select()
    .from(logs)
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(desc(logs.id))
    .limit(limit + 1);

  const hasMore = result.length > limit;
  const data = hasMore ? result.slice(0, limit) : result;
  const nextCursor = hasMore ? data[data.length - 1].id : null;

  return c.json({ data, next_cursor: nextCursor });
});

export default app;
