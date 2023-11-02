import express from "express";
import adController from "../controllers/ad.js";

import { isAuth } from "../middlewares/isAuth.js";

const router = express.Router();

router.post("/upload-image", isAuth, adController.uploadImage);
router.post("/delete-image", isAuth, adController.deleteImage);

export default router;
