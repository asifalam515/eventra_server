export declare const UserService: {
    updateUserProfile: (userId: string, payload: any) => Promise<{
        name: string;
        id: string;
        email: string;
        password: string;
        status: import("../../../generated/prisma/enums").Status;
        photo: string | null;
        role: import("../../../generated/prisma/enums").Role;
        createdAt: Date;
        updatedAt: Date;
    }>;
    getUserById: (id: string) => Promise<{
        name: string;
        id: string;
        email: string;
        password: string;
        status: import("../../../generated/prisma/enums").Status;
        photo: string | null;
        role: import("../../../generated/prisma/enums").Role;
        createdAt: Date;
        updatedAt: Date;
    }>;
};
//# sourceMappingURL=user.service.d.ts.map