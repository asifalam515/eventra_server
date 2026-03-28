export declare const AdminService: {
    getAllUsers: (filters: any, pagination: any) => Promise<{
        users: {
            id: string;
            email: string;
            name: string;
            status: import("../../../generated/prisma/enums").Status;
            role: import("../../../generated/prisma/enums").Role;
            createdAt: Date;
            _count: {
                events: number;
                payments: number;
                participations: number;
            };
        }[];
        total: number;
        page: any;
        limit: any;
    }>;
    getSingleUser: (id: string) => Promise<{
        events: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            description: string;
            date: Date;
            time: string;
            venue: string;
            type: import("../../../generated/prisma/enums").EventType;
            eventStatus: import("../../../generated/prisma/enums").EventStatus;
            fee: number;
            isFeatured: boolean;
            averageRating: number;
            reviewCount: number;
            creatorId: string;
        }[];
        payments: ({
            event: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                title: string;
                description: string;
                date: Date;
                time: string;
                venue: string;
                type: import("../../../generated/prisma/enums").EventType;
                eventStatus: import("../../../generated/prisma/enums").EventStatus;
                fee: number;
                isFeatured: boolean;
                averageRating: number;
                reviewCount: number;
                creatorId: string;
            };
        } & {
            id: string;
            status: import("../../../generated/prisma/enums").PaymentStatus;
            createdAt: Date;
            userId: string;
            eventId: string;
            amount: number;
            transactionId: string;
        })[];
        participations: ({
            event: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                title: string;
                description: string;
                date: Date;
                time: string;
                venue: string;
                type: import("../../../generated/prisma/enums").EventType;
                eventStatus: import("../../../generated/prisma/enums").EventStatus;
                fee: number;
                isFeatured: boolean;
                averageRating: number;
                reviewCount: number;
                creatorId: string;
            };
        } & {
            id: string;
            status: import("../../../generated/prisma/enums").ParticipationStatus;
            createdAt: Date;
            payment: import("../../../generated/prisma/enums").PaymentStatus;
            userId: string;
            eventId: string;
        })[];
        invitations: ({
            event: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                title: string;
                description: string;
                date: Date;
                time: string;
                venue: string;
                type: import("../../../generated/prisma/enums").EventType;
                eventStatus: import("../../../generated/prisma/enums").EventStatus;
                fee: number;
                isFeatured: boolean;
                averageRating: number;
                reviewCount: number;
                creatorId: string;
            };
        } & {
            id: string;
            status: import("../../../generated/prisma/enums").InvitationStatus;
            createdAt: Date;
            payment: import("../../../generated/prisma/enums").PaymentStatus;
            userId: string;
            eventId: string;
        })[];
        reviews: ({
            event: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                title: string;
                description: string;
                date: Date;
                time: string;
                venue: string;
                type: import("../../../generated/prisma/enums").EventType;
                eventStatus: import("../../../generated/prisma/enums").EventStatus;
                fee: number;
                isFeatured: boolean;
                averageRating: number;
                reviewCount: number;
                creatorId: string;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            eventId: string;
            rating: number;
            comment: string;
        })[];
    } & {
        id: string;
        email: string;
        name: string;
        password: string;
        status: import("../../../generated/prisma/enums").Status;
        photo: string | null;
        role: import("../../../generated/prisma/enums").Role;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateUserStatus: (id: string, status: string, adminId: string) => Promise<{
        id: string;
        email: string;
        name: string;
        password: string;
        status: import("../../../generated/prisma/enums").Status;
        photo: string | null;
        role: import("../../../generated/prisma/enums").Role;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateUserRole: (id: string, role: string, adminId: string) => Promise<{
        id: string;
        email: string;
        name: string;
        password: string;
        status: import("../../../generated/prisma/enums").Status;
        photo: string | null;
        role: import("../../../generated/prisma/enums").Role;
        createdAt: Date;
        updatedAt: Date;
    }>;
    getAllEvents: (filters: any, pagination: any) => Promise<{
        events: ({
            creator: {
                email: string;
                name: string;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            description: string;
            date: Date;
            time: string;
            venue: string;
            type: import("../../../generated/prisma/enums").EventType;
            eventStatus: import("../../../generated/prisma/enums").EventStatus;
            fee: number;
            isFeatured: boolean;
            averageRating: number;
            reviewCount: number;
            creatorId: string;
        })[];
        total: number;
        page: any;
        limit: any;
    }>;
    getSingleEvent: (id: string) => Promise<{
        payments: {
            id: string;
            status: import("../../../generated/prisma/enums").PaymentStatus;
            createdAt: Date;
            userId: string;
            eventId: string;
            amount: number;
            transactionId: string;
        }[];
        reviews: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            eventId: string;
            rating: number;
            comment: string;
        }[];
        creator: {
            id: string;
            email: string;
            name: string;
        };
        participants: ({
            user: {
                id: string;
                email: string;
                name: string;
            };
        } & {
            id: string;
            status: import("../../../generated/prisma/enums").ParticipationStatus;
            createdAt: Date;
            payment: import("../../../generated/prisma/enums").PaymentStatus;
            userId: string;
            eventId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        description: string;
        date: Date;
        time: string;
        venue: string;
        type: import("../../../generated/prisma/enums").EventType;
        eventStatus: import("../../../generated/prisma/enums").EventStatus;
        fee: number;
        isFeatured: boolean;
        averageRating: number;
        reviewCount: number;
        creatorId: string;
    }>;
    deleteEvent: (id: string, adminId: string) => Promise<boolean>;
    toggleEventFeature: (id: string, isFeatured: boolean) => Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        description: string;
        date: Date;
        time: string;
        venue: string;
        type: import("../../../generated/prisma/enums").EventType;
        eventStatus: import("../../../generated/prisma/enums").EventStatus;
        fee: number;
        isFeatured: boolean;
        averageRating: number;
        reviewCount: number;
        creatorId: string;
    }>;
    deleteReview: (id: string, adminId: string) => Promise<boolean>;
    getDashboardAnalytics: () => Promise<{
        totalUsers: number;
        totalEvents: number;
        totalReviews: number;
        totalParticipations: number;
        totalRevenue: number;
    }>;
    getActivityLogs: (pagination: any) => Promise<{
        logs: ({
            admin: {
                id: string;
                email: string;
                name: string;
            };
        } & {
            id: string;
            createdAt: Date;
            action: import("../../../generated/prisma/enums").LogAction;
            targetId: string;
            details: string | null;
            adminId: string;
        })[];
        total: number;
        page: any;
        limit: any;
    }>;
    getAllReports: (filters: any, pagination: any) => Promise<{
        reports: ({
            reporter: {
                id: string;
                email: string;
                name: string;
            };
        } & {
            id: string;
            status: import("../../../generated/prisma/enums").ReportStatus;
            createdAt: Date;
            updatedAt: Date;
            targetId: string;
            targetType: import("../../../generated/prisma/enums").ReportTargetType;
            reason: string;
            reporterId: string;
        })[];
        total: number;
        page: any;
        limit: any;
    }>;
    updateReportStatus: (id: string, status: string) => Promise<{
        id: string;
        status: import("../../../generated/prisma/enums").ReportStatus;
        createdAt: Date;
        updatedAt: Date;
        targetId: string;
        targetType: import("../../../generated/prisma/enums").ReportTargetType;
        reason: string;
        reporterId: string;
    }>;
};
//# sourceMappingURL=admin.service.d.ts.map