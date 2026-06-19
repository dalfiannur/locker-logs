import { Hono } from "hono";
import { auth } from "./middleware/auth";
import logs from "./routes/logs";

const app = new Hono();

app.use("/api/*", auth);
app.route("/api/logs", logs);

// controller rfid nembak event ke sini (liat send_eventlog di firmware)
app.use("/event-log", auth);
app.route("/event-log", logs);

export default {
  port: Number(process.env.PORT) || 3000,
  fetch: app.fetch,
};
