import "dotenv-expand/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { Client } from "pg";
import * as schema from "./schema";
import dotenv from "dotenv";
import dotenvExpand from "dotenv-expand";
import { resolve } from "node:path";
import drizzleConfig from "./drizzle.config";
import { migrate as runMigrations } from "drizzle-orm/node-postgres/migrator";

dotenvExpand.expand(dotenv.config({ path: resolve(".", ".env.development") }));

async function getNewClient() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });
  await client.connect();
  return client;
}

async function getNewDb(client?: Client) {
  client = client ?? (await getNewClient());
  const db = drizzle(client, { schema });
  return db;
}

async function migrate() {
  const client = await database.getNewClient();
  try {
    const db = await database.getNewDb(client);
    await runMigrations(db, {
      migrationsFolder: drizzleConfig.out,
    });
    client.end();
  } catch (error) {
    client.end();
    throw error;
  }
}

const database = {
  getNewClient,
  getNewDb,
  migrate,
};

export default database;
