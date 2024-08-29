import routeConfig from "config/api/route-config";
import NotfFoundException from "exceptions/NotFoundException";
import { decamelizeKeys } from "humps";
import Authentication from "models/Authentication";
import type { NextApiRequest, NextApiResponse } from "next";
import { createRouter } from "next-connect";
import exceptionHandler from "utils/exceptions-handler";

const router = createRouter<NextApiRequest, NextApiResponse>();

export const config = routeConfig.DEFAULT_ROUT_CONFIG;

async function getUserId(req: NextApiRequest) {
  const { userId } = req.query;
  if (typeof userId !== "string") {
    return NaN;
  }
  return Number(userId);
}

router.use(Authentication.getJwtStrategy()).get(async (req, res) => {
  try {
    const userIdParam = await getUserId(req);
    if (userIdParam !== req.user.id) {
      throw new NotfFoundException("Usuário", "M");
    }
    return res.status(200).json(decamelizeKeys(req.user));
  } catch (error) {
    const statusCode = exceptionHandler.handleStatusCode(error);
    const response = exceptionHandler.handleException(error);
    return res.status(statusCode).json(response);
  }
});

export default router.handler();
