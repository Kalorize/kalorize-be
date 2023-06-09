import { Router } from "express";
import c from "../../controllers/index.js";

const router = new Router();

router.get("/:id", c.food.get);

export default router;
