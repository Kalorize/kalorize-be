import { Router } from "express";
import c from "../../controllers/index.js";
import m from "../../middlewares/index.js";
import upload from "../../config/multer.js";

const router = new Router();

router.put("/", m.auth.verify, upload.single("picture"), c.user.update);

export default router;
