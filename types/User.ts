export type User = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  createdAt: string;
  updatedAt: string;
};

export type UserResponseDto = Omit<User, "password">;
