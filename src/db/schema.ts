import { pgTable, serial, integer, varchar, timestamp } from "drizzle-orm/pg-core";

export const logs = pgTable("logs", {
  id: serial("id").primaryKey(),
  timestamp: timestamp("timestamp").notNull(),
  locker: integer("locker").notNull(),
  cardUid: varchar("card_uid").notNull(),
  received: timestamp("received").notNull().defaultNow(),
});
