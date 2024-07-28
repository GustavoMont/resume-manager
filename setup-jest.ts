import { sql } from "drizzle-orm";
import database from "infra/database/database";
import seeder from "infra/database/seeder";
import orchestrator from "tests/orchestrator";

beforeAll(async () => {
  await orchestrator.waitForServices();
});

beforeEach(async () => {
  const client = await database.getNewClient();
  const db = await database.getNewDb(client);
  await db.execute(
    sql`drop schema public cascade; drop schema if exists drizzle cascade ; create schema public`,
  );
  await database.migrate();
  await seeder.seed();
  await client.end();
});
