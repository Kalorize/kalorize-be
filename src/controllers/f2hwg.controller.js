import axios from "axios";
import r from "../utils/response.js";
import FormData from "form-data";
import fs from "fs";
import { unlink } from "fs/promises";
import { mlApiBaseUrl, mlApiKey } from "../config/vars.js";

/**
 * @param {Express.Request} req
 * @param {Express.Response} res
 */
async function predict(req, res) {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json(r({ status: "fail", message: "picture is required" }));
    }

    const data = new FormData();

    data.append("picture", fs.createReadStream(req.file.path), {
      filename: req.file.filename,
      contentType: req.file.mimetype,
    });

    const api = await axios.post(`${mlApiBaseUrl}/f2hwg`, data, {
      headers: data.getHeaders({
        "x-api-key": mlApiKey,
      }),
    });

    unlink(req.file.path);

    return res.status(200).json(api.data);
  } catch (e) {
    console.log(e);
    return res.status(400).json(r({ status: "fail", message: e.message }));
  }
}

export default { predict };
