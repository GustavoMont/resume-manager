import { Exclude } from "class-transformer";
import { MinLength, IsAlpha, IsOptional } from "class-validator";
import Skill from "types/Skill";

export default class CreateSkillDto implements Skill {
  @IsOptional()
  @MinLength(3, { message: "Nome da habilidade deve ter no mínimo 3 letras" })
  @IsAlpha("pt-BR", { message: "Nome da habilidade não pode conter números" })
  name: string;

  @Exclude()
  id: number;

  @Exclude()
  slug: string;

  @Exclude()
  createdAt: string;

  @Exclude()
  updatedAt: string;

  @Exclude()
  userId: number;
}
