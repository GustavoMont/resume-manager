import { faker } from "@faker-js/faker";
import Jwt from "models/Jwt";
import requester from "utils/requester";
import authTestUtils from "utils/tests/auth";
import skillsTestUtils from "utils/tests/skills";

const api = requester.createTestRequester();

async function createUserSkills(access: string) {
  for (let index = 0; index < 5; index++) {
    await skillsTestUtils.createSkill(access, {
      name: faker.person.firstName(),
    });
  }
}

describe("list all users skills", () => {
  test("should block unauthorized user", async () => {
    const { status } = await api.get(`/users/1/skills`);
    expect(status).toBe(401);
  });
  test("should return 403 when see another user skills", async () => {
    const accesToken = await authTestUtils.createUser();

    const decodedToken = Jwt.decode(accesToken);
    const { sub = 1 } =
      typeof decodedToken === "string" ? { sub: 1 } : decodedToken;

    const { status } = await api.get(`/users/${+sub - 1}/skills`, {
      headers: { Authorization: `Bearer ${accesToken}` },
    });
    expect(status).toBe(403);
  });
  test("should list all user skills", async () => {
    const accesToken = await authTestUtils.createUser();
    const userId = authTestUtils.getUserIdFromToken(accesToken);

    await createUserSkills(accesToken);

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
    const accesToken = await authTestUtils.createUser();

    const decodedToken = Jwt.decode(accesToken);
    const { sub = 1 } =
      typeof decodedToken === "string" ? { sub: 1 } : decodedToken;

    const { status } = await api.get(`/users/${+sub - 1}/skills/7`, {
      headers: { Authorization: `Bearer ${accesToken}` },
    });
    expect(status).toBe(403);
  });
  test("should return 404 for not found skills", async () => {
    const accesToken = await authTestUtils.createUser();

    const userId = authTestUtils.getUserIdFromToken(accesToken);

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
    const accesToken = await authTestUtils.createUser();

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
    const accesToken = await authTestUtils.createUser();
    const userId = authTestUtils.getUserIdFromToken(accesToken);

    const skill = await skillsTestUtils.createSkill(accesToken);

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
