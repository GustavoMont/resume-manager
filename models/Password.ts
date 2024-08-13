import bcrypt from "bcrypt";

const SALT = 8;

async function hashPassword(password: string) {
  return await bcrypt.hash(password, SALT);
}

type Params = {
  password: string;
  hashedPassword: string;
};

async function verifyPassword({ hashedPassword, password }: Params) {
  return await bcrypt.compare(password, hashedPassword);
}

const Password = {
  hashPassword,
  verifyPassword,
};

export default Password;
