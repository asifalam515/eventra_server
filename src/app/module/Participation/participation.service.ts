import { PaymentStatus, ParticipationStatus } from "../../../generated/prisma/enums";
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
  const paymentStatus = (isPaidEvent ? "UNPAID" : "PAID") as PaymentStatus;

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
const updateParticipationStatus = async (
  requesterId: string,
  eventId: string,
  targetUserId: string,
  status: string
) => {
  const requester = await prisma.user.findUnique({
    where: { id: requesterId },
  });

  if (!requester) {
    throw new Error("Requester not found");
  }

  const event = await prisma.event.findUnique({
    where: { id: eventId },
  });

  if (!event) {
    throw new Error("Event not found");
  }

  // Check if admin or event owner
  if (
    requester.role !== UserRole.admin &&
    requester.id !== event.creatorId
  ) {
    throw new Error("You are not authorized to update participation status");
  }

  // Target participant must exist
  const targetParticipant = await prisma.participant.findUnique({
    where: {
      userId_eventId: { userId: targetUserId, eventId }
    }
  });

  if (!targetParticipant) {
    throw new Error("Participant not found in this event");
  }

  // validate correct enum
  if (
    !Object.values(ParticipationStatus).includes(
      status as ParticipationStatus
    )
  ) {
    throw new Error("Invalid participation status");
  }

  // payment logic: if status is going to be APPROVED, payment MUST be PAID.
  if (status === ParticipationStatus.APPROVED && targetParticipant.payment !== PaymentStatus.PAID) {
    throw new Error("Cannot approve participation. Payment must be PAID first.");
  }

  try {
    const updatedParticipation = await prisma.participant.update({
      where: {
        userId_eventId: { userId: targetUserId, eventId },
      },
      data: { status: status as ParticipationStatus },
    });

    return updatedParticipation;
  } catch (error: any) {
    console.error("Prisma update error:", error);
    throw new Error(`Failed to update: ${error.message}`);
  }
};

export const ParticipationService = {
  joinEvent,
  getAllParticipantFromDb,
  updateParticipationStatus,
};
