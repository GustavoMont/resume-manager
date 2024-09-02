import requester from "utils/requester";
import authTestUtils from "utils/tests/auth";

const api = requester.createTestRequester();

test("should return 401", async () => {
  const { status } = await api.delete("/users/1");
  expect(status).toBe(401);
});
test("should return 404 for non existing user", async () => {
  const accessToken = await authTestUtils.createUser();
  const { status, data: errors } = await api.delete("/users/999999", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  expect(status).toBe(404);
  expect(Array.isArray(errors)).toBeTruthy();
  const [error] = errors;
  expect(error).toStrictEqual({ message: "Usuário não encontrado" });
});
test("should return 404 when try to delete another user", async () => {
  const accessToken = await authTestUtils.createUser();
  const { status, data: errors } = await api.delete("/users/1", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  expect(status).toBe(404);
  expect(Array.isArray(errors)).toBeTruthy();
  const [error] = errors;
  expect(error).toStrictEqual({ message: "Usuário não encontrado" });
});
test("should return 204", async () => {
  const accessToken = await authTestUtils.createUser();
  const userId = authTestUtils.getUserIdFromToken(accessToken);
  const { status } = await api.delete(`/users/${userId}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  expect(status).toBe(204);
});
test("should return 401 when deleted user try to access data", async () => {
  const accessToken = await authTestUtils.createUser();
  const userId = authTestUtils.getUserIdFromToken(accessToken);
  const accessToken2 = await authTestUtils.createUser();
  const userId2 = authTestUtils.getUserIdFromToken(accessToken2);
  await api.delete(`/users/${userId}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  const { status: deleteStatus } = await api.get(`/users/${userId}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  expect(deleteStatus).toBe(401);
  const { status: getStatus } = await api.get(`/users/${userId2}`, {
    headers: { Authorization: `Bearer ${accessToken2}` },
  });
  expect(getStatus).toBe(200);
});
