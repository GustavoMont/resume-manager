import { and, eq } from "drizzle-orm";
import CreateSkillDto from "dtos/skills/CreateSkill.dto";
import BadRequestException from "exceptions/BadRequestException";
import NotfFoundException from "exceptions/NotFoundException";
import database from "infra/database/database";
import { skills } from "infra/database/schema";
import Skill from "types/Skill";
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
    throw new BadRequestException("Já existe uma habilidade com o mesmo nome");
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

async function handleSkillSlug(payload: Partial<Skill>, userId: number) {
  if (!payload.name) {
    return payload;
  }

  const slug = slugfier.generateSlug(`${payload.name}-${userId}`);
  await isNewSkill(userId, slug);
  payload.slug = slug;

  return payload;
}

async function updateSkill(params: GetSkillParam, payload: Partial<Skill>) {
  const skill = await getSkill(params);

  if (Object.keys(payload).length === 0) {
    return skill;
  }

  await handleSkillSlug(payload, params.userId);

  payload.updatedAt = new Date().toISOString();

  const db = await database.getNewDb();

  const [newSkill] = await db
    .update(skills)
    .set(payload)
    .where(eq(skills.id, params.id))
    .returning();

  return newSkill;
}

async function getSkill({ id, userId }: GetSkillParam) {
  const db = await database.getNewDb();
  const [skill] = await db
    .select()
    .from(skills)
    .where(and(eq(skills.id, id), eq(skills.userId, userId)));

  if (!skill) {
    throw new NotfFoundException("Habilidade", "F");
  }

  return skill;
}

const Skills = {
  getUserSkills,
  getSkill,
  createSkill,
  updateSkill,
};

export default Skills;
