import { plainToInstance } from "class-transformer";
import { validateOrReject } from "class-validator";
import CreateSkillDto from "dtos/skills/CreateSkill.dto";
import { camelizeKeys, decamelizeKeys } from "humps";
import Skills from "models/Skills";
import { NextApiRequest, NextApiResponse } from "next/types";
import exceptionHandler from "utils/exceptions-handler";

async function get(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { userId: userIdParam, id: idParam } = req.query;
    const userId = Number(userIdParam);
    const id = Number(idParam);

    const skill = await Skills.getSkill({ userId, id });

    return res.status(200).json(skill);
  } catch (error) {
    const errorMessage = exceptionHandler.handleException(error);
    const statusCode = exceptionHandler.handleStatusCode(error);
    return res.status(statusCode).json(errorMessage);
  }
}

async function put(req: NextApiRequest, res: NextApiResponse) {
  try {
    const body = camelizeKeys(req.body);
    const payload = plainToInstance(CreateSkillDto, body);
    await validateOrReject(payload);
    const { userId: userIdParam, id: idParam } = req.query;
    const userId = Number(userIdParam);
    const id = Number(idParam);
    const updatedSkill = await Skills.updateSkill({ id, userId }, payload);

    return res.status(200).json(decamelizeKeys(updatedSkill));
  } catch (error) {
    const statusCode = exceptionHandler.handleStatusCode(error);
    const errorResponse = exceptionHandler.handleException(error);
    return res.status(statusCode).json(errorResponse);
  }
}

async function deleteSkill(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id: idParam, userId: userIdParam } = req.query;
    const userId = +userIdParam;
    const id = +idParam;

    await Skills.deleteSkill({ id, userId });

    return res.status(204).end();
  } catch (error) {
    const statusCode = exceptionHandler.handleStatusCode(error);
    const errorResponse = exceptionHandler.handleException(error);
    return res.status(statusCode).json(errorResponse);
  }
}

async function getSkillsList(req: NextApiRequest, res: NextApiResponse) {
  const skills = await Skills.getUserSkills(req.user.id);

  return res.status(200).json(skills);
}

async function post(req: NextApiRequest, res: NextApiResponse) {
  try {
    const payload = plainToInstance(CreateSkillDto, req.body);
    await validateOrReject(payload);
    const skill = await Skills.createSkill(req.user.id, payload);

    return res.status(201).json(decamelizeKeys(skill));
  } catch (error) {
    const statusCode = exceptionHandler.handleStatusCode(error);
    const errorResponse = exceptionHandler.handleException(error);

    return res.status(statusCode).json(errorResponse);
  }
}

const skillController = { get, put, deleteSkill, getSkillsList, post };

export default skillController;
