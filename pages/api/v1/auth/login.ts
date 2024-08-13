import Authentication from "models/Authentication";
import { NextApiRequest, NextApiResponse } from "next";
import { createRouter } from "next-connect";
import exceptionHandler from "utils/exceptions-handler";

const router = createRouter<NextApiRequest, NextApiResponse>();

router.post(Authentication.getLocalStrategy(), (req, res) => {
  try {
    const loginResponse = Authentication.authenticateUser(req.user);
    return res.status(200).json(loginResponse);
  } catch (error) {
    const errors = exceptionHandler.handleException(error);

    return res.status(500).json(errors);
  }
});

export default router.handler();
