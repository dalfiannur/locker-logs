import { createMiddleware } from "hono/factory";

export const auth = createMiddleware(async (c, next) => {
  const header = c.req.header("Authorization");
  const token = header?.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token || token !== process.env.API_SECRET) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  await next();
});
