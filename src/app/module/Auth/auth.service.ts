import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../../../lib/prisma";

export const secret = process.env.JWT_SECRET;

type RegisterPayload = {
  name: string;
  email: string;
  password: string;
  photo?: string;
};

type LoginPayload = {
  email: string;
  password: string;
};

type FacebookProfile = {
  id: string;
  displayName?: string;
  name?: {
    givenName?: string;
    familyName?: string;
  };
  emails?: Array<{
    value: string;
  }>;
  photos?: Array<{
    value: string;
  }>;
};

const ensureJwtSecret = () => {
  if (!secret) {
    throw new Error("JWT_SECRET is not configured");
  }

  return secret;
};

const buildJwtToken = (user: {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
}) => {
  return jwt.sign(
    {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
    },
    ensureJwtSecret(),
    {
      expiresIn: "7d",
    },
  );
};

const createUserIntoDB = async (payload: RegisterPayload) => {
  if (!payload.password) {
    throw new Error("Password is required for local registration");
  }

  const existingUser = await prisma.user.findUnique({
    where: { email: payload.email },
  });

  if (existingUser) {
    throw new Error("User already exists with this email");
  }

  const password = await bcrypt.hash(payload.password, 12);

  const newUser = await prisma.user.create({
    data: {
      name: payload.name,
      email: payload.email,
      password,
      photo: payload.photo ?? null,
      authProvider: "LOCAL",
    },
  });

  return newUser;
};

const loginUserIntoDB = async (payload: LoginPayload) => {
  return validateLocalCredentials(payload.email, payload.password);
};

const validateLocalCredentials = async (email: string, password: string) => {
  if (!email || !password) {
    throw new Error("Email and password are required");
  }

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });
  if (!user) {
    throw new Error("User Not Found!!");
  }

  if (!user.password) {
    throw new Error(
      "This account was created with social login. Please use Google/Facebook sign-in.",
    );
  }

  // check if password matched
  const isPasswordMatched = await bcrypt.compare(password, user.password);
  if (!isPasswordMatched) {
    throw new Error("Password didn't matched");
  }

  return user;
};

const getFacebookName = (profile: FacebookProfile) => {
  if (profile.displayName) {
    return profile.displayName;
  }

  const fallbackName =
    `${profile.name?.givenName ?? ""} ${profile.name?.familyName ?? ""}`.trim();

  return fallbackName || "Facebook User";
};

const findOrCreateFacebookUser = async (profile: FacebookProfile) => {
  if (!profile?.id) {
    throw new Error("Invalid Facebook profile");
  }

  const email =
    profile.emails?.[0]?.value ?? `${profile.id}@facebook.eventra.local`;
  const name = getFacebookName(profile);
  const photo = profile.photos?.[0]?.value ?? null;

  const existingByEmail = await prisma.user.findUnique({
    where: { email },
  });

  if (
    existingByEmail &&
    existingByEmail.authProvider !== "LOCAL" &&
    existingByEmail.authProvider !== "FACEBOOK"
  ) {
    throw new Error(
      `This email is already linked with ${existingByEmail.authProvider}`,
    );
  }

  if (
    existingByEmail?.authProvider === "FACEBOOK" &&
    existingByEmail.providerId &&
    existingByEmail.providerId !== profile.id
  ) {
    throw new Error("Provider account mismatch");
  }

  const user = existingByEmail
    ? await prisma.user.update({
        where: { id: existingByEmail.id },
        data: {
          name,
          photo,
          authProvider:
            existingByEmail.authProvider === "LOCAL" ? "LOCAL" : "FACEBOOK",
          providerId:
            existingByEmail.authProvider === "LOCAL"
              ? (existingByEmail.providerId ?? profile.id)
              : profile.id,
        },
      })
    : await prisma.user.create({
        data: {
          name,
          email,
          photo,
          authProvider: "FACEBOOK",
          providerId: profile.id,
          password: null,
        },
      });

  return user;
};

const issueAuthForUser = (user: {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
}) => {
  const token = buildJwtToken(user);

  const fullUser = user as typeof user & { password?: string | null };
  const { password, ...safeUser } = fullUser;

  return {
    token,
    user: safeUser,
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
    const decoded = jwt.verify(token, ensureJwtSecret()) as jwt.JwtPayload;

    return decoded;
  } catch (error) {
    throw new Error("Invalid token");
  }
};

export const AuthService = {
  createUserIntoDB,
  loginUserIntoDB,
  validateLocalCredentials,
  findOrCreateFacebookUser,
  issueAuthForUser,
  logoutUser,
  getUserFromToken,
};
