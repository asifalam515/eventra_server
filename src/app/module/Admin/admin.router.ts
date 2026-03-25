import { Router } from "express";
import auth, { UserRole } from "../../../middleware/auth";
import { AdminController } from "./admin.controller";

const router = Router();

const requireAdmin = auth(UserRole.admin);

router.get("/users", requireAdmin, AdminController.getAllUsers);
router.get("/users/:id", requireAdmin, AdminController.getSingleUser);
router.put("/users/:id/ban", requireAdmin, AdminController.banUser);

router.get("/events", requireAdmin, AdminController.getAllEvents);
router.get("/events/:id", requireAdmin, AdminController.getSingleEvent);
router.delete("/events/:id", requireAdmin, AdminController.deleteEvent);
router.put("/events/:id/feature", requireAdmin, AdminController.toggleEventFeature);

router.delete("/reviews/:id", requireAdmin, AdminController.deleteReview);

router.get("/analytics", requireAdmin, AdminController.getDashboardAnalytics);

export const AdminRouter = router;
