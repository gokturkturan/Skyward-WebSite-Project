import express from "express";
import userController from "../controllers/user.js";
import {
  isEmailValid,
  isPasswordValid,
  checkNewPassword,
} from "../middlewares/checkEmailPassword.js";
import { isAuth } from "../middlewares/isAuth.js";

const router = express.Router();

router.post(
  "/pre-register",
  isEmailValid,
  isPasswordValid,
  userController.preRegister
);
router.post("/register", userController.register);
router.post("/login", isEmailValid, isPasswordValid, userController.login);
router.post("/forgot-password", userController.forgotPassword);
router.post("/access-account", userController.accessAccount);
router.get("/refresh-token", userController.refreshToken);
router.get("/current-user", isAuth, userController.currentUser);
router.get("/profile/:username", userController.getProfile);
router.post(
  "/update-password",
  isAuth,
  checkNewPassword,
  userController.updatePassword
);
router.put("/update-profile", isAuth, userController.updateProfile);
router.post("/upload-image", isAuth, userController.uploadImage);
router.post("/delete-image", isAuth, userController.deleteImage);

export default router;
