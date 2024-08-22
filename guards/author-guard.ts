import Authentication from "models/Authentication";
import { NextApiRequest } from "next";

function getUserIdParam(req: NextApiRequest) {
  const { userId } = req.query;

  if (typeof userId === "string") {
    return +userId;
  }

  return NaN;
}

const userIdParamGuard = Authentication.getAuthorGuard(getUserIdParam);

const authorGuard = { userIdParamGuard };

export default authorGuard;
