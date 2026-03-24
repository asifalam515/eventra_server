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
                fee: number;
                isFeatured: boolean;
                creatorId: string;
            };
        } & {
            id: string;
            status: import("../../../generated/prisma/enums").ParticipationStatus;
            createdAt: Date;
            payment: import("../../../generated/prisma/enums").PaymentStatus;
            userId: string;
            eventId: string;
        };
        message: string;
        requiresPayment: boolean;
    }>;
};
//# sourceMappingURL=participation.service.d.ts.map