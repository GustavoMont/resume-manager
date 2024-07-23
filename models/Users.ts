import database from "infra/database/database";
import { users } from "infra/database/schema";

async function getAllUsers() {
  const db = await database.getNewDb();
  const result = await db.select().from(users);
  return result;
}

const UserModel = { getAllUsers };

export default UserModel;
