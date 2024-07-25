import database from "./database";
import { users } from "./schema";
import { faker } from "@faker-js/faker";

async function seedUser() {
  const db = await database.getNewDb();
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
  for (let index = 0; index <= 5; index++) {
    await seedUser();
  }
}

const seeder = {
  seed,
};

export default seeder;
