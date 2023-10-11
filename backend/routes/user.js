import express from "express";
import userController from "../controllers/user.js";

const router = express.Router();

router.post("/login", userController.login);
router.post("/pre-register", userController.preRegister);
router.post("/register", userController.register);
router.post("/login", userController.login);

export default router;
