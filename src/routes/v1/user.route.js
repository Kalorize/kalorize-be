import { Router } from "express";
import c from "../../controllers/index.js";
import m from "../../middlewares/index.js";

const router = new Router();

router.post("/setup", m.auth.verify, c.user.setup);

export default router;
