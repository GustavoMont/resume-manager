import Jwt from "./Jwt";
import passport from "passport";
import localStrategy from "config/auth/local.strategy";
import { UserResponseDto } from "dtos/users/UserResponse.dto";

function createTokenPayload(user: UserResponseDto) {
  return { sub: user.id };
}

function authenticateUser(user: UserResponseDto) {
  const payload = createTokenPayload(user);
  const access = Jwt.sign(payload);
  return { access };
}

function getLocalStrategy() {
  passport.use(localStrategy);
  return passport.authenticate("local", { assignProperty: "user" });
}

const Authentication = {
  authenticateUser,
  getLocalStrategy,
};

export default Authentication;
