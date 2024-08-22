import CreateSkillDto from "dtos/skills/CreateSkill.dto";
import authTestUtils from "./auth";
import requester from "utils/requester";
import { camelizeKeys, Decamelized } from "humps";
import Skill from "types/Skill";

const api = requester.createTestRequester();

async function createSkill(
  access: string,
  customPayload: Partial<CreateSkillDto> = {},
) {
  const userId = authTestUtils.getUserIdFromToken(access);

  const payload = { name: "habilidade", ...customPayload };

  const { data: skill } = await api.post<Decamelized<Skill>>(
    `/users/${userId}/skills`,
    payload,
    { headers: { Authorization: `Bearer ${access}` } },
  );

  return camelizeKeys<Decamelized<Skill>>(skill);
}

const skillsTestUtils = { createSkill };

export default skillsTestUtils;
