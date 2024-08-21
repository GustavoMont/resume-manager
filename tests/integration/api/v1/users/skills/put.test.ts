import { faker } from "@faker-js/faker";
import { plainToInstance } from "class-transformer";
import { signup } from "data/services/auth.services";
import CreateSkillDto from "dtos/skills/CreateSkill.dto";
import CreateUserDto from "dtos/users/CreateUser.dto";
import { camelizeKeys, Decamelized } from "humps";
import Jwt from "models/Jwt";
import Skill from "types/Skill";
import requester from "utils/requester";
import slugfier from "utils/slugfy";

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

async function crateSkill(
  access: string,
  payload: Partial<CreateSkillDto> = {},
) {
  const { sub } = Jwt.decode(access);
  const userId = sub ? +sub : 0;

  const { data: skill } = await api.post<Decamelized<Skill>>(
    `/users/${userId}/skills`,
    {
      name: "habilidade",
      ...payload,
    },
    { headers: { Authorization: `Bearer ${access}` } },
  );

  return camelizeKeys<Decamelized<Skill>>(skill);
}

test("should return 401", async () => {
  const { status } = await api.put(`/users/1/skills/1`, {});
  expect(status).toBe(401);
});
test("should return 403", async () => {
  const access = await createUser();
  const { status } = await api.put(
    `/users/1/skills/1`,
    {},
    { headers: { Authorization: `Bearer ${access}` } },
  );
  expect(status).toBe(403);
});
test("should return 404 when skill is not from user", async () => {
  const access = await createUser();
  const { sub } = Jwt.decode(access);
  const userId = sub ? +sub : 0;
  const { status, data: errors } = await api.put(
    `/users/${userId}/skills/1`,
    { name: "habilidade" },
    { headers: { Authorization: `Bearer ${access}` } },
  );
  expect(status).toBe(404);
  expect(Array.isArray(errors)).toBeTruthy();
  const [error] = errors;
  expect(error.message).toBe("Habilidade não encontrada");
});
test("should return 400 when send wrong name", async () => {
  const access = await createUser();
  const { id } = await crateSkill(access);
  const { sub } = Jwt.decode(access);
  const userId = sub ? +sub : 0;

  const { status, data: errors } = await api.put(
    `/users/${userId}/skills/${id}`,
    { name: "a2" },
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
test("should return 400 when slug match with another user skill", async () => {
  const access = await createUser();
  const payload = { name: "Habilijhonson" };
  await crateSkill(access, payload);
  const { id } = await crateSkill(access);
  const { sub } = Jwt.decode(access);
  const userId = sub ? +sub : 0;

  const { status, data: errors } = await api.put(
    `/users/${userId}/skills/${id}`,
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

test("should not update user_id field", async () => {
  const access = await createUser();
  const { id, name } = await crateSkill(access);
  const { sub } = Jwt.decode(access);
  const userId = sub ? +sub : 0;

  const payload = { user_id: 2 };
  const { status, data } = await api.put(
    `/users/${userId}/skills/${id}`,
    payload,
    { headers: { Authorization: `Bearer ${access}` } },
  );

  expect(status).toBe(200);
  expect(data.name).toBe(name);
  expect(data.id).toBe(id);
  expect(data.slug).toBe(slugfier.generateSlug(`${name}-${userId}`));
  expect(data.user_id).toBe(userId);
});

test("should return 200", async () => {
  const access = await createUser();

  const { id, createdAt } = await crateSkill(access);
  const { sub } = Jwt.decode(access);
  const userId = sub ? +sub : 0;

  const payload = { name: "Nova" };

  const { status, data } = await api.put(
    `/users/${userId}/skills/${id}`,
    payload,
    { headers: { Authorization: `Bearer ${access}` } },
  );

  expect(status).toBe(200);
  expect(data.name).toBe(payload.name);
  expect(data.id).toBe(id);
  expect(data.slug).toBe(slugfier.generateSlug(`${payload.name}-${userId}`));
  expect(data.user_id).toBe(userId);
  expect(data.updated_at).not.toBe(createdAt);
  expect(data.created_at).toBe(createdAt);
});
