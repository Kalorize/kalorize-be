// eslint-disable-next-line no-unused-vars
import Express from "express";
// eslint-disable-next-line no-unused-vars
import { User } from "@prisma/client";
import prisma from "../config/prisma.js";
import { jwtSecret } from "../config/vars.js";
import jwt from "jsonwebtoken";

/**
 *
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @param {Express.NextFunction} next
 * @returns {Promise<void>}
 */
export async function auth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader) {
      const token = authHeader.split(" ")[1];

      const payload = jwt.verify(token, jwtSecret);
      const { id } = JSON.parse(JSON.stringify(payload));

      req.user = await prisma.admin.findUniqueOrThrow({
        where: {
          id,
        },
      });

      return next();
    }

    return res.sendStatus(401);
  } catch (e) {
    return res.sendStatus(401);
  }
}
