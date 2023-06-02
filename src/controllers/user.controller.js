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

/**
 * Login Controller
 * @param {Express.Request} req
 * @param {Express.Response} res
 */
async function choose(req, res) {
  try {
    const { breakfast, lunch, dinner, date } = await v.user.choose.parseAsync(req.body)
    
    const time = date || Date.now()

    const dateAdd = new Date(time).toISOString().split('T')[0]

    let history = await prisma.food_history.findMany({
      where : {
        userId : req.user.id
      }
    })

    let found = history.map(e => {
      if(e.date == dateAdd) {
        return e
      }
    })[0]

    if (found) {
      const updateFood = await prisma.food_history.update({
        where : {
          id : found.id
        },
        data : {
          breakfastId : breakfast.RecipeId,
          lunchId : lunch.RecipeId,
          dinnerId : dinner.RecipeId
        }
      })

      return res.status(200).json(r({ status: "success", data: { updateFood } }));
    }

    const chooseFood = await prisma.food_history.create({
      data : {
        userId : req.user.id,
        breakfastId : breakfast.RecipeId,
        lunchId : lunch.RecipeId,
        dinnerId : dinner.RecipeId,
        date : dateAdd
      }
    })

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
    const { date } = await v.user.getFood.parseAsync(req.body)

    let history = await prisma.food_history.findMany({
      where : {
        userId : req.user.id
      }
    })

    const dateString = date.toISOString().split('T')[0]

    let found = history.map(e => {
      if(e.date == dateString) {
        return e
      }
    })[0]

    if (!found) {
      return res.status(404).json(r({ status: "fail", message: "data not found"}));
    }

    return res.status(200).json(r({ status: "success", data: { found } }));
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
