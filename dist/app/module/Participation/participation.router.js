import { Router } from "express";
import auth, { UserRole } from "../../../middleware/auth";
import { ParticipationController } from "./participation.controller";
const router = Router();
router.post("/join", auth(UserRole.admin, UserRole.user), ParticipationController.joinEvent);
export const ParticipationRouter = router;
//# sourceMappingURL=participation.router.js.map