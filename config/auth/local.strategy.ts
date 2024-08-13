import Password from "models/Password";
import UserModel from "models/Users";
import { Strategy as LocalStrategy, VerifyFunction } from "passport-local";

const authenticate: VerifyFunction = async (email, password, done) => {
  try {
    const user = await UserModel.getUserByEmail(email);
    if (!user) {
      return done(null, false);
    }

    const isCorrectPassword = await Password.verifyPassword({
      password,
      hashedPassword: user.password,
    });

    if (!isCorrectPassword) {
      return done(null, false);
    }
    return done(null, user);
  } catch (error) {
    done(error);
  }
};

const localStrategy = new LocalStrategy(
  { usernameField: "email" },
  authenticate,
);

export default localStrategy;
