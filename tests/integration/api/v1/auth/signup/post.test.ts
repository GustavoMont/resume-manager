import { Decamelized } from "humps";
import { UserResponseDto } from "types/User";
import requester from "utils/requester";
import { randomUUID } from "node:crypto";

const api = requester.createTestRequester();

describe("failure cases", () => {
  test("should return 400 for user already exists", async () => {
    const { data: users } =
      await api.get<Decamelized<UserResponseDto>[]>("/users");
    const [user1] = users;
    const signupBody = {
      email: user1.email,
      first_name: "Primeiro",
      last_name: "Nome",
      password: "1$uperSenha",
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
      password: "top",
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
  test("should return logged user", async () => {
    const { status, data: user } = await api.post("/auth/signup", signupBody);
    expect(status).toBe(201);
    expect(user.first_name).toBe(signupBody.first_name);
    expect(user.last_name).toBe(signupBody.last_name);
    expect(user.email).toBe(signupBody.email);
  });
  test("should add new user", async () => {
    await api.post("/auth/signup", signupBody);
    const { data: users } =
      await api.get<Decamelized<UserResponseDto>[]>("/users");
    expect(users).toHaveLength(7);
  });
});
