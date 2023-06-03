// eslint-disable-next-line no-unused-vars
import Express from "express";
import bcrypt from "bcrypt";
import prisma from "../config/prisma.js";
import otpGenerator from "otp-generator";
import sendEmail from "../utils/sendEmail.js";
import v from "../validations/index.js";
import { compare, hash } from "bcrypt";
import jwt from "jsonwebtoken";
import { jwtSecret } from "../config/vars.js";
import logger from "../config/winston.js";
import r from "../utils/response.js";
import { Prisma } from "@prisma/client";
import { ZodError } from "zod";
import { userInclude } from "../constants/index.js";

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
      return res
        .status(401)
        .json(r({ status: "fail", message: "Invalid password" }));
    }

    const token = jwt.sign(
      {
        id: user.id,
      },
      jwtSecret
    );

    return res
      .status(200)
      .json(r({ status: "success", data: { token, user } }));
  } catch (e) {
    logger.error(e);

    if (e instanceof ZodError) {
      return res.status(400).json(
        r({
          status: "fail",
          message: "Input validation error",
          data: e.errors,
        })
      );
    }

    return res.status(400).json(r({ status: "fail", message: e.message }));
  }
}

/**
 * Register Controller
 * @param {Express.Request} req
 * @param {Express.Response} res
 */
async function register(req, res) {
  try {
    const { name, email, password, repassword } =
      await v.auth.register.parseAsync(req.body);

    if (password !== repassword) {
      return res
        .status(401)
        .json(r({ status: "fail", message: "password didnt match" }));
    }

    const hashedPassword = await hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
      select: {
        id: true,
        name: true,
        email: true,
        password: true,
      },
    });

    return res.status(201).json(r({ status: "success", data: { user } }));
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
          data: e.errors,
        })
      );
    }

    return res.status(400).json(r({ status: "fail", message: e.message }));
  }
}

/**
 * @param {Express.Request} req
 * @param {Express.Response} res
 */
async function me(req, res) {
  try {
    // const user = req.user;
    const user = await prisma.user.findUnique({
      where: {
        id: Number(req.user.id),
      },
      include: userInclude,
    });
    return res.status(200).json(r({ status: "success", data: { user } }));
  } catch (e) {
    return res.status(401).json(r({ status: "fail", message: e.message }));
  }
}

/**
 * Forgot Password Controller
 * @param {Express.Request} req
 * @param {Express.Response} res
 */

async function forgotPassword(req, res) {
  try {
    // TODO modify this function
    const { email, otp, newpassword, renewpassword } = req.body;

    if (!email) {
      throw new Error("need to attach email");
    }

    const user = await prisma.User.findUnique({
      where: {
        email: email,
      },
    });

    if (!user) {
      throw new Error("user not found");
    }

    if (!otp && !newpassword) {
      //requesting otp code
      //generate otp code
      const otp = otpGenerator.generate(4, {
        lowerCaseAlphabets: false,
        upperCaseAlphabets: false,
        specialChars: false,
      });

      // waktu sekarang
      const now = new Date();

      // waktu sekarang + 10 menit
      const tenMinutesLater = new Date(now.getTime() + 10 * 60 * 1000);

      await prisma.otp.upsert({
        // jika email sudah tersedia, maka akan mengubah expired
        // jika email tidak ada dalam database maka akan
        // membuat record baru
        create: {
          code: otp,
          userEmail: email,
          chance: 3,
          expired: tenMinutesLater,
        },
        update: {
          expired: tenMinutesLater,
          code: otp,
          valid: false,
          chance: 3,
          lifetime: null,
        },
        where: {
          userEmail: email,
        },
        select: null,
      });

      await sendEmail(
        email,
        "Kalorize OTP",
        `Use this OTP code *${otp}* to reset your kalorize account password.`
      );

      return res
        .status(200)
        .json(r({ status: "success", message: "otp generation success" }));
    }

    if (!newpassword) {
      //verifying the otp code
      const checkOTP = await prisma.otp.findFirst({
        where: {
          userEmail: email,
        },
        select: {
          expired: true,
          chance: true,
          valid: true,
          code: true,
        },
      });

      if (!checkOTP) {
        throw new Error("OTP untuk nomor hp yang dipilih tidak tersedia");
      }

      const now = new Date();

      const isExpired = now.getTime() > checkOTP.expired.getTime();

      if (isExpired) {
        throw new Error("Kode OTP kadaluarsa, mohon buat kode OTP baru");
      }

      if (checkOTP.chance === null) {
        throw new Error("Sudah melewati batas 3 kali verifikasi OTP");
      }

      const chance =
        checkOTP.chance === 1
          ? {
              chance: null,
              lifetime: null,
            }
          : {
              chance: { decrement: 1 },
            };

      if (checkOTP.code !== otp) {
        await prisma.otp.update({
          data: {
            ...chance,
          },
          where: {
            userEmail: email,
          },
          select: null,
        });

        throw new Error("Kode OTP salah");
      }

      const fiveMinutesLater = new Date(now.getTime() + 5 * 60 * 1000);

      await prisma.otp.update({
        data: {
          valid: true,
          lifetime: fiveMinutesLater,
        },
        where: {
          userEmail: email,
        },
        select: null,
      });

      return res
        .status(200)
        .json(
          r({ status: "success", message: "Kode OTP berhasil diverivikasi" })
        );
    }

    if (!otp) {
      //change the password
      const checkOTP = await prisma.otp.findFirst({
        where: {
          userEmail: email,
        },
        select: {
          lifetime: true,
          valid: true,
        },
      });

      if (newpassword !== renewpassword) {
        return res
          .status(401)
          .json(r({ status: "fail", message: "password didnt match" }));
      }

      const now = new Date();

      const isTimeOut = now.getTime() > checkOTP.lifetime.getTime();

      if (isTimeOut) {
        throw new Error("Waktu mengganti password habis");
      }

      if (!checkOTP.valid) {
        throw new Error("Kode OTP belum dimasukkan");
      }

      const hashed = await bcrypt.hash(newpassword, 10);

      await prisma.user.update({
        data: {
          password: hashed,
        },
        where: {
          email: email,
        },
        select: null,
      });

      return res
        .status(200)
        .json(r({ status: "success", message: "Password berhasil diganti" }));
    }

    return res.status(200).json(r({ status: "success" }));
  } catch (e) {
    logger.error(e);

    return res.status(400).json(r({ status: "fail", message: e.message }));
  }
}

export default { login, register, forgotPassword, me };
