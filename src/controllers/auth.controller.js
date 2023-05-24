// eslint-disable-next-line no-unused-vars
import Express from "express";
import v from "../validations/index.js";
import prisma from "../config/prisma.js";
import { compare, hash } from "bcrypt";
import { sign } from "jsonwebtoken";
import { jwtExpired, jwtSecret } from "../config/vars.js";

/**
 * Login Controller
 * @param {Express.Request} req
 * @param {Express.Response} res
 */
async function login(req, res) {
  try {
    const { email, password } = await v.auth.login.parseAsync(req.body);

    const user = await prisma.user.findUniqueOrThrow({
      where: {
        email,
      },
    });

    const valid = await compare(password, user.password);

    if (!valid) {
      return res.sendStatus(401);
    }

    const token = sign(
      {
        id: user.id,
      },
      jwtSecret,
      {
        expiresIn: jwtExpired,
      }
    );

    return res.status(200).json({ token, user });
  } catch (e) {
    return res.sendStatus(400);
  }
}

/**
 * Register Controller
 * @param {Express.Request} req
 * @param {Express.Response} res
 */
async function register(req, res) {
  try {
    const { email, password, repassword } = await v.auth.register.parseAsync(
      req.body
    );

    if (password !== repassword) {
      return res.sendStatus(401);
    }

    const hashedPassword = await hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        hashedPassword,
      },
    });

    return res.status(201).json(user);
  } catch (e) {
    return res.sendStatus(400);
  }
}

/**
 * @param {Express.Request} req
 * @param {Express.Response} res
 */
async function me(req, res) {
  try {
    return res.status(200).json(req.user);
  } catch (e) {
    return res.sendStatus(401);
  }
}

/**
 * Forgot Password Controller
 * @param {Express.Request} req
 * @param {Express.Response} res
 */
async function forgotPassword(req, res) {
  // TODO modify this function
  return res.sendStatus(200);
}

export default { me, login, register, forgotPassword };
