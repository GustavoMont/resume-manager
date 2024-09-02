import { Exclude } from "class-transformer";
import { MinLength } from "class-validator";
import { User } from "types/User";

export default class CreateUpdateUserDto
  implements Omit<User, "email" | "password">
{
  @Exclude()
  id: number;
  @Exclude()
  createdAt: string;
  @Exclude()
  updatedAt: string;
  @MinLength(3, { message: "Primeiro nome deve ter no mínimo 3 letras" })
  firstName: string;
  @MinLength(3, { message: "Sobrenome deve ter no mínimo 3 letras" })
  lastName: string;
}
