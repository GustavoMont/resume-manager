import requester from "utils/requester";
import authTestUtils from "utils/tests/auth";
import skillsTestUtils from "utils/tests/skills";

const api = requester.createTestRequester();

test("should return 401", async () => {
  const { status } = await api.delete(`/users/1/skills/1`);
  expect(status).toBe(401);
});
test("should return 403", async () => {
  const access = await authTestUtils.createUser();
  const { status } = await api.delete(`/users/1/skills/1`, {
    headers: { Authorization: `Bearer ${access}` },
  });
  expect(status).toBe(403);
});
test("should return 404 when try to delete skill from another user", async () => {
  const access = await authTestUtils.createUser();
  const userId = authTestUtils.getUserIdFromToken(access);
  const { status, data: errors } = await api.delete(
    `/users/${userId}/skills/1`,
    {
      headers: { Authorization: `Bearer ${access}` },
    },
  );
  expect(status).toBe(404);
  expect(Array.isArray(errors)).toBeTruthy();
  const [error] = errors;
  expect(error.message).toBe("Habilidade não encontrada");
});
test("should return 404 skill does not exist", async () => {
  const access = await authTestUtils.createUser();
  const userId = authTestUtils.getUserIdFromToken(access);
  const { status, data: errors } = await api.delete(
    `/users/${userId}/skills/199999999`,
    {
      headers: { Authorization: `Bearer ${access}` },
    },
  );
  expect(status).toBe(404);
  expect(Array.isArray(errors)).toBeTruthy();
  const [error] = errors;
  expect(error.message).toBe("Habilidade não encontrada");
});
test("should return 204", async () => {
  const access = await authTestUtils.createUser();
  const { id } = await skillsTestUtils.createSkill(access);
  const userId = authTestUtils.getUserIdFromToken(access);
  const { status } = await api.delete(`/users/${userId}/skills/${id}`, {
    headers: { Authorization: `Bearer ${access}` },
  });
  expect(status).toBe(204);
});
