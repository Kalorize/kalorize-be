import multer from "multer";
import { join, resolve, extname } from "path";

export const upload = multer({
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});

/**
 * @param {Express.Request} req
 * @param {Express.Multer.File} file
 * @param {(error: Error | null, destination: string) => void} cb
 */
const filename = (req, file, cb) => {
  const name = `${Date.now()}${extname(file.originalname)}`;
  cb(null, name);
};

export const temp = multer({
  dest: "temp",
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  storage: multer.diskStorage({
    destination: join(resolve(), "temp"),
    filename,
  }),
});

export default { upload, temp };
