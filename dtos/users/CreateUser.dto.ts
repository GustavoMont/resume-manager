import { Exclude } from "class-transformer";
import { IsEmail, IsStrongPassword, MinLength } from "class-validator";
import { User } from "types/User";

export default class CreateUserDto implements User {
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
  @IsStrongPassword(
    { minLength: 8, minNumbers: 1, minUppercase: 0, minSymbols: 0 },
    {
      message: "Senha deve conter no mínimo 8 caracteres, com números e letras",
    },
  )
  password: string;
  @IsEmail(undefined, {
    message: "E-mail inválido",
  })
  email: string;
}
