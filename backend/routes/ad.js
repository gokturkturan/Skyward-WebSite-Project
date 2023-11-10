import express from "express";
import adController from "../controllers/ad.js";

import { isAuth } from "../middlewares/isAuth.js";

const router = express.Router();

router.post("/create-ad", isAuth, adController.createAd);
router.post("/upload-image", isAuth, adController.uploadImage);
router.post("/delete-image", isAuth, adController.deleteImage);
router.get("/allAds", adController.allAds);
router.get("/ad/:slug", adController.singleAd);
router.post("/wishlist/:id", isAuth, adController.addToWishlist);
router.delete("/wishlist/:id", isAuth, adController.removeFromWishlist);

export default router;
