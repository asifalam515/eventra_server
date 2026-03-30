import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Application, Request, Response } from "express";
import { AdminRouter } from "./app/module/Admin/admin.router";
import { AuthRouter } from "./app/module/Auth/auth.router";
import { eventRouter } from "./app/module/Event/event.router";
import { InvitationRouter } from "./app/module/Invitation/invitation.router";
import { ParticipationRouter } from "./app/module/Participation/participation.router";
import { PaymentController } from "./app/module/Payment/payment.controller";
import { PaymentRoute } from "./app/module/Payment/payment.route";
import { ReportRouter } from "./app/module/Report/report.router";
import { ReviewRouter } from "./app/module/Review/review.router";
import { userRouter } from "./app/module/User/user.router";
import { globalErrorHandler } from "./middleware/globalErrorHandler";
import { notFound } from "./middleware/notFound";

const app: Application = express();

// Enable URL-encoded form data parsing
app.use(express.urlencoded({ extended: true }));

// Stripe webhook needs raw payload
app.post(
  "/api/v1/payment/webhook",
  express.raw({ type: "application/json" }),
  PaymentController.stripeWebhook,
);

// Middleware to parse JSON bodies
app.use(express.json());
app.use(cors());
app.use(cookieParser());

// Routers
app.use("/api/v1/auth", AuthRouter.router);
app.use("/api/v1/events", eventRouter.router);
app.use("/api/v1/user", userRouter.router);
app.use("/api/v1/participation", ParticipationRouter);
app.use("/api/v1/payment", PaymentRoute);
app.use("/api/v1/invitation", InvitationRouter);
app.use("/api/v1/review", ReviewRouter);
app.use("/api/v1/admin", AdminRouter);
app.use("/api/v1/report", ReportRouter);

app.get("/", (req: Request, res: Response) => {
  res.send("Eventra Server Started");
});

app.use(notFound);
app.use(globalErrorHandler);

export default app;
