import { prisma } from "../../../lib/prisma";
const createEventIntoDB = async (payload: any, userId: string) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });
  if (!user) {
    throw new Error("Invalid User");
  }
  const newEvent = await prisma.event.create({
    data: { ...payload, creatorId: userId },
  });
  return newEvent;
};

export const EventService = { createEventIntoDB };
