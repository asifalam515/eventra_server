import { prisma } from "../../../lib/prisma";
import { AppError } from "../../errors/AppErrors";
const createEventIntoDB = async (payload: any, userId: string) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });
  if (!user) {
  throw new AppError(404, "User not found");
  }
  const newEvent = await prisma.event.create({
    data: { ...payload, creatorId: userId },
  });
  return newEvent;
};

export const EventService = { createEventIntoDB };
