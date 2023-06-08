import { Router } from "express";
import c from "../../controllers/index.js";
import m from "../../middlewares/index.js";
import f from "../../config/multer.js";

const router = new Router();

router.post("/", m.auth.verify, f.temp.single("picture"), c.f2hwg.predict);

export default router;
