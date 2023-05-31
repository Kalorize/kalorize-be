import logger from "../config/winston.js";
import v from "../validations/index.js";
import r from "../utils/response.js";
import prisma from "../config/prisma.js";
import { ZodError } from "zod";
import { Prisma } from "@prisma/client";
import { hashSync } from "bcrypt";

/**
 * Login Controller
 * @param {Express.Request} req
 * @param {Express.Response} res
 */
async function update(req, res) {
  try {
    const { activity, age, gender, target, weight, height, password } =
      await v.user.update.parseAsync(req.body);

    const user = await prisma.user.update({
      data: {
        ...(activity && { activity: activity }),
        ...(age && { age: age }),
        ...(gender && { gender: gender }),
        ...(target && { target: target }),
        ...(weight && { weight: weight }),
        ...(height && { height: height }),
        ...(password && { password: hashSync(password, 10) }),
      },
      where: {
        id: req.user.id,
      },
    });

    return res.status(200).json(r({ status: "success", data: { user } }));
  } catch (e) {
    logger.error(e);
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      return res
        .status(400)
        .json(r({ status: "fail", message: "Email already registered" }));
    }

    if (e instanceof ZodError) {
      return res.status(400).json(
        r({
          status: "fail",
          message: "Input validation error",
          data: e.errors[0].message,
        })
      );
    }

    return res.status(400).json(r({ status: "fail", message: e.message }));
  }
}

export default { update };