export declare const EventService: {
    createEventIntoDB: (payload: any, userId: string) => Promise<{
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
    }>;
    getAllEvents: (filters: any, pagination: any) => Promise<{
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
    }[]>;
    getEventById: (id: string) => Promise<{
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
    }>;
    updateEventById: (id: string, payload: any) => Promise<{
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
    }>;
    deleteEventById: (id: string) => Promise<void>;
};
//# sourceMappingURL=event.service.d.ts.map