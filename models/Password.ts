import bcrypt from "bcrypt";

const SALT = 8;

async function hashPassword(password: string) {
  return await bcrypt.hash(password, SALT);
}

const Password = {
  hashPassword,
};

export default Password;
