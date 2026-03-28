import { PaymentStatus, ParticipationStatus } from "../../../generated/prisma/enums";
export declare const ParticipationService: {
    joinEvent: (userId: string, eventId: string) => Promise<{
        participation: {
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
            status: ParticipationStatus;
            createdAt: Date;
            payment: PaymentStatus;
            userId: string;
            eventId: string;
        };
        message: string;
        requiresPayment: boolean;
    }>;
    getAllParticipantFromDb: (eventId: string) => Promise<({
        user: {
            id: string;
            email: string;
            name: string;
            password: string;
            status: import("../../../generated/prisma/enums").Status;
            photo: string | null;
            role: import("../../../generated/prisma/enums").Role;
            createdAt: Date;
            updatedAt: Date;
        };
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
        status: ParticipationStatus;
        createdAt: Date;
        payment: PaymentStatus;
        userId: string;
        eventId: string;
    })[]>;
    updateParticipationStatus: (requesterId: string, eventId: string, targetUserId: string, status: string) => Promise<{
        id: string;
        status: ParticipationStatus;
        createdAt: Date;
        payment: PaymentStatus;
        userId: string;
        eventId: string;
    }>;
};
//# sourceMappingURL=participation.service.d.ts.map