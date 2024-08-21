import { faker } from "@faker-js/faker";
import { plainToInstance } from "class-transformer";
import { signup } from "data/services/auth.services";
import CreateUserDto from "dtos/users/CreateUser.dto";
import { camelizeKeys, Decamelized } from "humps";
import Jwt from "models/Jwt";
import Skill from "types/Skill";
import requester from "utils/requester";

const api = requester.createTestRequester();

async function createUser() {
  const signupBody = {
    email: faker.internet.email(),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    password: faker.internet.password({ length: 10, prefix: "9" }),
  };
  const { access } = await signup(plainToInstance(CreateUserDto, signupBody));
  return access;
}

async function createSkill(access: string) {
  const { sub } = Jwt.decode(access);
  const userId = sub ? +sub : 0;

  const { data: skill } = await api.post<Decamelized<Skill>>(
    `/users/${userId}/skills`,
    { name: "habilidade" },
    { headers: { Authorization: `Bearer ${access}` } },
  );

  return camelizeKeys<Decamelized<Skill>>(skill);
}

test("should return 401", async () => {
  const { status } = await api.delete(`/users/1/skills/1`);
  expect(status).toBe(401);
});
test("should return 403", async () => {
  const access = await createUser();
  const { status } = await api.delete(`/users/1/skills/1`, {
    headers: { Authorization: `Bearer ${access}` },
  });
  expect(status).toBe(403);
});
test("should return 404 when try to delete skill from another user", async () => {
  const access = await createUser();
  const { sub } = Jwt.decode(access);
  const userId = sub ? +sub : 0;
  const { status, data: errors } = await api.delete(
    `/users/${userId}/skills/1`,
    {
      headers: { Authorization: `Bearer ${access}` },
    },
  );
  expect(status).toBe(404);
  expect(Array.isArray(errors)).toBeTruthy();
  const [error] = errors;
  expect(error.message).toBe("Habilidade não encontrada");
});
test("should return 404 skill does not exist", async () => {
  const access = await createUser();
  const { sub } = Jwt.decode(access);
  const userId = sub ? +sub : 0;
  const { status, data: errors } = await api.delete(
    `/users/${userId}/skills/199999999`,
    {
      headers: { Authorization: `Bearer ${access}` },
    },
  );
  expect(status).toBe(404);
  expect(Array.isArray(errors)).toBeTruthy();
  const [error] = errors;
  expect(error.message).toBe("Habilidade não encontrada");
});
test("should return 204", async () => {
  const access = await createUser();
  const { id } = await createSkill(access);
  const { sub } = Jwt.decode(access);
  const userId = sub ? +sub : 0;
  const { status } = await api.delete(`/users/${userId}/skills/${id}`, {
    headers: { Authorization: `Bearer ${access}` },
  });
  expect(status).toBe(204);
});
