import { faker } from "@faker-js/faker";
import { plainToInstance } from "class-transformer";
import { signup } from "data/services/auth.services";
import CreateUserDto from "dtos/users/CreateUser.dto";
import Jwt from "models/Jwt";
import requester from "utils/requester";

const api = requester.createTestRequester();

async function createUser() {
  const payload = {
    email: faker.internet.email(),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    password: faker.internet.password({ length: 10, prefix: "9" }),
  };
  const { access } = await signup(plainToInstance(CreateUserDto, payload));
  return access;
}

test("should return 401", async () => {
  const { status } = await api.post(`/users/1/skills`);
  expect(status).toBe(401);
});
test("should return 403 to create skills for another user", async () => {
  const access = await createUser();
  const { status } = await api.post(
    `/users/1/skills`,
    {},
    { headers: { Authorization: `Bearer ${access}` } },
  );
  expect(status).toBe(403);
});
test("should return 400", async () => {
  const access = await createUser();
  const { sub } = Jwt.decode(access);
  const userId = sub ? +sub : 0;
  const payload = {
    name: "a2",
  };
  const { status, data: errors } = await api.post(
    `/users/${userId}/skills`,
    payload,
    { headers: { Authorization: `Bearer ${access}` } },
  );
  expect(status).toBe(400);
  expect(Array.isArray(errors)).toBeTruthy();
  const messages: string[] = errors.map(({ message }) => message);
  expect(
    messages.includes("Nome da habilidade deve ter no mínimo 3 letras"),
  ).toBeTruthy();
  expect(
    messages.includes("Nome da habilidade não pode conter números"),
  ).toBeTruthy();
});

test("should return 201", async () => {
  const access = await createUser();
  const { sub } = Jwt.decode(access);
  const userId = sub ? +sub : 0;
  const payload = {
    name: "habilidade",
  };
  const { status, data } = await api.post(`/users/${userId}/skills`, payload, {
    headers: { Authorization: `Bearer ${access}` },
  });
  expect(status).toBe(201);
  expect(data.name).toBe(payload.name);
  expect(data.user_id).toBe(userId);
  expect(data.slug).toBe(`${payload.name}-${userId}`);
});

test("should return 400 for skill already added", async () => {
  const access = await createUser();
  const { sub } = Jwt.decode(access);
  const userId = sub ? +sub : 0;
  const payload = {
    name: "habilidade",
  };
  await api.post(`/users/${userId}/skills`, payload, {
    headers: { Authorization: `Bearer ${access}` },
  });
  const { status, data: errors } = await api.post(
    `/users/${userId}/skills`,
    payload,
    { headers: { Authorization: `Bearer ${access}` } },
  );
  expect(status).toBe(400);
  expect(Array.isArray(errors)).toBeTruthy();
  const messages: string[] = errors.map(({ message }) => message);
  expect(
    messages.includes("Já existe uma habilidade com o mesmo nome"),
  ).toBeTruthy();
});
