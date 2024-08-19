import AccessTokenDto from "dtos/auth/Access.dto";
import CreateUserDto from "dtos/users/CreateUser.dto";
import requester from "utils/requester";

const api = requester.createRequester();

const BASE_URL = "/auth";

export type LoginPayload = {
  email: string;
  password: string;
};

export async function login(payload: LoginPayload) {
  const { data } = await api.post<AccessTokenDto>(`${BASE_URL}/login`, payload);
  return data;
}

export async function signup(payload: CreateUserDto) {
  const { data } = await api.post<AccessTokenDto>(
    `${BASE_URL}/signup`,
    payload,
  );
  return data;
}
