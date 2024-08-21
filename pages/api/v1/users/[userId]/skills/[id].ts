import { plainToInstance } from "class-transformer";
import { validateOrReject } from "class-validator";
import routeConfig from "config/api/route-config";
import CreateSkillDto from "dtos/skills/CreateSkill.dto";
import { camelizeKeys, decamelizeKeys } from "humps";
import Authentication from "models/Authentication";
import Skills from "models/Skills";
import { NextApiRequest, NextApiResponse } from "next";
import { createRouter } from "next-connect";
import exceptionHandler from "utils/exceptions-handler";

export const config = routeConfig.DEFAULT_ROUT_CONFIG;

const router = createRouter<NextApiRequest, NextApiResponse>();

const getAuthorId = async (req: NextApiRequest) => {
  const { userId } = req.query;

  if (typeof userId === "string") {
    return +userId;
  }

  return NaN;
};

const jwtStrategy = Authentication.getJwtStrategy();
const guard = Authentication.getAuthorGuard(getAuthorId);

async function get(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { userId: userIdParam, id: idParam } = req.query;
    const userId = Number(userIdParam);
    const id = Number(idParam);

    const skill = await Skills.getSkill({ userId, id });

    return res.status(200).json(skill);
  } catch (error) {
    const errorMessage = exceptionHandler.handleException(error);
    const statusCode = exceptionHandler.handleStatusCode(error);
    return res.status(statusCode).json(errorMessage);
  }
}

async function put(req: NextApiRequest, res: NextApiResponse) {
  try {
    const body = camelizeKeys(req.body);
    const payload = plainToInstance(CreateSkillDto, body);
    await validateOrReject(payload);
    const { userId: userIdParam, id: idParam } = req.query;
    const userId = Number(userIdParam);
    const id = Number(idParam);
    const updatedSkill = await Skills.updateSkill({ id, userId }, payload);

    return res.status(200).json(decamelizeKeys(updatedSkill));
  } catch (error) {
    const statusCode = exceptionHandler.handleStatusCode(error);
    const errorResponse = exceptionHandler.handleException(error);
    return res.status(statusCode).json(errorResponse);
  }
}

router.use(jwtStrategy, guard).get(get).put(put);

export default router.handler();
