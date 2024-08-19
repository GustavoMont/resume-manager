import { bigserial, pgTable, timestamp, varchar } from "drizzle-orm/pg-core";

const commonFields = {
  id: bigserial("id", { mode: "number" }).primaryKey(),
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
  firstName: varchar("first_name", { length: 255 }),
  lastName: varchar("last_name", { length: 255 }),
  email: varchar("email", { length: 255 }).unique(),
  password: varchar("password", { length: 255 }),
  ...commonFields,
});

export const skills = pgTable("skills", {
  name: varchar("name", { length: 100 }).notNull(),
  slug: varchar("slug", { length: 180 }).unique().notNull(),
  userId: bigserial("user_id", { mode: "number" })
    .references(() => users.id)
    .notNull(),
  ...commonFields,
});
