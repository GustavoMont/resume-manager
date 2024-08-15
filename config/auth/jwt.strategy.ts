import { plainToInstance } from "class-transformer";
import { UserResponseDto } from "dtos/users/UserResponse.dto";
import UserModel from "models/Users";
import {
  Strategy as JwtStrategy,
  ExtractJwt,
  VerifyCallback,
} from "passport-jwt";
import { JwtPayload } from "types/JwtPayload";

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET_KEY,
};

const authenticate: VerifyCallback = async function (
  jwtPayload: JwtPayload,
  done,
) {
  try {
    const user = await UserModel.getUserById(jwtPayload.sub);
    if (!user) {
      return done(null, false);
    }
    return done(null, plainToInstance(UserResponseDto, user));
  } catch (error) {
    return done(error);
  }
};

const jwtStrategy = new JwtStrategy(opts, authenticate);

export default jwtStrategy;
