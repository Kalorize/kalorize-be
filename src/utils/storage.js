import { Storage } from "@google-cloud/storage";
import { extname, join, resolve } from "path";
import logger from "../config/winston.js";
import { env, project, bucket } from "../config/vars.js";

const credentials = join(resolve(), "credentials.json");
console.log(credentials);

const storage =
  env === "production"
    ? new Storage()
    : new Storage({
        keyFilename: credentials,
        projectId: project,
      });

const bkt = storage.bucket(bucket);

/**
 * @param {Express.Multer.File} file
 * @param {string} dir
 * @returns {Promise<string>}
 */
export async function store(file, dir) {
  const name = `${alphabet(10)}${new Date().getTime()}${extname(
    file.originalname
  )}`;

  const path = `${dir}${name}`;

  const blob = bkt.file(path);
  const blobStream = blob.createWriteStream({
    resumable: false,
    metadata: {
      contentType: file.mimetype,
    },
  });

  return new Promise((resolve, reject) => {
    blobStream.on("error", (e) => {
      logger.error(e);
      reject(e);
    });

    blobStream.on("finish", async () => {
      logger.info(`file uploaded to ${path}`);
      resolve(path);
    });

    blobStream.end(file.buffer);
  });
}

/**
 * @param {number} length
 * @returns {string}
 */
function alphabet(length) {
  const alphabet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let id = "";

  while (id.length < length) {
    const randomIndex = Math.floor(Math.random() * alphabet.length);
    id += alphabet[randomIndex];
  }

  return id;
}
