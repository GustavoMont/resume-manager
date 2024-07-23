import { pgTable, timestamp, varchar } from "drizzle-orm/pg-core";

const commonFields = {
  createdAt: timestamp("created_at", {
    mode: "string",
    withTimezone: false,
  }).defaultNow(),
  updatedAt: timestamp("updated_at", {
    mode: "string",
    withTimezone: false,
  }).defaultNow(),
};

export const users = pgTable("users", {
  firstName: varchar("first_name", { length: 255 }),
  lastName: varchar("last_name", { length: 255 }),
  email: varchar("email", { length: 255 }).unique(),
  password: varchar("password", { length: 255 }),
  ...commonFields,
});
