import { PaymentStatus } from "@prisma/client";
import { prisma } from "../../../lib/prisma";
import { UserRole } from "../../../middleware/auth";

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
  const paymentStatus = isPaidEvent ? PaymentStatus.UNPAID : PaymentStatus.PAID;

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

const getAllParticipantFromDb = async (eventId: string) => {
  const participants = await prisma.participant.findMany({
    where: { eventId },
    include: {
      user: true,
      event:true,
      
    },
  });
  return participants;
};
const updateParticipationStatus = async (eventId: string, userId: string, status: string) => {
 const user = await prisma.user.findUnique({
  where: { id: userId },
 });
 const event = await prisma.event.findUnique({
  where: { id: eventId },
 });
 if (!user) {
  throw new Error("User not found");
 }
 if(user.role !== UserRole.admin && user.id !== event?.creatorId) {
  throw new Error("You are not authorized to update participation status");
 }
 const updatedParticipation = await prisma.participant.update({  
    where: { userId_eventId: { userId, eventId } },
    data: { payment: status },  
  });
  return updatedParticipation;
};
export const ParticipationService = {
  joinEvent,
  getAllParticipantFromDb,
  updateParticipationStatus,
};
