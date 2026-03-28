import { Router } from "express";
import auth, { UserRole } from "../../../middleware/auth";
import { AdminController } from "./admin.controller";
const router = Router();
const requireAdmin = auth(UserRole.admin);
// User Management
router.get("/users", requireAdmin, AdminController.getAllUsers);
router.get("/users/:id", requireAdmin, AdminController.getSingleUser);
router.put("/users/:id/ban", requireAdmin, AdminController.banUser);
router.put("/users/:id/role", requireAdmin, AdminController.updateUserRole);
// Events & Reviews
router.get("/events", requireAdmin, AdminController.getAllEvents);
router.get("/events/:id", requireAdmin, AdminController.getSingleEvent);
router.delete("/events/:id", requireAdmin, AdminController.deleteEvent);
router.put("/events/:id/feature", requireAdmin, AdminController.toggleEventFeature);
router.delete("/reviews/:id", requireAdmin, AdminController.deleteReview);
// Activity Logs & Reports & Analytics
router.get("/analytics", requireAdmin, AdminController.getDashboardAnalytics);
router.get("/activity-logs", requireAdmin, AdminController.getActivityLogs);
router.get("/reports", requireAdmin, AdminController.getAllReports);
router.put("/reports/:id/status", requireAdmin, AdminController.updateReportStatus);
export const AdminRouter = router;
//# sourceMappingURL=admin.router.js.map