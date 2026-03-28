import { catchAsync } from "../../../utils/catchAsync";
import sendResponse from "../../../utils/sendResponse";
import { PaymentService } from "./payment.service";
import httpStatus from "http-status";
import Stripe from "stripe";
import { AppError } from "../../errors/AppErrors";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {});
const createPaymentIntent = catchAsync(async (req, res) => {
    const { eventId } = req.body;
    const user = req.user;
    if (!user || !user.email) {
        throw new AppError(httpStatus.UNAUTHORIZED, "User not authenticated");
    }
    const result = await PaymentService.createPaymentIntent(user.email, eventId);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Payment intent created successfully",
        data: result,
    });
});
const stripeWebhook = async (req, res) => {
    const sig = req.headers["stripe-signature"];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
    let event;
    try {
        if (!endpointSecret)
            throw new Error("Stripe webhook secret is missing");
        event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    }
    catch (err) {
        console.error(`Webhook Error: ${err.message}`);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }
    try {
        await PaymentService.handleStripeWebhook(event);
        res.status(200).json({ received: true });
    }
    catch (error) {
        console.error(`Webhook handler error:`, error);
        res.status(500).send("Internal Server Error");
    }
};
const confirmPayment = catchAsync(async (req, res) => {
    const { transactionId } = req.body;
    if (!transactionId) {
        throw new AppError(httpStatus.BAD_REQUEST, "transactionId is required");
    }
    const result = await PaymentService.confirmPayment(transactionId);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Payment confirmed successfully",
        data: result,
    });
});
export const PaymentController = {
    createPaymentIntent,
    stripeWebhook,
    confirmPayment,
};
//# sourceMappingURL=payment.controller.js.map