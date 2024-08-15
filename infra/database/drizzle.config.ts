import { defineConfig } from "drizzle-kit";
import { join } from "node:path";

export default defineConfig({
  schema: join("infra", "database", "schema.ts"),
  out: join("infra", "database", "migrations"),
  dialect: "postgresql", // 'postgresql' | 'mysql' | 'sqlite'
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
});
