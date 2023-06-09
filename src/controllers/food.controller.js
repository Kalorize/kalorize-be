import { z } from "zod";
import r from "../utils/response.js";
import prisma from "../config/prisma.js";

/**
 * @param {Express.Request} req
 * @param {Express.Response} res
 */
async function get(req, res) {
  try {
    const id = await z.coerce.number().parseAsync(req.params["id"]);

    const food = await prisma.food.findUniqueOrThrow({
      where: { id },
    });

    return res.status(200).json(r({ status: "success", data: { food } }));
  } catch (e) {
    return res.status(500).json(r({ status: "error", message: e.message }));
  }
}

export default { get };
