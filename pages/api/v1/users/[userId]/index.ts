import routeConfig from "config/api/route-config";
import NotfFoundException from "exceptions/NotFoundException";
import { camelizeKeys, decamelizeKeys } from "humps";
import Authentication from "models/Authentication";
import UserModel from "models/Users";
import type { NextApiRequest, NextApiResponse } from "next";
import { createRouter, NextHandler } from "next-connect";
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

async function checkUserPermission(
  req: NextApiRequest,
  res: NextApiResponse,
  next: NextHandler,
) {
  const userIdParam = await getUserId(req);
  if (userIdParam !== req.user.id) {
    throw new NotfFoundException("Usuário", "M");
  }
  await next();
}

async function updateUser(req: NextApiRequest, res: NextApiResponse) {
  const camelizedBody = camelizeKeys(req.body);
  const updatedUser = await UserModel.updateUser(camelizedBody);
  return res.status(200).json(decamelizeKeys(updatedUser));
}

router
  .use(Authentication.getJwtStrategy(), checkUserPermission)
  .patch(updateUser)
  .get(async (req, res) => {
    try {
      return res.status(200).json(decamelizeKeys(req.user));
    } catch (error) {
      const statusCode = exceptionHandler.handleStatusCode(error);
      const response = exceptionHandler.handleException(error);
      return res.status(statusCode).json(response);
    }
  });

export default router.handler({
  onError(error, req, res) {
    const statusCode = exceptionHandler.handleStatusCode(error);
    const response = exceptionHandler.handleException(error);
    return res.status(statusCode).json(response);
  },
});
