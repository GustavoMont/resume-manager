import { migrate } from "drizzle-orm/node-postgres/migrator";
import database from "./database";
import { Client } from "pg";
import drizzleConfig from "./drizzle.config";

let client: Client;

async function runMigrations() {
  client = await database.getNewClient();
  const db = await database.getNewDb(client);
  await migrate(db, {
    migrationsFolder: drizzleConfig.out,
  });
}

async function onSuccess() {
  console.log("🎉🎉 Migrations applied successfuly 🎉🎉");
  await client.end();
  process.exit(0);
}

async function onFail(err: unknown) {
  console.log("🔴🔴 Error running migrations 🔴🔴");
  console.log("====================================");
  console.error(err);
  console.log("====================================");
  await client.end();
  process.exit(1);
}

runMigrations().then(onSuccess).catch(onFail);
