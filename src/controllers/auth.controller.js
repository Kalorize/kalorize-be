// eslint-disable-next-line no-unused-vars
import Express from "express";

/**
 * Login Controller
 * @param {Express.Request} req
 * @param {Express.Response} res
 */
async function login(req, res) {
  // TODO modify this function
  return res.sendStatus(200);
}

/**
 * Register Controller
 * @param {Express.Request} req
 * @param {Express.Response} res
 */
async function register(req, res) {
  // TODO modify this function
  return res.sendStatus(200);
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

export { login, register, forgotPassword };
