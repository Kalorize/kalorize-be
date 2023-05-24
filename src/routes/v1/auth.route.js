import { Router } from "express";
import c from "../../controllers/index.js";
import m from "../../middlewares/index.js";

const router = new Router();

router.post("/login", c.auth.login);
router.post("/register", c.auth.register);
router.post("/forgot-password", c.auth.forgotPassword);
router.get("/me", m.auth.verify, c.auth.me);

export default router;
