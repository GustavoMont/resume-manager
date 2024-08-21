import { faker } from "@faker-js/faker";
import { AxiosError } from "axios";
import { plainToInstance } from "class-transformer";
import { login, LoginPayload, signup } from "data/services/auth.services";
import CreateUserDto from "dtos/users/CreateUser.dto";
import database from "infra/database/database";
import seeder from "infra/database/seeder";
import Jwt from "models/Jwt";
import requester from "utils/requester";

const api = requester.createTestRequester();

async function createUser() {
  try {
    const signupBody = {
      email: faker.internet.email(),
      password: faker.internet.password({ length: 10, prefix: "9" }),
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
    };
    await signup(plainToInstance(CreateUserDto, signupBody));
    return signupBody;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.log(error.response.data);
    }

    throw error;
  }
}

async function createUserSkills(userId: number) {
  for (let index = 0; index < 5; index++) {
    await createUserSkill(userId);
  }
}

async function createUserSkill(userId: number) {
  const db = await database.getNewDb();
  return await seeder.seedSkills(db, userId);
}

async function authenticateUser(loginPayload: LoginPayload) {
  const { access } = await login(loginPayload);
  return access;
}

describe("list all users skills", () => {
  test("should block unauthorized user", async () => {
    const { status } = await api.get(`/users/1/skills`);
    expect(status).toBe(401);
  });
  test("should return 403 when see another user skills", async () => {
    const { email, password } = await createUser();
    const accesToken = await authenticateUser({ email, password });

    const decodedToken = Jwt.decode(accesToken);
    const { sub = 1 } =
      typeof decodedToken === "string" ? { sub: 1 } : decodedToken;

    const { status } = await api.get(`/users/${+sub - 1}/skills`, {
      headers: { Authorization: `Bearer ${accesToken}` },
    });
    expect(status).toBe(403);
  });
  test("should list all user skills", async () => {
    const { email, password } = await createUser();
    const accesToken = await authenticateUser({ email, password });

    const decodedToken = Jwt.decode(accesToken);
    const { sub = 1 } =
      typeof decodedToken === "string" ? { sub: 1 } : decodedToken;

    const userId = +sub;

    await createUserSkills(userId);

    const { status, data: skillsList } = await api.get(
      `/users/${userId}/skills`,
      {
        headers: { Authorization: `Bearer ${accesToken}` },
      },
    );
    expect(status).toBe(200);
    expect(skillsList).toHaveLength(5);
  });
});

describe("retrieve one skill", () => {
  test("should block unauthorized user", async () => {
    const { status } = await api.get(`/users/1/skills/1`);
    expect(status).toBe(401);
  });
  test("should return 403 when see another user skills", async () => {
    const { email, password } = await createUser();
    const accesToken = await authenticateUser({ email, password });

    const decodedToken = Jwt.decode(accesToken);
    const { sub = 1 } =
      typeof decodedToken === "string" ? { sub: 1 } : decodedToken;

    const { status } = await api.get(`/users/${+sub - 1}/skills/7`, {
      headers: { Authorization: `Bearer ${accesToken}` },
    });
    expect(status).toBe(403);
  });
  test("should return 404 for not found skills", async () => {
    const { email, password } = await createUser();
    const accesToken = await authenticateUser({ email, password });

    const decodedToken = Jwt.decode(accesToken);
    const { sub = 1 } =
      typeof decodedToken === "string" ? { sub: 1 } : decodedToken;

    const userId = +sub;

    const { status, data: errors } = await api.get(
      `/users/${userId}/skills/99999999`,
      {
        headers: { Authorization: `Bearer ${accesToken}` },
      },
    );
    expect(status).toBe(404);
    expect(Array.isArray(errors)).toBeTruthy();
    const [error] = errors;
    expect(error).toStrictEqual({
      message: "Habilidade não encontrada",
    });
  });
  test("should return 404 when skills is from another user", async () => {
    const { email, password } = await createUser();
    const accesToken = await authenticateUser({ email, password });

    const decodedToken = Jwt.decode(accesToken);
    const { sub = 1 } =
      typeof decodedToken === "string" ? { sub: 1 } : decodedToken;

    const userId = +sub;

    const { status, data: errors } = await api.get(
      `/users/${userId}/skills/1`,
      {
        headers: { Authorization: `Bearer ${accesToken}` },
      },
    );
    expect(status).toBe(404);
    expect(Array.isArray(errors)).toBeTruthy();
    const [error] = errors;
    expect(error).toStrictEqual({
      message: "Habilidade não encontrada",
    });
  });
  test("should retrieve user skill", async () => {
    const { email, password } = await createUser();
    const accesToken = await authenticateUser({ email, password });

    const decodedToken = Jwt.decode(accesToken);
    const { sub = 1 } =
      typeof decodedToken === "string" ? { sub: 1 } : decodedToken;

    const userId = +sub;

    const skill = await createUserSkill(userId);

    const { status, data: userSkill } = await api.get(
      `/users/${userId}/skills/${skill.id}`,
      {
        headers: { Authorization: `Bearer ${accesToken}` },
      },
    );
    expect(status).toBe(200);
    expect(userSkill).toStrictEqual(skill);
  });
});
