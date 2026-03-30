import httpStatus from "http-status";
import Stripe from "stripe";
import { prisma } from "../../../lib/prisma";
import { AppError } from "../../errors/AppErrors";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {});

const markPaymentAsPaid = async (transactionId: string) => {
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
};

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
    const payment = await prisma.payment.findUnique({
      where: { transactionId },
    });
    if (!payment) {
      console.error(
        `Payment record not found for transaction: ${transactionId}`,
      );
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
  const existingIntent = await stripe.paymentIntents.retrieve(transactionId);

  if (
    existingIntent.status === "succeeded" ||
    existingIntent.status === "processing" ||
    existingIntent.status === "requires_capture"
  ) {
    await markPaymentAsPaid(transactionId);
    return {
      status: "PAID",
      paymentIntentStatus: existingIntent.status,
      alreadyConfirmed: true,
    };
  }

  if (existingIntent.status === "requires_action") {
    return {
      status: "PENDING_ACTION",
      paymentIntentStatus: existingIntent.status,
      clientSecret: existingIntent.client_secret,
    };
  }

  if (existingIntent.status !== "requires_confirmation") {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `Payment cannot be confirmed in current state: ${existingIntent.status}`,
    );
  }

  const paymentIntent = await stripe.paymentIntents.confirm(transactionId);

  if (
    paymentIntent.status === "succeeded" ||
    paymentIntent.status === "processing" ||
    paymentIntent.status === "requires_capture"
  ) {
    await markPaymentAsPaid(transactionId);

    return {
      status: "PAID",
      paymentIntentStatus: paymentIntent.status,
      alreadyConfirmed: false,
    };
  }

  if (paymentIntent.status === "requires_action") {
    return {
      status: "PENDING_ACTION",
      paymentIntentStatus: paymentIntent.status,
      clientSecret: paymentIntent.client_secret,
    };
  } else {
    throw new AppError(httpStatus.BAD_REQUEST, "Payment confirmation failed");
  }
};

export const PaymentService = {
  createPaymentIntent,
  handleStripeWebhook,
  confirmPayment,
};
