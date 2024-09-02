import { User } from "types/User";
import { Exclude } from "class-transformer";
import CreateUpdateUserDto from "./CreateUpdateUser.dto";
import { IsOptional } from "class-validator";

export class UpdateUserDto extends CreateUpdateUserDto implements User {
  @IsOptional()
  firstName: string;
  @IsOptional()
  lastName: string;
  @Exclude()
  email: string;
  @Exclude()
  password: string;
}
