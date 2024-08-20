import { and, eq } from "drizzle-orm";
import CreateSkillDto from "dtos/skills/CreateSkill.dto";
import BadRequestException from "exceptions/BadRequestException";
import NotfFoundException from "exceptions/NotFoundException";
import database from "infra/database/database";
import { skills } from "infra/database/schema";
import slugfier from "utils/slugfy";

async function getUserSkills(userId: number) {
  const db = await database.getNewDb();
  const userSkills = await db
    .select()
    .from(skills)
    .where(eq(skills.userId, userId));
  return userSkills;
}

type GetSkillParam = {
  userId: number;
  id: number;
};

async function getUserSkillBySlug(userId: number, slug: string) {
  const db = await database.getNewDb();
  const [skill] = await db
    .select()
    .from(skills)
    .where(and(eq(skills.userId, userId), eq(skills.slug, slug)));

  return skill;
}

async function isNewSkill(userId: number, slug: string) {
  const skill = await getUserSkillBySlug(userId, slug);
  if (skill) {
    throw new BadRequestException("Habilidade já adicionada ao usuário");
  }
}

async function createSkill(userId: number, payload: CreateSkillDto) {
  const slug = slugfier.generateSlug(`${payload.name}-${userId}`);
  await isNewSkill(userId, slug);

  const db = await database.getNewDb();
  const newSkill = {
    ...payload,
    slug,
    userId,
  };
  const [skill] = await db.insert(skills).values(newSkill).returning();

  return skill;
}

async function getSkill({ id, userId }: GetSkillParam) {
  const db = await database.getNewDb();
  const [skill] = await db
    .select()
    .from(skills)
    .where(and(eq(skills.id, id), eq(skills.userId, userId)));

  if (!skill) {
    throw new NotfFoundException("Skill");
  }

  return skill;
}

const Skills = {
  getUserSkills,
  getSkill,
  createSkill,
};

export default Skills;
