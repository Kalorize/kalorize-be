import { Router } from "express";
import {
  login,
  register,
  forgotPassword,
} from "../../controllers/auth.controller.js";

const router = new Router();

router.post("/login", login);
router.post("/register", register);
router.post("/forgot-password", forgotPassword);

export default router;
