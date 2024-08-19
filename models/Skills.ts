import { and, eq } from "drizzle-orm";
import NotfFoundException from "exceptions/NotFoundException";
import database from "infra/database/database";
import { skills } from "infra/database/schema";

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
};

export default Skills;
