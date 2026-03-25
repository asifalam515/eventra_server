import { prisma } from "../../../lib/prisma";
import { AppError } from "../../errors/AppErrors";

// 1. User Management
const getAllUsers = async (filters: any, pagination: any) => {
  const { page, limit } = pagination;
  const { search, role } = filters;

  const whereClause: any = {};

  if (search) {
    whereClause.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } }
    ];
  }
  
  if (role) {
    whereClause.role = role;
  }

  const users = await prisma.user.findMany({
    where: whereClause,
    skip: (page - 1) * limit,
    take: limit,
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      createdAt: true,
      _count: {
        select: { events: true, participations: true, payments: true }
      }
    }
  });

  const total = await prisma.user.count({ where: whereClause });

  return { users, total, page, limit };
};

const getSingleUser = async (id: string) => {
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
  if (!user) throw new AppError(404, "User not found");
  return user;
};

const updateUserStatus = async (id: string, status: string) => {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) throw new AppError(404, "User not found");

  return await prisma.user.update({
    where: { id },
    data: { status: status as any }
  });
};

// 2. Event & Review Management
const getAllEvents = async (filters: any, pagination: any) => {
  const { page, limit } = pagination;
  const { search, type, isFeatured } = filters;

  const whereClause: any = {};

  if (search) {
    whereClause.title = { contains: search, mode: "insensitive" };
  }
  if (type) whereClause.type = type;
  if (isFeatured !== undefined) whereClause.isFeatured = isFeatured === 'true';

  const events = await prisma.event.findMany({
    where: whereClause,
    skip: (page - 1) * limit,
    take: limit,
    include: { creator: { select: { name: true, email: true } } }
  });

  const total = await prisma.event.count({ where: whereClause });

  return { events, total, page, limit };
};

const getSingleEvent = async (id: string) => {
  const event = await prisma.event.findUnique({
    where: { id },
    include: {
      creator: { select: { id: true, name: true, email: true } },
      participants: { include: { user: { select: { id: true, name: true, email: true } } } },
      payments: true,
      reviews: true
    }
  });
  if (!event) throw new AppError(404, "Event not found");
  return event;
};

const deleteEvent = async (id: string) => {
  const event = await prisma.event.findUnique({ where: { id } });
  if (!event) throw new AppError(404, "Event not found");

  await prisma.event.delete({ where: { id } });
  return true;
};

const toggleEventFeature = async (id: string, isFeatured: boolean) => {
  const event = await prisma.event.findUnique({ where: { id } });
  if (!event) throw new AppError(404, "Event not found");

  return await prisma.event.update({
    where: { id },
    data: { isFeatured }
  });
};

const deleteReview = async (id: string) => {
  const review = await prisma.review.findUnique({ where: { id } });
  if (!review) throw new AppError(404, "Review not found");

  await prisma.review.delete({ where: { id } });

  // Update average rating
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

  return true;
};

// 3. Analytics
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
    totalUsers,
    totalEvents,
    totalReviews,
    totalParticipations,
    totalRevenue: paymentAgg._sum.amount || 0
  };
};

export const AdminService = {
  getAllUsers,
  getSingleUser,
  updateUserStatus,
  getAllEvents,
  getSingleEvent,
  deleteEvent,
  toggleEventFeature,
  deleteReview,
  getDashboardAnalytics
};
