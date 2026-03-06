import { Hono } from "hono";
import { auth } from "./middleware/auth";
import logs from "./routes/logs";

const app = new Hono();

app.use("/api/*", auth);
app.route("/api/logs", logs);

export default {
  port: Number(process.env.PORT) || 3000,
  fetch: app.fetch,
};
