import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { secret } from "../app/module/Auth/auth.service";
import { prisma } from "../lib/prisma";
export enum UserRole {
  admin = "ADMIN",
  moderator = "MODERATOR",
  user = "USER",
}
const auth = (...roles: UserRole[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization;

      if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const decoded = jwt.verify(token, secret!) as JwtPayload;

      const userData = await prisma.user.findUnique({
        where: {
          email: decoded.email,
        },
      });

      if (!userData) {
        return res.status(404).json({ message: "User Not Found" });
      }

      if (userData.status !== "ACTIVE") {
        return res.status(403).json({ message: "Account not active" });
      }

      if (roles.length && !roles.includes(decoded.role)) {
        return res.status(403).json({ message: "Forbidden" });
      }

      req.user = decoded;

      return next();
    } catch (error: any) {
      return next(error);
    }
  };
};
export default auth;
