import { NodePgDatabase } from "drizzle-orm/node-postgres";
import database from "./database";
import { users } from "./schema";
import { faker } from "@faker-js/faker";
import * as schema from "infra/database/schema";

type DatabaseInstance = NodePgDatabase<typeof schema>;

async function seedUser(db: DatabaseInstance) {
  const user = {
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
  };
  const newUser = await db.insert(users).values(user).returning();

  return newUser;
}

async function seed() {
  const db = await database.getNewDb();
  for (let index = 0; index <= 5; index++) {
    await seedUser(db);
  }
}

const seeder = {
  seed,
};

export default seeder;
