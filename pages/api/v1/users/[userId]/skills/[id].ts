import routeConfig from "config/api/route-config";
import skillController from "controller/skill-controller";
import authorGuard from "guards/author-guard";
import Authentication from "models/Authentication";
import { NextApiRequest, NextApiResponse } from "next";
import { createRouter } from "next-connect";

export const config = routeConfig.DEFAULT_ROUT_CONFIG;

const router = createRouter<NextApiRequest, NextApiResponse>();

const jwtStrategy = Authentication.getJwtStrategy();
const userIdParamGuard = authorGuard.userIdParamGuard;

router
  .use(jwtStrategy, userIdParamGuard)
  .get(skillController.get)
  .put(skillController.put)
  .delete(skillController.deleteSkill);

export default router.handler();
