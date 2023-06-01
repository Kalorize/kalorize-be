// eslint-disable-next-line no-unused-vars
import Express from "express";
// eslint-disable-next-line no-unused-vars
import prisma from "../config/prisma.js";
import { jwtSecret } from "../config/vars.js";
import jwt from "jsonwebtoken";
import r from "../utils/response.js";

/**
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @param {Express.NextFunction} next
 */
async function verify(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader) {
      const token = authHeader.split(" ")[1];

      const payload = jwt.verify(token, jwtSecret);
      const { id } = JSON.parse(JSON.stringify(payload));

      req.user = await prisma.user.findUniqueOrThrow({
        where: {
          id,
        },
      });

      return next();
    }

    return res
      .status(401)
      .json(r({ status: "fail", message: "missing authorization header" }));
  } catch (e) {
    return res.status(401).json(r({ status: "fail", message: e.message }));
  }
}

export default { verify };
