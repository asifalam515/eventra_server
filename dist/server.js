import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import { AuthRouter } from "./app/module/Auth/auth.router";
import { eventRouter } from "./app/module/Event/event.router";
import { InvitationRouter } from "./app/module/Invitation/invitation.router";
import { ParticipationRouter } from "./app/module/Participation/participation.router";
import { PaymentController } from "./app/module/Payment/payment.controller";
import { PaymentRoute } from "./app/module/Payment/payment.route";
import { ReviewRouter } from "./app/module/Review/review.router";
import { userRouter } from "./app/module/User/user.router";
import { globalErrorHandler } from "./middleware/globalErrorHandler";
import { notFound } from "./middleware/notFound";
import { AdminRouter } from "./app/module/Admin/admin.router";
import { ReportRouter } from "./app/module/Report/report.router";
const app = express();
const port = 5000; // The port your express server will be running on.
// Enable URL-encoded form data parsing
app.use(express.urlencoded({ extended: true }));
// Stripe webhook needs raw payload
app.post("/api/v1/payment/webhook", express.raw({ type: "application/json" }), PaymentController.stripeWebhook);
// Middleware to parse JSON bodies
app.use(express.json());
app.use(cors());
app.use(cookieParser());
// routers
app.use("/api/v1/auth", AuthRouter.router);
// events
app.use("/api/v1/event", eventRouter.router);
app.use("/api/v1/user", userRouter.router);
app.use("/api/v1/participation", ParticipationRouter);
app.use("/api/v1/payment", PaymentRoute);
app.use("/api/v1/invitation", InvitationRouter);
app.use("/api/v1/review", ReviewRouter);
app.use("/api/v1/admin", AdminRouter);
app.use("/api/v1/report", ReportRouter);
app.use(notFound);
app.use(globalErrorHandler);
// Basic route
app.get("/", (req, res) => {
    res.send("Eventra Server Started");
});
// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
//# sourceMappingURL=server.js.map