import logger from "../config/winston.js";
import v from "../validations/index.js";
import r from "../utils/response.js";
import prisma from "../config/prisma.js";
import { ZodError } from "zod";
import { Prisma } from "@prisma/client";
import { hashSync } from "bcrypt";
import { store } from "../utils/storage.js";
import { bucket } from "../config/vars.js";
import axios, { AxiosError } from "axios";

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

    const isRecChanged = [gender, weight, height, age, activity, target].some(
      (item) => item
    );

    logger.info(`isRecChanged: ${isRecChanged}`);

    const u = await prisma.user.findUniqueOrThrow({
      where: {
        id: req.user.id,
      },
    });

    console.log(u);

    const isRecExist = [
      u.gender,
      u.weight,
      u.height,
      u.age,
      u.activity,
      u.target,
    ].every((item) => item !== null);

    logger.info(`isRecExist: ${isRecExist}`);

    const data = {
      gender: gender ?? u.gender,
      weight: weight ?? u.weight,
      age: age ?? u.age,
      height: height ?? u.height,
      activity_level: activity ? activity : u.activity,
      target: target ? target : u.target,
    };

    const dataIsDefined = (data) => Object.values(data).every((value) => value);

    logger.info(`dataIsDefined: ${dataIsDefined(data)}`);

    if ((!isRecExist || isRecChanged) && dataIsDefined(data)) {
      data.activity_level = data.activity_level.toLowerCase();
      data.gender = data.gender.toLowerCase();
      data.target = data.target.toLowerCase();

      console.log(data);

      axios
        .post("https://f2hwg-cwx4yokorq-et.a.run.app/food_rec", data, {
          headers: {
            "x-api-key": "kalorize-ml",
          },
        })
        .then((r) => {
          console.log(r.data);
          // save data into recommendation table
        })
        .catch((e) => {
          if (e instanceof AxiosError) {
            console.log(e.response);
          }
        });
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

    console.log(user);

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
