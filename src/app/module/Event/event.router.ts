import { Router } from "express";
import auth, { UserRole } from "../../../middleware/auth";
import { EventController } from "./event.controller";

const router = Router();
router.get("/", EventController.getAllEvents);
router.post(
  "/",
  auth(UserRole.user, UserRole.admin, UserRole.moderator),
  EventController.createEvent,
);
router.get("/:id", EventController.getSingleEvent);
router.put(
  "/:id",
  auth(UserRole.user, UserRole.admin, UserRole.moderator),
  EventController.updateEvent,
);
router.delete(
  "/:id",
  auth(UserRole.user, UserRole.admin, UserRole.moderator),
  EventController.deleteEvent,
);
export const eventRouter = { router };
