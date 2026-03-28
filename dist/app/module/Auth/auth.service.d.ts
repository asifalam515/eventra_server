import jwt from "jsonwebtoken";
import { User } from "../../../generated/prisma/client";
export declare const secret: string | undefined;
export declare const AuthService: {
    createUserIntoDB: (payload: User) => Promise<{
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
    loginUserIntoDB: (payload: User) => Promise<{
        token: string;
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
    }>;
    logoutUser: () => {
        token: null;
        user: null;
    };
    getUserFromToken: (token: string) => jwt.JwtPayload;
};
//# sourceMappingURL=auth.service.d.ts.map