import { Router } from "express";
import { AuthController } from "./auth.controller";

const router = Router();
router.get("/me", AuthController.getUserFromToken);
router.post("/register", AuthController.createUser);
router.post("/login", AuthController.loginUser);
router.post("/logout", AuthController.logoutUser);

export const AuthRouter = { router };
