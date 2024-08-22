import requester from "utils/requester";
import slugfier from "utils/slugfy";
import authTestUtils from "utils/tests/auth";
import skillsTestUtils from "utils/tests/skills";

const api = requester.createTestRequester();

test("should return 401", async () => {
  const { status } = await api.put(`/users/1/skills/1`, {});
  expect(status).toBe(401);
});
test("should return 403", async () => {
  const access = await authTestUtils.createUser();
  const { status } = await api.put(
    `/users/1/skills/1`,
    {},
    { headers: { Authorization: `Bearer ${access}` } },
  );
  expect(status).toBe(403);
});
test("should return 404 when skill is not from user", async () => {
  const access = await authTestUtils.createUser();
  const userId = authTestUtils.getUserIdFromToken(access);
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
  const access = await authTestUtils.createUser();
  const { id } = await skillsTestUtils.createSkill(access);
  const userId = authTestUtils.getUserIdFromToken(access);

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
  const access = await authTestUtils.createUser();
  const payload = { name: "Habilijhonson" };
  await skillsTestUtils.createSkill(access, payload);
  const { id } = await skillsTestUtils.createSkill(access);
  const userId = authTestUtils.getUserIdFromToken(access);

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
  const access = await authTestUtils.createUser();
  const { id, name } = await skillsTestUtils.createSkill(access);
  const userId = authTestUtils.getUserIdFromToken(access);

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
  const access = await authTestUtils.createUser();

  const { id, createdAt } = await skillsTestUtils.createSkill(access);
  const userId = authTestUtils.getUserIdFromToken(access);

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
