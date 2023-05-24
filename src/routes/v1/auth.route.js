import { Router } from "express";
import {
  login,
  register,
  forgotPassword,
  me,
} from "../../controllers/auth.controller.js";
import { auth } from "../../middlewares/auth.middleware";

const router = new Router();

router.post("/login", login);
router.post("/register", register);
router.post("/forgot-password", forgotPassword);
router.get("/me", auth, me);
export default router;
