import Authentication from "models/Authentication";
import { createRouter } from "next-connect";
import { NextApiRequest, NextApiResponse } from "next/types";

const router = createRouter<NextApiRequest, NextApiResponse>();

router.get(Authentication.getJwtStrategy(), (req, res) => {
  return res.status(200).json({ has_user: !!req.user });
});

export default router.handler();
