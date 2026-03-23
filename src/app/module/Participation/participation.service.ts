import { prisma } from "../../../lib/prisma";

const joinEvent = async (userId: string, eventId: string) => {
  // 1. Check if event exists
  const event = await prisma.event.findUnique({
    where: { id: eventId },
  });

  if (!event) {
    throw new Error("Event not found");
  }

  // 2. Prevent duplicate participation (Crucial for 30% Core Functionality)
  const existingParticipation = await prisma.participant.findFirst({
    where: { userId, eventId },
  });

  if (existingParticipation) {
    throw new Error("You have already joined this event");
  }

  // 3. Determine Payment Status
  // If fee > 0, status is UNPAID. If fee is 0, status is PAID.
  const isPaidEvent = event.fee > 0;
  const paymentStatus = isPaidEvent ? "UNPAID" : "PAID";

  // 4. Create the record
  const participation = await prisma.participant.create({
    data: {
      userId,
      eventId,
      payment: paymentStatus,
    },
    include: {
      event: true,
    },
  });

  return {
    participation,
    message: isPaidEvent
      ? "Joined successfully. Please proceed to payment."
      : "Joined successfully!",
    requiresPayment: isPaidEvent,
  };
};

export const ParticipationService = {
  joinEvent,
};
