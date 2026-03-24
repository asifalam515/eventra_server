import { prisma } from "../../../lib/prisma";
import { AppError } from "../../errors/AppErrors";
import httpStatus from "http-status";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {});

const createPaymentIntent = async (userEmail: string, eventId: string) => {
  // Check user and event
  const user = await prisma.user.findUnique({ where: { email: userEmail } });
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  const event = await prisma.event.findUnique({ where: { id: eventId } });
  if (!event) {
    throw new AppError(httpStatus.NOT_FOUND, "Event not found");
  }

  if (event.fee <= 0) {
    throw new AppError(httpStatus.BAD_REQUEST, "Event is free");
  }

  // Create payment intent
  const amount = Math.round(event.fee * 100); // Amount in cents

  const paymentIntent = await stripe.paymentIntents.create({
    amount,
    currency: "usd", // default to USD
    metadata: {
      userId: user.id,
      eventId: event.id,
    },
  });

  // Log in DB as UNPAID
  const payment = await prisma.payment.create({
    data: {
      amount: event.fee,
      status: "UNPAID",
      transactionId: paymentIntent.id,
      userId: user.id,
      eventId: event.id,
    },
  });

  return {
    clientSecret: paymentIntent.client_secret,
    transactionId: payment.transactionId,
  };
};

const handleStripeWebhook = async (event: Stripe.Event) => {
  if (event.type === "payment_intent.succeeded") {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;
    const transactionId = paymentIntent.id;

    // Find the corresponding Payment record
    const payment = await prisma.payment.findUnique({ where: { transactionId } });
    if (!payment) {
      console.error(`Payment record not found for transaction: ${transactionId}`);
      return; 
    }

    // Update payment status to PAID
    await prisma.payment.update({
      where: { transactionId },
      data: { status: "PAID" },
    });

    // Also update Participant / Invitation payment status if they exist
    await prisma.participant.updateMany({
      where: {
        userId: payment.userId,
        eventId: payment.eventId,
      },
      data: {
        payment: "PAID",
      },
    });

    await prisma.invitation.updateMany({
      where: {
        userId: payment.userId,
        eventId: payment.eventId,
      },
      data: {
        payment: "PAID",
      },
    });
  }
};

const confirmPayment = async (transactionId: string) => {
  const paymentIntent = await stripe.paymentIntents.confirm(transactionId, {
    payment_method: "pm_card_visa",
    return_url: "http://localhost:5000",
  });

  if (
    paymentIntent.status === "succeeded" ||
    paymentIntent.status === "requires_action" ||
    paymentIntent.status === "processing"
  ) {
    const payment = await prisma.payment.findUnique({ where: { transactionId } });
    if (!payment) {
      throw new AppError(httpStatus.NOT_FOUND, "Payment record not found");
    }

    await prisma.payment.update({
      where: { transactionId },
      data: { status: "PAID" },
    });

    await prisma.participant.updateMany({
      where: { userId: payment.userId, eventId: payment.eventId },
      data: { payment: "PAID" },
    });

    await prisma.invitation.updateMany({
      where: { userId: payment.userId, eventId: payment.eventId },
      data: { payment: "PAID" },
    });

    return { status: "PAID" };
  } else {
    throw new AppError(httpStatus.BAD_REQUEST, "Payment confirmation failed");
  }
};

export const PaymentService = {
  createPaymentIntent,
  handleStripeWebhook,
  confirmPayment,
};
