import { Router } from "express";
import auth from "./auth.route.js";
import user from "./user.route.js";

const router = new Router();

router.use("/auth", auth);
router.use("/user", user);

export default router;
