import { Router } from "express";
import auth, { UserRole } from "../../../middleware/auth";
import { ParticipationController } from "./participation.controller";

const router = Router();
router.post(
  "/join",
  auth(UserRole.admin, UserRole.user),
  ParticipationController.joinEvent,
);
router.patch(
  "/update-status",
  auth(UserRole.admin,UserRole.user),
  ParticipationController.updateParticipationStatus,
);
router.get(
  "/:eventId",
  auth(UserRole.admin, UserRole.user),
  ParticipationController.getAllParticipants,
);

export const ParticipationRouter = router;
