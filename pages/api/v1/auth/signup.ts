import { plainToInstance } from "class-transformer";
import { validateOrReject } from "class-validator";
import CreateUserDto from "dtos/users/CreateUser.dto";
import { Camelized, camelizeKeys } from "humps";
import Authentication from "models/Authentication";
import UserModel from "models/Users";
import { NextApiRequest, NextApiResponse } from "next";
import { User } from "types/User";
import exceptionHandler from "utils/exceptions-handler";

export default async function signup(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).json([{ message: "Method not allowed" }]);
  }
  try {
    const body = camelizeKeys<Camelized<User>>(req.body);
    const createUserPayload = plainToInstance(CreateUserDto, body);
    await validateOrReject(createUserPayload);

    const newUser = await UserModel.createUser(createUserPayload);
    const accessResponse = Authentication.authenticateUser(newUser);
    return res.status(201).json(accessResponse);
  } catch (error) {
    const status = exceptionHandler.handleStatusCode(error);
    const formatedException = exceptionHandler.handleException(error);
    return res.status(status).json(formatedException);
  }
}
