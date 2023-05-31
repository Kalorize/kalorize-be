import { Router } from "express";
import c from "../../controllers/index.js";
import m from "../../middlewares/index.js";

const router = new Router();

router.put("/", m.auth.verify, c.user.update);

export default router;
