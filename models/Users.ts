import { getTableColumns } from "drizzle-orm";
import database from "infra/database/database";
import { users } from "infra/database/schema";

async function getAllUsers() {
  const db = await database.getNewDb();
  const columns = getTableColumns(users);
  delete columns.password;
  const result = await db.select(columns).from(users);
  return result;
}

const UserModel = { getAllUsers };

export default UserModel;
