import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";
import dotenv from "dotenv";
import dotenvExpand from "dotenv-expand";
import { resolve } from "node:path";
import drizzleConfig from "./drizzle.config";
import { migrate as runMigrations } from "drizzle-orm/node-postgres/migrator";

dotenvExpand.expand(dotenv.config({ path: resolve(".", ".env.development") }));

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function getNewDb() {
  const db = drizzle(pool, { schema });
  return db;
}

async function migrate() {
  const db = await database.getNewDb();
  await runMigrations(db, {
    migrationsFolder: drizzleConfig.out,
  });
}

async function closePool() {
  await pool.end();
}

const database = {
  getNewDb,
  migrate,
  closePool,
};

export default database;
