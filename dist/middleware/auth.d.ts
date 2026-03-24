import { NextFunction, Request, Response } from "express";
export declare enum UserRole {
    admin = "ADMIN",
    moderator = "MODERATOR",
    user = "USER"
}
declare const auth: (...roles: UserRole[]) => (req: Request, res: Response, next: NextFunction) => Promise<void | Response<any, Record<string, any>>>;
export default auth;
//# sourceMappingURL=auth.d.ts.map