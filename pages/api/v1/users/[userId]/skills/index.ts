import { plainToInstance } from "class-transformer";
import { validateOrReject } from "class-validator";
import routeConfig from "config/api/route-config";
import CreateSkillDto from "dtos/skills/CreateSkill.dto";
import authorGuard from "guards/author-guard";
import { decamelizeKeys } from "humps";
import Authentication from "models/Authentication";
import Skills from "models/Skills";
import { createRouter } from "next-connect";
import { NextApiRequest, NextApiResponse } from "next/types";
import exceptionHandler from "utils/exceptions-handler";

export const config = routeConfig.DEFAULT_ROUT_CONFIG;

const router = createRouter<NextApiRequest, NextApiResponse>();

const jwtGuard = Authentication.getJwtStrategy();
const userIdGuard = authorGuard.userIdParamGuard;

async function getSkills(req: NextApiRequest, res: NextApiResponse) {
  const skills = await Skills.getUserSkills(req.user.id);

  return res.status(200).json(skills);
}

async function createSkill(req: NextApiRequest, res: NextApiResponse) {
  try {
    const payload = plainToInstance(CreateSkillDto, req.body);
    await validateOrReject(payload);
    const skill = await Skills.createSkill(req.user.id, payload);

    return res.status(201).json(decamelizeKeys(skill));
  } catch (error) {
    const statusCode = exceptionHandler.handleStatusCode(error);
    const errorResponse = exceptionHandler.handleException(error);

    return res.status(statusCode).json(errorResponse);
  }
}

export default router
  .use(jwtGuard, userIdGuard)
  .get(getSkills)
  .post(createSkill)
  .handler();
