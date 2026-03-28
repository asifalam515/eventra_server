import { Router } from "express";
import auth, { UserRole } from "../../../middleware/auth";
import { ReportController } from "./report.controller";
const router = Router();
// Users, Admins, and Moderators can all report
const requireAuth = auth(UserRole.user, UserRole.admin, UserRole.moderator);
router.post("/", requireAuth, ReportController.createReport);
export const ReportRouter = router;
//# sourceMappingURL=report.router.js.map