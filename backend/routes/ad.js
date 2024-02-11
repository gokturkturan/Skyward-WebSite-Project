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
router.post("/contact-seller", isAuth, adController.contactSeller);
router.get("/user-ads/:page", isAuth, adController.userAds);
router.put("/ad/:id", isAuth, adController.editAd);

export default router;
