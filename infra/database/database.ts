import "dotenv-expand/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { Client } from "pg";
import * as schema from "./schema";
import dotenv from "dotenv";
import dotenvExpand from "dotenv-expand";
import { resolve } from "node:path";

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

export default {
  getNewClient,
  getNewDb,
};
