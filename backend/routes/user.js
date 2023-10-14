import express from "express";
import userController from "../controllers/user.js";
import {
  isEmailValid,
  isPasswordValid,
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
router.put(
  "/update-password",
  isAuth,
  isPasswordValid,
  userController.updatePassword
);
router.put("/update-profile", isAuth, userController.updateProfile);

export default router;
