import { IsEmail, IsStrongPassword } from "class-validator";
import { User } from "types/User";
import CreateUpdateUserDto from "./CreateUpdateUser.dto";

export default class CreateUserDto extends CreateUpdateUserDto implements User {
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
