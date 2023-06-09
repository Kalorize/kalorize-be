import logger from "../config/winston.js";
import v from "../validations/index.js";
import r from "../utils/response.js";
import prisma from "../config/prisma.js";
import { ZodError } from "zod";
import { Prisma } from "@prisma/client";
import { hashSync } from "bcrypt";
import { store } from "../utils/storage.js";
import { bucket, mlApiBaseUrl, mlApiKey } from "../config/vars.js";
import axios from "axios";
import { userInclude } from "../constants/index.js";

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

    const isAbleToUpRecs = (data) =>
      Object.values(data).every((value) => value);

    logger.info(`isAbleToUpRecs(data): ${isAbleToUpRecs(data)}`);

    /**
     * @type {Prisma.Enumerable<Prisma.FoodWhereUniqueInput>}
     */
    const breakfast = [];

    /**
     * @type {Prisma.Enumerable<Prisma.FoodWhereUniqueInput>}
     */
    const lunch = [];

    /**
     * @type {Prisma.Enumerable<Prisma.FoodWhereUniqueInput>}
     */
    const dinner = [];

    let calories = 0;

    let protein = 0;

    /**
     * @type {Prisma.ReccomendationUpdateOneWithoutUserNestedInput}
     */
    const reccomendation = {};

    if ((!isRecExist || isRecChanged) && isAbleToUpRecs(data)) {
      data.activity_level = data.activity_level.toLowerCase();
      data.gender = data.gender.toLowerCase();
      data.target = data.target.toLowerCase();

      console.log(data);

      const api = await axios.post(`${mlApiBaseUrl}/food_rec`, data, {
        headers: {
          "x-api-key": mlApiKey,
        },
      });

      api.data.breakfast.forEach((b) => {
        breakfast.push({ id: Number(b.RecipeId) });
      });

      api.data.lunch.forEach((b) => {
        lunch.push({ id: b.RecipeId });
      });

      api.data.dinner.map((b) => {
        dinner.push({ id: b.RecipeId });
      });

      calories = Number(api.data.calories);
      protein = Number(api.data.proteins);

      reccomendation.upsert = {
        create: {
          calories,
          protein,
          breakfast: {
            connect: breakfast,
          },
          lunch: {
            connect: lunch,
          },
          dinner: {
            connect: dinner,
          },
        },
        update: {
          calories,
          protein,
          breakfast: {
            connect: breakfast,
          },
          lunch: {
            connect: lunch,
          },
          dinner: {
            connect: dinner,
          },
        },
      };
    }

    const isReadyToUpRecs = [breakfast, lunch, dinner, calories, protein].every(
      (i) => Boolean(i)
    );

    logger.info(`isReadyToUpRecs: ${isReadyToUpRecs}`);

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
        ...(isReadyToUpRecs && {
          reccomendation: reccomendation,
        }),
      },
      where: {
        id: req.user.id,
      },
      include: userInclude,
    });

    console.log(user);

    return res.status(200).json(r({ status: "success", data: { user } }));
  } catch (e) {
    logger.error(e);
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      return res.status(400).json(r({ status: "fail", message: e.message }));
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

/**
 * Login Controller
 * @param {Express.Request} req
 * @param {Express.Response} res
 */
async function choose(req, res) {
  try {
    const { breakfast, lunch, dinner, date } = await v.user.choose.parseAsync(
      req.body
    );

    const time = date || Date.now();

    const dateAdd = new Date(time).toISOString().split("T")[0];

    let history = await prisma.foodHistory.findMany({
      where: {
        userId: Number(req.user.id),
      },
    });

    const dateString = date.toISOString().split("T")[0];

    const foundList = await Promise.all( history.filter((e) => e.date == dateString));

    const found = foundList.at(-1);

    const recData = await prisma.reccomendation.findFirstOrThrow({
      where: {
        userId: Number(req.user.id),
      },
    });

    if (found) {
      const updateFood = await prisma.foodHistory.update({
        where: {
          id: found.id,
        },
        data: {
          breakfastId: breakfast.RecipeId,
          lunchId: lunch.id,
          dinnerId: dinner.id,
          calories: recData.id,
          protein: recData.protein,
        },
      });

      return res
        .status(200)
        .json(r({ status: "success", data: { updateFood } }));
    }

    const chooseFood = await prisma.foodHistory.create({
      data: {
        userId: Number(req.user.id),
        breakfastId: breakfast.id,
        lunchId: lunch.id,
        dinnerId: dinner.id,
        calories: recData.calories,
        protein: recData.protein,
        date: dateAdd,
      },
    });

    return res.status(200).json(r({ status: "success", data: { chooseFood } }));
  } catch (e) {
    logger.error(e);
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      return res
        .status(400)
        .json(r({ status: "fail", message: "Prisma parameter error" }));
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

/**
 * Login Controller
 * @param {Express.Request} req
 * @param {Express.Response} res
 */
async function getFood(req, res) {
  try {
    const { date } = await v.user.getFood.parseAsync(req.query);

    let history = await prisma.foodHistory.findMany({
      where: {
        userId: Number(req.user.id),
      },
    });

    const dateString = date.toISOString().split("T")[0];

    const foundList = await Promise.all( history.filter((e) => e.date == dateString));

    const found = foundList.at(-1);

    if (!found) {
      return res
        .status(404)
        .json(r({ status: "fail", message: "data not found" }));
    }

    const breakfastFound = await prisma.food.findUnique({
      where: {
        id: found.breakfastId,
      },
    });

    const lunchFound = await prisma.food.findUnique({
      where: {
        id: found.lunchId,
      },
    });

    const dinnerFound = await prisma.food.findUnique({
      where: {
        id: found.dinnerId,
      },
    });

    return res.status(200).json(
      r({
        status: "success",
        data: {
          id: found.id,
          calories: found.calories,
          protein: found.protein,
          breakfast: breakfastFound,
          lunch: lunchFound,
          dinner: dinnerFound,
        },
      })
    );
  } catch (e) {
    logger.error(e);
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      return res
        .status(400)
        .json(r({ status: "fail", message: "Prisma parameter error" }));
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

export default { update, choose, getFood };
