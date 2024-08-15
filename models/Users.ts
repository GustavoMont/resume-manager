import { eq, getTableColumns } from "drizzle-orm";
import database from "infra/database/database";
import { users } from "infra/database/schema";
import { User } from "types/User";
import Password from "./Password";
import BadRequestException from "exceptions/BadRequestException";
import { plainToInstance } from "class-transformer";
import { UserResponseDto } from "dtos/users/UserResponse.dto";

async function getAllUsers() {
  const db = await database.getNewDb();
  const columns = getTableColumns(users);
  const result = await db.select(columns).from(users);

  return plainToInstance(UserResponseDto, result);
}

async function hashUserPassword(user: User) {
  user.password = await Password.hashPassword(user.password);

  return user;
}

async function getUserByEmail(email: string) {
  const db = await database.getNewDb();
  const [user] = await db.select().from(users).where(eq(users.email, email));
  return user;
}

async function getUserById(id:number) {
  const db = await database.getNewDb();
  const [user] = await db.select().from(users).where(eq(users.id, id));
  return user; 
}


async function isNewUser(email: string) {
  const isUserSignedUp = await getUserByEmail(email);
  if (isUserSignedUp) {
    throw new BadRequestException("Usuário já cadastrado");
  }
}

async function createUser(newUser: User) {
  await isNewUser(newUser.email);
  await hashUserPassword(newUser);
  const db = await database.getNewDb();
  const [user] = await db.insert(users).values(newUser).returning();

  return user;
}

const UserModel = { getAllUsers, createUser, getUserByEmail, getUserById };

export default UserModel;
