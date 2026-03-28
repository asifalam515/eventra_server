import { InvitationStatus, PaymentStatus, ParticipationStatus } from "../../../generated/prisma/enums";
export declare const InvitationService: {
    sendInvitation: (eventId: string, targetUserId: string, requesterId: string) => Promise<{
        id: string;
        status: InvitationStatus;
        createdAt: Date;
        payment: PaymentStatus;
        userId: string;
        eventId: string;
    }>;
    acceptInvitation: (invitationId: string, targetUserId: string) => Promise<{
        invitation: {
            id: string;
            status: InvitationStatus;
            createdAt: Date;
            payment: PaymentStatus;
            userId: string;
            eventId: string;
        };
        participant: {
            id: string;
            status: ParticipationStatus;
            createdAt: Date;
            payment: PaymentStatus;
            userId: string;
            eventId: string;
        };
    }>;
    declineInvitation: (invitationId: string, targetUserId: string) => Promise<{
        id: string;
        status: InvitationStatus;
        createdAt: Date;
        payment: PaymentStatus;
        userId: string;
        eventId: string;
    }>;
    getUserInvitations: (userId: string) => Promise<({
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
        status: InvitationStatus;
        createdAt: Date;
        payment: PaymentStatus;
        userId: string;
        eventId: string;
    })[]>;
};
//# sourceMappingURL=invitation.service.d.ts.map