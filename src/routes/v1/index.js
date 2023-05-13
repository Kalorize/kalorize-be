import { Router } from "express";
import auth from "./auth.route.js";

const router = new Router();

router.get("/", (req, res) => res.sendStatus(200));
router.use("/auth", auth);

export default router;
