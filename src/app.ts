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

const apiV1Prefixes = ["/api/v1", "/v1"] as const;

// Enable URL-encoded form data parsing
app.use(express.urlencoded({ extended: true }));

// Stripe webhook needs raw payload
for (const prefix of apiV1Prefixes) {
  app.post(
    `${prefix}/payment/webhook`,
    express.raw({ type: "application/json" }),
    PaymentController.stripeWebhook,
  );
}

// Middleware to parse JSON bodies
app.use(express.json());
app.use(cors());
app.use(cookieParser());

// Routers
app.use("/auth", AuthRouter.router);
app.use("/events", eventRouter.router);
app.use("/user", userRouter.router);
app.use("/participation", ParticipationRouter);
app.use("/payment", PaymentRoute);
app.use("/invitation", InvitationRouter);
app.use("/review", ReviewRouter);
app.use("/admin", AdminRouter);
app.use("/report", ReportRouter);

app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({ status: "ok" });
});
app.get("/", (req: Request, res: Response) => {
  res.send("Eventra Server Started");
});

app.use(notFound);
app.use(globalErrorHandler);

export default app;
