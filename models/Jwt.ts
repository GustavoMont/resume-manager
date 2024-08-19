import jwt, { SignOptions } from "jsonwebtoken";

function sign(payload: object, options: SignOptions = {}): string {
  const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
    expiresIn: "8h",
    ...options,
  });
  return token;
}

function decode(token: string) {
  const decoded = jwt.decode(token);

  return decoded;
}

const Jwt = {
  sign,
  decode,
};

export default Jwt;
