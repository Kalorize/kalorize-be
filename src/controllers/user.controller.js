import logger from "../config/winston.js";
import v from "../validations/index.js";
import r from "../utils/response.js";
import prisma from "../config/prisma.js";
import { ZodError } from "zod";
import { Prisma } from "@prisma/client";
import { hashSync } from "bcrypt";
import { store } from "../utils/storage.js";
import { bucket } from "../config/vars.js";

/**
 * Login Controller
 * @param {Express.Request} req
 * @param {Express.Response} res
 */
async function update(req, res) {
  try {
    const { activity, name, age, gender, target, weight, height, password } =
      await v.user.update.parseAsync(req.body);

    /**
     * @type {string|null}
     */
    let picture;
    const file = req.file;
    if (file) {
      picture = `${bucket}/${await store(file, "images/")}`;
    }

    const isRecChanged = [gender, weight, height, age, activity, target].every(
      (item) => item !== null
    );

    const u = await prisma.user.findUniqueOrThrow({
      where: {
        id: req.user.id,
      },
    });

    const isRecExist = [
      u.gender,
      u.weight,
      u.height,
      u.age,
      u.activity,
      u.target,
    ].every((item) => item !== null);

    if (!isRecExist) {
      // fetch ML then return the data
    } else {
      if (!isRecChanged) {
        // return the data
      } else {
        // fetch ML then return the data
      }
    }

    const user = await prisma.user.update({
      data: {
        ...(activity && { activity: activity }),
        ...(age && { age: age }),
        ...(picture && { picture: picture }),
        ...(name && { name: name }),
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
