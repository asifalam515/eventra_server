import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../../../generated/prisma/client";
import { prisma } from "../../../lib/prisma";
export const secret = process.env.JWT_SECRET;
const createUserIntoDB = async (payload: User) => {
  const password = await bcrypt.hash(payload.password, 12);
  const newUser = await prisma.user.create({
    data: { ...payload, password },
  });
  return newUser;
};
const loginUserIntoDB = async (payload: User) => {
  const user = await prisma.user.findUnique({
    where: {
      email: payload.email,
    },
  });
  if (!user) {
    throw new Error("User Not Found!!");
  }
  // check if password matched
  const isPasswordMatched = await bcrypt.compare(
    payload.password,
    user.password,
  );
  if (!isPasswordMatched) {
    throw new Error("Password didn't matched");
  }
  // now its time to set token
  const userData = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    status: user.status,
  };
  const token = jwt.sign(userData, secret!, {
    expiresIn: "7d",
  });
  return {
    token,
    user: user,
  };
};
//logout user by clearing token from client side
const logoutUser = () => {
  // Clear the token from the client side (e.g., by setting it to null or an empty string)
  return {
    token: null,
    user: null,
  };
};
const getUserFromToken = (token: string) => {
  try {
    const decoded = jwt.verify(token, secret!) as jwt.JwtPayload;
    return decoded;
  } catch (error) {
    throw new Error("Invalid token");
  }
};
export const AuthService = {
  createUserIntoDB,
  loginUserIntoDB,
  logoutUser,
  getUserFromToken,
};
