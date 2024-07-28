import { bigserial, pgTable, timestamp, varchar } from "drizzle-orm/pg-core";

const commonFields = {
  createdAt: timestamp("created_at", {
    withTimezone: false,
    mode: "string",
  }).defaultNow(),
  updatedAt: timestamp("updated_at", {
    withTimezone: false,
    mode: "string",
  }).defaultNow(),
};

export const users = pgTable("users", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  firstName: varchar("first_name", { length: 255 }),
  lastName: varchar("last_name", { length: 255 }),
  email: varchar("email", { length: 255 }).unique(),
  password: varchar("password", { length: 255 }),
  ...commonFields,
});
