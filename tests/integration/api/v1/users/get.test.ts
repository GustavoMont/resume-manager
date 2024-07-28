import { User } from "types/User";
import { Camelized, camelizeKeys, Decamelized } from "humps";

test("should return list of users", async () => {
  const response = await fetch("http://localhost:3000/api/v1/users");
  expect(response.status).toBe(200);

  const decamelizedUsers: Decamelized<Partial<User>>[] = await response.json();

  const users: Camelized<Partial<User>>[] = camelizeKeys(decamelizedUsers);

  expect(Array.isArray(users)).toBeTruthy();
  expect(users.length).toBeGreaterThan(1);

  for (const user of users) {
    expect(user?.firstName).toBeDefined();
    expect(user?.lastName).toBeDefined();
    expect(user?.password).not.toBeDefined();
  }
});
