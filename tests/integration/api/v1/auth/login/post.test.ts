import { faker } from "@faker-js/faker";
import requester from "utils/requester";
import authTestUtils from "utils/tests/auth";

const api = requester.createTestRequester();

test("should return 401 when email is wrong", async () => {
  const loginBody = {
    email: "email@email.com",
    password: faker.internet.password(),
  };
  await authTestUtils.createUser({ password: loginBody.password });
  const { status } = await api.post("/auth/login", loginBody);
  expect(status).toBe(401);
});

test("should return 401 when password is wrong", async () => {
  const email = faker.internet.email();
  await authTestUtils.createUser({ email });
  const loginBody = {
    email,
    password: faker.internet.password(),
  };
  const { status } = await api.post("/auth/login", loginBody);
  expect(status).toBe(401);
});

test("should return 200 and access token", async () => {
  const loginBody = {
    email: faker.internet.email(),
    password: faker.internet.password({ length: 10, prefix: "0" }),
  };
  await authTestUtils.createUser(loginBody);
  const { status, data } = await api.post("/auth/login", loginBody);

  expect(status).toBe(200);
  expect(data.access).toBeDefined();
  expect(data.access.length).toBeGreaterThan(15);
});
