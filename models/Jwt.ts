import jwt, { SignOptions } from "jsonwebtoken";

function sign(payload: object, options: SignOptions = {}): string {
  const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
    expiresIn: "8h",
    ...options,
  });
  return token;
}

const Jwt = {
  sign,
};

export default Jwt;
