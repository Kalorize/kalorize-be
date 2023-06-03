import axios from "axios";
import r from "../utils/response.js";
import FormData from "form-data";

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

    console.log(req.file);

    data.append("picture", req.file.buffer, {
      filename: req.file.filename,
      contentType: req.file.mimetype,
    });

    const api = await axios.post(
      "https://f2hwg-cwx4yokorq-et.a.run.app/f2hwg",
      data,
      {
        headers: data.getHeaders({
          "x-api-key": "kalorize-ml",
        }),
      }
    );

    return res.status(200).json(api.data);
  } catch (e) {
    console.log(e.message);
    return res.status(400).json(r({ status: "fail", message: e.message }));
  }
}

export default { predict };
