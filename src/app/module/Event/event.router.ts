import { Router } from "express";
import auth, { UserRole } from "../../../middleware/auth";
import { EventController } from "./event.controller";

const router = Router();
router.post(
  "/",
  auth(UserRole.user, UserRole.admin, UserRole.moderator),
  EventController.createEvent,
);
export const eventRouter = { router };
