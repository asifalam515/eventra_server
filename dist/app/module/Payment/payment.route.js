import express from "express";
import auth, { UserRole } from "../../../middleware/auth";
import { PaymentController } from "./payment.controller";
const router = express.Router();
router.post("/create-intent", auth(UserRole.user), PaymentController.createPaymentIntent);
router.post("/confirm", auth(UserRole.user), PaymentController.confirmPayment);
export const PaymentRoute = router;
//# sourceMappingURL=payment.route.js.map