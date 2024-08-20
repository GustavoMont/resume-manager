import { MinLength, IsAlpha } from "class-validator";
import Skill from "types/Skill";

type CreateSkill = Pick<Skill, "name">;

export default class CreateSkillDto implements CreateSkill {
  @MinLength(3, { message: "Nome da habilidade deve ter no mínimo 3 letras" })
  @IsAlpha("pt-BR", { message: "Nome da habilidade não pode conter números" })
  name: string;
}
