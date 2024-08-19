import routeConfig from "config/api/route-config";
import Authentication from "models/Authentication";
import Skills from "models/Skills";
import { createRouter } from "next-connect";
import { NextApiRequest, NextApiResponse } from "next/types";

export const config = routeConfig.DEFAULT_ROUT_CONFIG;

const router = createRouter<NextApiRequest, NextApiResponse>();

const getAuthorId = async (req: NextApiRequest) => {
  const { userId } = req.query;

  if (typeof userId === "string") {
    return +userId;
  }

  return NaN;
};

async function skills(req: NextApiRequest, res: NextApiResponse) {
  const skills = await Skills.getUserSkills(req.user.id);

  return res.status(200).json(skills);
}

export default router
  .use(Authentication.getJwtStrategy())
  .get(Authentication.getAuthorGuard(getAuthorId), skills)
  .handler();
