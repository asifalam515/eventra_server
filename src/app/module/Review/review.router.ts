import { Router } from "express";
import auth, { UserRole } from "../../../middleware/auth";
import { ReviewController } from "./review.controller";

const router = Router();

router.post("/", auth(UserRole.user, UserRole.admin), ReviewController.createReview);
router.get("/event/:eventId", ReviewController.getReviewsByEvent);
router.patch("/:id", auth(UserRole.user, UserRole.admin), ReviewController.updateReview);
router.delete("/:id", auth(UserRole.user, UserRole.admin), ReviewController.deleteReview);

export const ReviewRouter = router;
