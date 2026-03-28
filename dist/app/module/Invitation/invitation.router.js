import { Router } from "express";
import auth, { UserRole } from "../../../middleware/auth";
import { InvitationController } from "./invitation.controller";
const router = Router();
router.post("/send", auth(UserRole.admin, UserRole.user), InvitationController.sendInvitation);
router.patch("/:id/accept", auth(UserRole.user, UserRole.admin), InvitationController.acceptInvitation);
router.patch("/:id/decline", auth(UserRole.user, UserRole.admin), InvitationController.declineInvitation);
router.get("/my-invitations", auth(UserRole.user, UserRole.admin), InvitationController.getUserInvitations);
export const InvitationRouter = router;
//# sourceMappingURL=invitation.router.js.map