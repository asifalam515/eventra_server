import { prisma } from "../../../lib/prisma";
import { AppError } from "../../errors/AppErrors";
const createEventIntoDB = async (payload, userId) => {
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
const getAllEvents = async (filters, pagination) => {
    const { page, limit } = pagination;
    const { search, category, location } = filters;
    const whereClause = {};
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
//get event by id
const getEventById = async (id) => {
    const event = await prisma.event.findUnique({
        where: {
            id,
        },
    });
    if (!event) {
        throw new AppError(404, "Event not found");
    }
    return event;
};
//update event by id
const updateEventById = async (id, payload) => {
    const event = await prisma.event.findUnique({
        where: {
            id,
        },
    });
    if (!event) {
        throw new AppError(404, "Event not found");
    }
    const updatedEvent = await prisma.event.update({
        where: {
            id,
        },
        data: payload,
    });
    return updatedEvent;
};
//delete event by id
const deleteEventById = async (id) => {
    const event = await prisma.event.findUnique({
        where: {
            id,
        },
    });
    if (!event) {
        throw new AppError(404, "Event not found");
    }
    await prisma.event.delete({
        where: {
            id,
        },
    });
    return;
};
export const EventService = {
    createEventIntoDB,
    getAllEvents,
    getEventById,
    updateEventById,
    deleteEventById,
};
//# sourceMappingURL=event.service.js.map