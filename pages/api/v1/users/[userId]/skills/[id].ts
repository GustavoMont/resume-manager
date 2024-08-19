import routeConfig from "config/api/route-config";
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

router.use(jwtStrategy, guard).get(async (req, res) => {
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
});

export default router.handler();
