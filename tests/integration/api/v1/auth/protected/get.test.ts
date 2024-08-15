import { randomUUID } from "crypto";
import AccessTokenDto from "dtos/auth/Access.dto";
import requester from "utils/requester";

const api = requester.createTestRequester();

test("should block unautheticated user", async () => {
  const { status } = await api.get("/auth/protected");
  expect(status).toBe(401);
});

test("should block invalid token", async () => {
  const { status } = await api.get("/auth/protected", {
    headers: {
      Authorization: `Bearer invalid token`,
    },
  });
  expect(status).toBe(401);
});

test("should allow authenticate user", async () => {
  const signupBody = {
    email: "new_email@email.com",
    first_name: "Primeiro",
    last_name: "Nome",
    password: randomUUID(),
  };
  await api.post("/auth/signup", signupBody);
  const { data: loginResponse } = await api.post<AccessTokenDto>(
    "/auth/login",
    {
      email: signupBody.email,
      password: signupBody.password,
    },
  );
  const { status, data } = await api.get("/auth/protected", {
    headers: {
      Authorization: `Bearer ${loginResponse.access}`,
    },
  });
  expect(status).toBe(200);
  expect(data.has_user).toBeTruthy();
});
