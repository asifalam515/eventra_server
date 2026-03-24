import { Router } from "express";
import { UserController } from "./user.controller";
const router = Router();
router.patch("/profile/:id", UserController.updateUserProfile);
router.get("/:id", UserController.getUserById);
export const userRouter = { router };
//# sourceMappingURL=user.router.js.map