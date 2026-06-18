import { Hono } from "hono";
import { auth } from "./middleware/auth";
import logs from "./routes/logs";

const app = new Hono();

app.use("/api/*", auth);
app.route("/api/logs", logs);

// RFID controller posts events to POST /event-log (see firmware send_eventLog)
app.use("/event-log", auth);
app.route("/event-log", logs);

export default {
  port: Number(process.env.PORT) || 3000,
  fetch: app.fetch,
};
