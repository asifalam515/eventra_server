import express from "express";
import { PaymentController } from "./payment.controller";
import auth, { UserRole } from "../../../middleware/auth";
const router = express.Router();
router.post("/create-intent", auth(UserRole.user, UserRole.admin, UserRole.moderator), PaymentController.createPaymentIntent);
export const PaymentRoute = router;
//# sourceMappingURL=payment.route.js.map