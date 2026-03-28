import { ParticipationStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../../lib/prisma";
const _updateEventAverageRating = async (eventId) => {
    const result = await prisma.review.aggregate({
        _avg: { rating: true },
        _count: { id: true },
        where: { eventId },
    });
    const averageRating = result._avg.rating || 0;
    const reviewCount = result._count.id || 0;
    await prisma.event.update({
        where: { id: eventId },
        data: { averageRating, reviewCount },
    });
};
const createReview = async (eventId, userId, rating, comment) => {
    const event = await prisma.event.findUnique({ where: { id: eventId } });
    if (!event)
        throw new Error("Event not found");
    const eventDate = new Date(event.date);
    const [hours, minutes] = event.time.split(":").map(Number);
    eventDate.setUTCHours(hours || 0, minutes || 0, 0, 0);
    let currentStatus = event.eventStatus;
    if (currentStatus === "AVAILABLE" && new Date() >= eventDate) {
        currentStatus = "COMPLETED";
        // Update the database lazily
        await prisma.event.update({
            where: { id: eventId },
            data: { eventStatus: "COMPLETED" },
        });
    }
    if (currentStatus !== "COMPLETED") {
        throw new Error("Only completed events can be reviewed");
    }
    const participant = await prisma.participant.findUnique({
        where: { userId_eventId: { userId, eventId } },
    });
    if (!participant) {
        throw new Error(`Participant not found for this user and event. Are you logged in with the same account that joined the event? (User ID: ${userId})`);
    }
    if (participant.status !== ParticipationStatus.APPROVED) {
        throw new Error(`Only approved participants can review this event. Your current status is: ${participant.status}`);
    }
    const existingReview = await prisma.review.findUnique({
        where: { userId_eventId: { userId, eventId } },
    });
    if (existingReview) {
        throw new Error("You have already reviewed this event");
    }
    const review = await prisma.review.create({
        data: {
            rating,
            comment,
            userId,
            eventId,
        },
    });
    await _updateEventAverageRating(eventId);
    return review;
};
const getReviewsByEvent = async (eventId) => {
    return await prisma.review.findMany({
        where: { eventId },
        include: { user: { select: { id: true, name: true, photo: true } } },
        orderBy: { createdAt: 'desc' },
    });
};
const updateReview = async (reviewId, userId, rating, comment) => {
    const existingReview = await prisma.review.findUnique({ where: { id: reviewId } });
    if (!existingReview)
        throw new Error("Review not found");
    if (existingReview.userId !== userId)
        throw new Error("Not authorized to update this review");
    const review = await prisma.review.update({
        where: { id: reviewId },
        data: { rating, comment },
    });
    await _updateEventAverageRating(review.eventId);
    return review;
};
const deleteReview = async (reviewId, userId) => {
    const existingReview = await prisma.review.findUnique({ where: { id: reviewId } });
    if (!existingReview)
        throw new Error("Review not found");
    if (existingReview.userId !== userId)
        throw new Error("Not authorized to delete this review");
    await prisma.review.delete({ where: { id: reviewId } });
    await _updateEventAverageRating(existingReview.eventId);
    return true;
};
export const ReviewService = {
    createReview,
    getReviewsByEvent,
    updateReview,
    deleteReview,
};
//# sourceMappingURL=review.service.js.map