import requester from "utils/requester";
import authTestUtils from "utils/tests/auth";

const api = requester.createTestRequester();

test("should return 401", async () => {
  const { status } = await api.patch("/users/1", {});
  expect(status).toBe(401);
});
test("should return 404 when try update another user", async () => {
  const accessToken = await authTestUtils.createUser();
  const { status, data: errors } = await api.patch(
    "/users/1",
    {},
    { headers: { Authorization: `Bearer ${accessToken}` } },
  );
  expect(status).toBe(404);
  expect(Array.isArray(errors)).toBeTruthy();
  const [error] = errors;
  expect(error).toStrictEqual({ message: "Usuário não encontrado" });
});
test("should return 404 when user does not exist", async () => {
  const accessToken = await authTestUtils.createUser();
  const { status, data: errors } = await api.patch(
    "/users/999999999",
    {},
    { headers: { Authorization: `Bearer ${accessToken}` } },
  );
  expect(status).toBe(404);
  expect(Array.isArray(errors)).toBeTruthy();
  const [error] = errors;
  expect(error).toStrictEqual({ message: "Usuário não encontrado" });
});
test("should return 400 when invalid payload", async () => {
  const accessToken = await authTestUtils.createUser();
  const userId = authTestUtils.getUserIdFromToken(accessToken);
  const payload = {
    first_name: "1",
    last_name: "2",
    email: "novo_email@email",
  };
  const { status, data: errors } = await api.patch(
    `/users/${userId}`,
    payload,
    { headers: { Authorization: `Bearer ${accessToken}` } },
  );
  expect(status).toBe(400);
  expect(Array.isArray(errors)).toBeTruthy();
  const messages: string[] = errors.map(({ message }) => message);
  expect(
    messages.includes("Primeiro nome deve ter no mínimo 3 letras"),
  ).toBeTruthy();
  expect(
    messages.includes("Sobrenome deve ter no mínimo 3 letras"),
  ).toBeTruthy();
  expect(messages.includes("E-mail inválido")).not.toBeTruthy();
});
test("should return 200 when valid payload", async () => {
  const accessToken = await authTestUtils.createUser();
  const userId = authTestUtils.getUserIdFromToken(accessToken);
  const payload = {
    first_name: "Topildo",
    last_name: "Souza",
  };
  const { status, data: user } = await api.patch(`/users/${userId}`, payload, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  expect(status).toBe(200);
  expect(user.first_name).toBe(payload.first_name);
  expect(user.last_name).toBe(payload.last_name);
  const createdAtTime = new Date(user.created_at).getTime();
  const updatedAtTime = new Date(user.updated_at).getTime();
  expect(updatedAtTime).toBeGreaterThan(createdAtTime);
  expect(user.password).not.toBeDefined();
});

test("should allow update only one field", async () => {
  const accessToken = await authTestUtils.createUser();
  const userId = authTestUtils.getUserIdFromToken(accessToken);
  const accessToken2 = await authTestUtils.createUser();
  const userId2 = authTestUtils.getUserIdFromToken(accessToken2);
  const payload = {
    first_name: "Topildo",
  };
  const { status, data: user } = await api.patch(`/users/${userId}`, payload, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  expect(status).toBe(200);
  expect(user.first_name).toBe(payload.first_name);
  const createdAtTime = new Date(user.created_at).getTime();
  const updatedAtTime = new Date(user.updated_at).getTime();
  expect(updatedAtTime).toBeGreaterThan(createdAtTime);
  expect(user.id).toBe(userId);
  expect(user.password).not.toBeDefined();
  const { data: anotherUser } = await api.get(`/users/${userId2}`, {
    headers: { Authorization: `Bearer ${accessToken2}` },
  });

  expect(anotherUser.first_name).not.toBe(user.first_name);
});
