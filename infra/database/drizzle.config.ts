import { defineConfig } from "drizzle-kit";
import { resolve } from "node:path";

export default defineConfig({
  schema: resolve(".", "infra", "database", "schema.ts"),
  out: resolve(".", "infra", "database", "migrations"),
  dialect: "postgresql", // 'postgresql' | 'mysql' | 'sqlite'
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
});
