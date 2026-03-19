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
      // token exists?
      const token = req.headers.authorization;
      if (!token) {
        throw new Error("Token Not Found");
      }
      // verify token
      const decoded = jwt.verify(token, secret!) as JwtPayload;
      // is decoded user exists
      const userData = await prisma.user.findUnique({
        where: {
          email: decoded.email,
        },
      });
      if (!userData) {
        throw new Error("User Not Found");
      }
      //is user status active
      if (userData.status !== "ACTIVE") {
        throw new Error("Account Status is Not Active");
      }
      //   check ROLE
      if (roles.length && !roles.includes(decoded.role)) {
        throw new Error("Role doesn't match");
      }
      req.user = decoded;
      console.log(req.user);
      next();
    } catch (error: any) {
      next(error);
      throw new Error(error);
    }
    next();
  };
};
export default auth;
