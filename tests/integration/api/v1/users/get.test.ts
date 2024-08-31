import requester from "utils/requester";
import authTestUtils from "utils/tests/auth";

const api = requester.createTestRequester();

test("should return 401", async () => {
  const { status } = await api.get("/users/1");
  expect(status).toBe(401);
});
test("should return 404 when try to get another user", async () => {
  const access = await authTestUtils.createUser();
  const { status, data: errors } = await api.get("/users/1", {
    headers: { Authorization: `Bearer ${access}` },
  });
  expect(status).toBe(404);
  expect(Array.isArray(errors)).toBeTruthy();
  const [error] = errors;
  expect(error.message).toBe("Usuário não encontrado");
});
test("should return 404 when user not exists", async () => {
  const access = await authTestUtils.createUser();
  const { status, data: errors } = await api.get("/users/9999999", {
    headers: { Authorization: `Bearer ${access}` },
  });
  expect(status).toBe(404);
  expect(Array.isArray(errors)).toBeTruthy();
  const [error] = errors;
  expect(error.message).toBe("Usuário não encontrado");
});
test("should return 200", async () => {
  const payload = {
    email: "top@email.com",
    firstName: "Topildo",
    lastName: "Silva",
  };
  const access = await authTestUtils.createUser(payload);
  const userId = authTestUtils.getUserIdFromToken(access);
  const { status, data: user } = await api.get(`/users/${userId}`, {
    headers: { Authorization: `Bearer ${access}` },
  });
  expect(status).toBe(200);
  expect(user.first_name).toBe(payload.firstName);
  expect(user.last_name).toBe(payload.lastName);
  expect(user.password).not.toBeDefined();
  expect(user.email).toBe(payload.email);
});
