import requester from "utils/requester";
import { randomUUID } from "node:crypto";
import { faker } from "@faker-js/faker";

const api = requester.createTestRequester();

describe("failure cases", () => {
  test("should return 400 for user already exists", async () => {
    const signupBody = {
      email: "arquiteto@email.com",
      first_name: "Primeiro",
      last_name: "Nome",
      password: faker.internet.password({ length: 10, prefix: "9" }),
    };
    const { status, data: errors } = await api.post("/auth/signup", signupBody);
    expect(status).toBe(400);
    expect(errors).toHaveLength(1);
    const [error] = errors;
    expect(error).toStrictEqual({
      message: "Usuário já cadastrado",
    });
  });
  test("should return 400 for invalid fields", async () => {
    const signupBody = {
      email: "email",
      first_name: "P",
      last_name: "N",
      password: faker.internet.password({ length: 3 }),
    };
    const { status, data: errors } = await api.post("/auth/signup", signupBody);
    expect(status).toBe(400);
    expect(errors).toHaveLength(4);
    const messages = errors.map(({ message }) => message);
    expect(
      messages.includes("Primeiro nome deve ter no mínimo 3 letras"),
    ).toBeTruthy();
    expect(
      messages.includes("Sobrenome deve ter no mínimo 3 letras"),
    ).toBeTruthy();
    expect(messages.includes("E-mail inválido")).toBeTruthy();
    expect(
      messages.includes(
        "Senha deve conter no mínimo 8 caracteres, com números e letras",
      ),
    ).toBeTruthy();
  });
});

describe("success cases", () => {
  const signupBody = {
    email: "new_email@email.com",
    first_name: "Primeiro",
    last_name: "Nome",
    password: randomUUID(),
  };
  test("should return access token", async () => {
    const { status, data: response } = await api.post(
      "/auth/signup",
      signupBody,
    );
    expect(status).toBe(201);
    expect(response.access).toBeDefined();
    expect(response.access.length).toBeGreaterThan(12);
  });
});
