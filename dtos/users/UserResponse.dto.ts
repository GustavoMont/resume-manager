import { Exclude } from "class-transformer";
import { User } from "types/User";

export class UserResponseDto implements User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  @Exclude()
  password: string;
}
