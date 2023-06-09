import { Router } from "express";
import auth from "./auth.route.js";
import user from "./user.route.js";
import f2hwg from "./f2hwg.route.js";
import food from "./food.route.js";

const router = new Router();

router.use("/auth", auth);
router.use("/user", user);
router.use("/f2hwg", f2hwg);
router.use("/food", food);

export default router;
