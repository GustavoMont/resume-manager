import database from "./database";
import { users } from "./schema";
import { faker } from "@faker-js/faker";

async function seedUser() {
  const db = await database.getNewDb();
  const newUser = await db
    .insert(users)
    .values({
      fullName: faker.person.fullName(),
    })
    .returning();

  return newUser;
}

async function seed() {
  for (let index = 0; index <= 5; index++) {
    await seedUser();
  }
}

const seeder = {
  seed,
};

export default seeder;
