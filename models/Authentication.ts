import Jwt from "./Jwt";
import passport, { AuthenticateOptions } from "passport";
import localStrategy from "config/auth/local.strategy";
import { UserResponseDto } from "dtos/users/UserResponse.dto";
import { JwtPayload } from "types/JwtPayload";
import jwtStrategy from "config/auth/jwt.strategy";

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

const Authentication = {
  authenticateUser,
  getLocalStrategy,
  getJwtStrategy,
};

export default Authentication;
