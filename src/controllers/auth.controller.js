// eslint-disable-next-line no-unused-vars
import Express from "express";
import bcrypt from "bcrypt";
import prisma from "../config/prisma.js";
import otpGenerator from "otp-generator";
import sendEmail from "../utils/sendEmail.js";
import v from "../validations/auth.validation.js";
import { compare, hash } from "bcrypt";
import jwt from "jsonwebtoken";
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

    const token = jwt.sign(
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

// Cara mereset password
// 1. Kirim POST request ke /v1/auth/forgot-password dengan mencantumkan email pada body
// contoh: {
//   email: *email user*
// }
// 2. Setelah OTP berhasil dikirim ke email tersebut kirim POST request ke /v1/auth/forgot-password
// dengan mencantumkan email dan kode OTP pada body
// contoh: {
//   email:"email user",
//   otp:"0000",
// }
// 3 Setelah OTP divalidasi kirim POST request ke /v1/auth/forgot-password dengan mencantumkan email dan password baru yang akan digunakan
// contoh: {
//   email:"email user",
//   newPassword:"newPassword",
// }

async function forgotPassword(req, res) {
  try {
    // TODO modify this function
    const { email, otp, newPassword } = req.body;

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

    if (!otp && !newPassword) {
      //requesting otp code
      //generate otp code
      const otp = await otpGenerator.generate(4, {
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
        "fikrialbariq01@gmail.com",
        "kalorize OTP",
        `Use this OTP code *${otp}* to reset your kalorize account password.`
      );

      return res.status(200).send(`otp generation success`);
    }

    if (!newPassword) {
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

      const tenMinutesLater = new Date(now.getTime() + 5 * 60 * 1000);

      await prisma.otp.update({
        data: {
          valid: true,
          lifetime: tenMinutesLater,
        },
        where: {
          userEmail: email,
        },
        select: null,
      });

      return res.status(200).send("Kode OTP berhasil diverivikasi");
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

      const now = new Date();

      const isTimeOut = now.getTime() > checkOTP.lifetime.getTime();

      if (isTimeOut) {
        throw new Error("Waktu mengganti password habis");
      }

      if (!checkOTP.valid) {
        throw new Error("Kode OTP belum dimasukkan");
      }

      const hashed = await bcrypt.hash(newPassword, 10);

      await prisma.user.update({
        data: {
          password: hashed,
        },
        where: {
          email: email,
        },
        select: null,
      });

      return res.status(200).send("Password berhasil diganti");
    }

    return res.sendStatus(200);
  } catch (error) {
    return res.status(400).send(error.message);
  }
}

export default { login, register, forgotPassword, me };
