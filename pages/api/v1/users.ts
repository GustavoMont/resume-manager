import { decamelizeKeys } from "humps";
import UserModel from "models/Users";
import { NextApiRequest, NextApiResponse } from "next";

export default async function users(req: NextApiRequest, res: NextApiResponse) {
  const users = await UserModel.getAllUsers();
  return res.status(200).json(decamelizeKeys(users));
}
