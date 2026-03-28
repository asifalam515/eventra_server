import { prisma } from "../../../lib/prisma";
import { AppError } from "../../errors/AppErrors";
// 1. User Management
const getAllUsers = async (filters, pagination) => {
    const { page, limit } = pagination;
    const { search, role } = filters;
    const whereClause = {};
    if (search) {
        whereClause.OR = [
            { name: { contains: search, mode: "insensitive" } },
            { email: { contains: search, mode: "insensitive" } }
        ];
    }
    if (role)
        whereClause.role = role;
    const users = await prisma.user.findMany({
        where: whereClause,
        skip: (page - 1) * limit,
        take: limit,
        select: {
            id: true, name: true, email: true, role: true, status: true, createdAt: true,
            _count: { select: { events: true, participations: true, payments: true } }
        }
    });
    const total = await prisma.user.count({ where: whereClause });
    return { users, total, page, limit };
};
const getSingleUser = async (id) => {
    const user = await prisma.user.findUnique({
        where: { id },
        include: {
            events: true,
            participations: { include: { event: true } },
            payments: { include: { event: true } },
            reviews: { include: { event: true } },
            invitations: { include: { event: true } }
        }
    });
    if (!user)
        throw new AppError(404, "User not found");
    return user;
};
const updateUserStatus = async (id, status, adminId) => {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user)
        throw new AppError(404, "User not found");
    const updatedUser = await prisma.user.update({
        where: { id },
        data: { status: status }
    });
    if (status === "BLOCKED") {
        await prisma.activityLog.create({
            data: { action: "BAN_USER", targetId: id, adminId, details: `Banned user ${user.email}` }
        });
    }
    return updatedUser;
};
const updateUserRole = async (id, role, adminId) => {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user)
        throw new AppError(404, "User not found");
    const updatedUser = await prisma.user.update({
        where: { id },
        data: { role: role }
    });
    await prisma.activityLog.create({
        data: { action: "UPDATE_ROLE", targetId: id, details: `Changed role to ${role}`, adminId }
    });
    return updatedUser;
};
// 2. Event & Review Management
const getAllEvents = async (filters, pagination) => {
    const { page, limit } = pagination;
    const { search, type, isFeatured } = filters;
    const whereClause = {};
    if (search)
        whereClause.title = { contains: search, mode: "insensitive" };
    if (type)
        whereClause.type = type;
    if (isFeatured !== undefined)
        whereClause.isFeatured = isFeatured === 'true';
    const events = await prisma.event.findMany({
        where: whereClause,
        skip: (page - 1) * limit,
        take: limit,
        include: { creator: { select: { name: true, email: true } } }
    });
    const total = await prisma.event.count({ where: whereClause });
    return { events, total, page, limit };
};
const getSingleEvent = async (id) => {
    const event = await prisma.event.findUnique({
        where: { id },
        include: {
            creator: { select: { id: true, name: true, email: true } },
            participants: { include: { user: { select: { id: true, name: true, email: true } } } },
            payments: true,
            reviews: true
        }
    });
    if (!event)
        throw new AppError(404, "Event not found");
    return event;
};
const deleteEvent = async (id, adminId) => {
    const event = await prisma.event.findUnique({ where: { id } });
    if (!event)
        throw new AppError(404, "Event not found");
    await prisma.event.delete({ where: { id } });
    await prisma.activityLog.create({
        data: { action: "DELETE_EVENT", targetId: id, adminId }
    });
    return true;
};
const toggleEventFeature = async (id, isFeatured) => {
    const event = await prisma.event.findUnique({ where: { id } });
    if (!event)
        throw new AppError(404, "Event not found");
    return await prisma.event.update({
        where: { id },
        data: { isFeatured }
    });
};
const deleteReview = async (id, adminId) => {
    const review = await prisma.review.findUnique({ where: { id } });
    if (!review)
        throw new AppError(404, "Review not found");
    await prisma.review.delete({ where: { id } });
    const result = await prisma.review.aggregate({
        _avg: { rating: true },
        _count: { id: true },
        where: { eventId: review.eventId },
    });
    await prisma.event.update({
        where: { id: review.eventId },
        data: {
            averageRating: result._avg.rating || 0,
            reviewCount: result._count.id || 0
        },
    });
    await prisma.activityLog.create({
        data: { action: "DELETE_REVIEW", targetId: id, adminId }
    });
    return true;
};
// 3. Analytics & Logs
const getDashboardAnalytics = async () => {
    const totalUsers = await prisma.user.count();
    const totalEvents = await prisma.event.count();
    const totalReviews = await prisma.review.count();
    const totalParticipations = await prisma.participant.count();
    const paymentAgg = await prisma.payment.aggregate({
        _sum: { amount: true },
        where: { status: "PAID" }
    });
    return {
        totalUsers, totalEvents, totalReviews, totalParticipations,
        totalRevenue: paymentAgg._sum.amount || 0
    };
};
const getActivityLogs = async (pagination) => {
    const { page, limit } = pagination;
    const logs = await prisma.activityLog.findMany({
        skip: (page - 1) * limit, take: limit,
        orderBy: { createdAt: 'desc' },
        include: { admin: { select: { id: true, name: true, email: true } } }
    });
    const total = await prisma.activityLog.count();
    return { logs, total, page, limit };
};
// 4. Reports Moderation
const getAllReports = async (filters, pagination) => {
    const { page, limit } = pagination;
    const { status, targetType } = filters;
    const whereClause = {};
    if (status)
        whereClause.status = status;
    if (targetType)
        whereClause.targetType = targetType;
    const reports = await prisma.report.findMany({
        where: whereClause,
        skip: (page - 1) * limit, take: limit,
        orderBy: { createdAt: 'desc' },
        include: { reporter: { select: { id: true, name: true, email: true } } }
    });
    const total = await prisma.report.count({ where: whereClause });
    return { reports, total, page, limit };
};
const updateReportStatus = async (id, status) => {
    const report = await prisma.report.findUnique({ where: { id } });
    if (!report)
        throw new AppError(404, "Report not found");
    return await prisma.report.update({
        where: { id },
        data: { status: status }
    });
};
export const AdminService = {
    getAllUsers, getSingleUser, updateUserStatus, updateUserRole,
    getAllEvents, getSingleEvent, deleteEvent, toggleEventFeature,
    deleteReview, getDashboardAnalytics, getActivityLogs,
    getAllReports, updateReportStatus
};
//# sourceMappingURL=admin.service.js.map