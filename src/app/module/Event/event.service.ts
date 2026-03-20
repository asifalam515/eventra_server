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
//get all events and also apply filter and pagination
const getAllEvents = async (filters: any, pagination: any) => {
  const { page, limit } = pagination;
  const { search, category, location } = filters;

  const whereClause: any = {};

  if (search) {
    whereClause.title = {
      contains: search,
      mode: "insensitive",
    };
  }

  if (category) {
    whereClause.category = category;
  }

  if (location) {
    whereClause.location = {
      contains: location,
      mode: "insensitive",
    };
  }

  const events = await prisma.event.findMany({
    where: whereClause,
    skip: (page - 1) * limit,
    take: limit,
  });

  return events;
};
export const EventService = { createEventIntoDB, getAllEvents };
