import routeConfig from "config/api/route-config";
import skillController from "controller/skill-controller";
import authorGuard from "guards/author-guard";
import Authentication from "models/Authentication";
import { createRouter } from "next-connect";
import { NextApiRequest, NextApiResponse } from "next/types";

export const config = routeConfig.DEFAULT_ROUT_CONFIG;

const router = createRouter<NextApiRequest, NextApiResponse>();

const jwtGuard = Authentication.getJwtStrategy();
const userIdGuard = authorGuard.userIdParamGuard;

export default router
  .use(jwtGuard, userIdGuard)
  .get(skillController.getSkillsList)
  .post(skillController.post)
  .handler();
