import { Router } from "express";
import auth, { UserRole } from "../../../middleware/auth";
import { ParticipationController } from "./participation.controller";

const router = Router();
router.patch(
  "/update-status",
  auth(UserRole.admin, UserRole.user),
  ParticipationController.updateParticipationStatus,
);
router.post(
  "/join",
  auth(UserRole.admin, UserRole.user),
  ParticipationController.joinEvent,
);

router.get(
  "/:eventId",
  auth(UserRole.admin, UserRole.user),
  ParticipationController.getAllParticipants,
);

export const ParticipationRouter = router;
