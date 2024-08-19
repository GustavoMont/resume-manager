import { NodePgDatabase } from "drizzle-orm/node-postgres";
import database from "./database";
import { users } from "./schema";
import { faker } from "@faker-js/faker";
import * as schema from "infra/database/schema";
import { User } from "types/User";

type DatabaseInstance = NodePgDatabase<typeof schema>;

async function seedUser(db: DatabaseInstance, customInfo: Partial<User> = {}) {
  const user = {
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    ...customInfo,
  };
  const [newUser] = await db.insert(users).values(user).returning();

  return newUser;
}

async function seedSkills(db: DatabaseInstance, userId: number) {
  const skill = {
    name: faker.person.firstName(),
    slug: faker.lorem.slug(),
    userId,
  };
  const [newSkill] = await db.insert(schema.skills).values(skill).returning();

  return newSkill;
}

async function seed() {
  const db = await database.getNewDb();
  seedUser(db, { email: "arquiteto@email.com" }).catch(() => null);

  for (let index = 0; index <= 5; index++) {
    const user = await seedUser(db);
    await seedSkills(db, user.id);
  }
}

const seeder = {
  seed,
  seedSkills,
  seedUser,
};

export default seeder;
