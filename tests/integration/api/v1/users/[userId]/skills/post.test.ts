import requester from "utils/requester";
import authTestUtils from "utils/tests/auth";

const api = requester.createTestRequester();

test("should return 401", async () => {
  const { status } = await api.post(`/users/1/skills`);
  expect(status).toBe(401);
});
test("should return 403 to create skills for another user", async () => {
  const access = await authTestUtils.createUser();
  const { status } = await api.post(
    `/users/1/skills`,
    {},
    { headers: { Authorization: `Bearer ${access}` } },
  );
  expect(status).toBe(403);
});
test("should return 400", async () => {
  const access = await authTestUtils.createUser();
  const userId = authTestUtils.getUserIdFromToken(access);

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
  const access = await authTestUtils.createUser();
  const userId = authTestUtils.getUserIdFromToken(access);
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
  const access = await authTestUtils.createUser();
  const userId = authTestUtils.getUserIdFromToken(access);
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
