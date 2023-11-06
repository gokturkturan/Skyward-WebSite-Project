import express from "express";
import adController from "../controllers/ad.js";

import { isAuth } from "../middlewares/isAuth.js";

const router = express.Router();

router.post("/create-ad", isAuth, adController.createAd);
router.post("/upload-image", isAuth, adController.uploadImage);
router.post("/delete-image", isAuth, adController.deleteImage);
router.get("/allAds", adController.AllAds);

export default router;
