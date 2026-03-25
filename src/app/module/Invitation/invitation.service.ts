import { InvitationStatus, PaymentStatus, ParticipationStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../../lib/prisma";
import { UserRole } from "../../../middleware/auth";

const sendInvitation = async (eventId: string, targetUserId: string, requesterId: string) => {
  const event = await prisma.event.findUnique({ where: { id: eventId } });
  if (!event) throw new Error("Event not found");

  const requester = await prisma.user.findUnique({ where: { id: requesterId } });
  if (requester?.role !== UserRole.admin && event.creatorId !== requesterId) {
    throw new Error("You are not authorized to send an invitation for this event");
  }

  const targetUser = await prisma.user.findUnique({ where: { id: targetUserId } });
  if (!targetUser) throw new Error("Target user not found");

  const existingParticipant = await prisma.participant.findUnique({
    where: { userId_eventId: { userId: targetUserId, eventId } },
  });
  if (existingParticipant) throw new Error("User is already a participant");

  const existingInvitation = await prisma.invitation.findUnique({
    where: { eventId_userId: { eventId, userId: targetUserId } },
  });
  if (existingInvitation) throw new Error("An invitation already exists for this user");

  const isPaidEvent = event.fee > 0;
  const paymentStatus = isPaidEvent ? PaymentStatus.UNPAID : PaymentStatus.PAID;

  const invitation = await prisma.invitation.create({
    data: {
      eventId,
      userId: targetUserId,
      payment: paymentStatus,
      status: InvitationStatus.PENDING,
    },
  });

  return invitation;
};

const acceptInvitation = async (invitationId: string, targetUserId: string) => {
  const invitation = await prisma.invitation.findUnique({
    where: { id: invitationId },
    include: { event: true },
  });

  if (!invitation) throw new Error("Invitation not found");
  if (invitation.userId !== targetUserId) throw new Error("Not authorized");
  if (invitation.status !== InvitationStatus.PENDING) throw new Error("Invitation is not pending");

  const isPaidEvent = invitation.event.fee > 0;

  if (isPaidEvent && invitation.payment !== PaymentStatus.PAID) {
    throw new Error("Payment is required before accepting this invitation");
  }

  const participantStatus = isPaidEvent ? ParticipationStatus.PENDING : ParticipationStatus.APPROVED;

  const [updatedInvitation, participant] = await prisma.$transaction([
    prisma.invitation.update({
      where: { id: invitationId },
      data: { status: InvitationStatus.ACCEPTED },
    }),
    prisma.participant.create({
      data: {
        userId: targetUserId,
        eventId: invitation.event.id,
        status: participantStatus,
        payment: invitation.payment,
      },
    }),
  ]);

  return { invitation: updatedInvitation, participant };
};

const declineInvitation = async (invitationId: string, targetUserId: string) => {
  const invitation = await prisma.invitation.findUnique({
    where: { id: invitationId },
  });

  if (!invitation) throw new Error("Invitation not found");
  if (invitation.userId !== targetUserId) throw new Error("Not authorized");
  if (invitation.status !== InvitationStatus.PENDING) throw new Error("Invitation is not pending");

  const updatedInvitation = await prisma.invitation.update({
    where: { id: invitationId },
    data: { status: InvitationStatus.DECLINED },
  });

  return updatedInvitation;
};

const getUserInvitations = async (userId: string) => {
  return await prisma.invitation.findMany({
    where: { userId },
    include: { event: true },
  });
};

export const InvitationService = {
  sendInvitation,
  acceptInvitation,
  declineInvitation,
  getUserInvitations,
};
