import Jwt from "./Jwt";
import passport, { AuthenticateOptions } from "passport";
import localStrategy from "config/auth/local.strategy";
import { UserResponseDto } from "dtos/users/UserResponse.dto";
import { JwtPayload } from "types/JwtPayload";
import jwtStrategy from "config/auth/jwt.strategy";
import { NextApiRequest, NextApiResponse } from "next";
import { NextHandler } from "next-connect";

function createTokenPayload(user: UserResponseDto): JwtPayload {
  return { sub: user.id };
}

function authenticateUser(user: UserResponseDto) {
  const payload = createTokenPayload(user);
  const access = Jwt.sign(payload);
  return { access };
}

const PASSPORT_OPTIONS: AuthenticateOptions = { assignProperty: "user" };

function getLocalStrategy() {
  passport.use(localStrategy);
  return passport.authenticate("local", PASSPORT_OPTIONS);
}

function getJwtStrategy() {
  passport.use(jwtStrategy);
  return passport.authenticate("jwt", PASSPORT_OPTIONS);
}

type GetResourceAuthorIdFn = (req: NextApiRequest) => Promise<number>;

function getAuthorGuard(getResourceAuthorId: GetResourceAuthorIdFn) {
  async function routeHandler(
    req: NextApiRequest,
    res: NextApiResponse,
    next: NextHandler,
  ) {
    const resourceUserId = await getResourceAuthorId(req);
    const loggedUserId = req.user.id;
    if (loggedUserId !== resourceUserId) {
      return res.status(403).end("Forbidden");
    }
    return await next();
  }
  return routeHandler;
}

const Authentication = {
  authenticateUser,
  getLocalStrategy,
  getJwtStrategy,
  getAuthorGuard,
};

export default Authentication;
