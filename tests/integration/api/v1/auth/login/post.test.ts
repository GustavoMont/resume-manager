import { faker } from "@faker-js/faker";
import { UserResponseDto } from "dtos/users/UserResponse.dto";
import requester from "utils/requester";

const api = requester.createTestRequester();

test("should return 401 when email is wrong", async () => {
  const loginBody = {
    email: "email@email.com",
    password: "password",
  };
  const { status } = await api.post("/auth/login", loginBody);
  expect(status).toBe(401);
});

test("should return 401 when password is wrong", async () => {
  const {
    data: [user],
  } = await api.get<UserResponseDto[]>("/users");
  const loginBody = {
    email: user.email,
    password: "password",
  };
  const { status } = await api.post("/auth/login", loginBody);
  expect(status).toBe(401);
});

test("should return 200 and access token", async () => {
  const signupBody = {
    email: faker.internet.email(),
    password: faker.internet.password(),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
  };
  await api.post<UserResponseDto>("/auth/signup", signupBody);
  const loginBody = {
    email: signupBody.email,
    password: signupBody.password,
  };
  const { status, data } = await api.post("/auth/login", loginBody);

  expect(status).toBe(200);
  expect(data.access).toBeDefined();
  expect(data.access.length).toBeGreaterThan(15);
});
