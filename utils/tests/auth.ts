import { faker } from "@faker-js/faker";
import { plainToInstance } from "class-transformer";
import { signup } from "data/services/auth.services";
import CreateUserDto from "dtos/users/CreateUser.dto";
import Jwt from "models/Jwt";

async function createUser(customPayload: Partial<CreateUserDto> = {}) {
  const payload = {
    email: faker.internet.email(),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    password: faker.internet.password({ length: 10, prefix: "9" }),
    ...customPayload,
  };
  const { access } = await signup(plainToInstance(CreateUserDto, payload));
  return access;
}

function getUserIdFromToken(token: string): number {
  const { sub } = Jwt.decode(token);
  const userId = sub ? +sub : 0;
  return userId;
}

const authTestUtils = {
  createUser,
  getUserIdFromToken,
};

export default authTestUtils;
