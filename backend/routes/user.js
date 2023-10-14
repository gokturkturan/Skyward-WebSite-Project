import express from "express";
import userController from "../controllers/user.js";
import isEmailPasswordValid from "../middlewares/checkEmailPassword.js";
import { isAuth } from "../middlewares/isAuth.js";

const router = express.Router();

router.post("/pre-register", isEmailPasswordValid, userController.preRegister);
router.post("/register", userController.register);
router.post("/login", isEmailPasswordValid, userController.login);
router.post("/forgot-password", userController.forgotPassword);
router.post("/access-account", userController.accessAccount);
router.get("/refresh-token", userController.refreshToken);
router.get("/current-user", isAuth, userController.currentUser);

export default router;
