import { Request, Response } from "express";
import passport from "passport";
import { AuthService } from "./auth.service";

const setAuthCookie = (res: Response, token: string) => {
  res.cookie("token", token, {
    secure: false, //in production it will be true
    httpOnly: true,
    sameSite: "strict",
  });
};

const createUser = async (req: Request, res: Response) => {
  try {
    const result = await AuthService.createUserIntoDB(req.body);
    res.status(201).json({
      success: true,
      data: result,
      message: "User Registered Successfully",
    });
  } catch (error: any) {
    console.log(error);
    res.status(500).json({
      success: false,

      message: error.message,
    });
  }
};
const loginUser = (req: Request, res: Response) => {
  passport.authenticate(
    "local",
    { session: false },
    (error: any, user: any, info: any) => {
      if (error) {
        return res.status(500).json({
          success: false,
          message: error.message,
        });
      }

      if (!user) {
        return res.status(401).json({
          success: false,
          message: info?.message || "Invalid email or password",
        });
      }

      const result = AuthService.issueAuthForUser(user);
      setAuthCookie(res, result.token);

      return res.status(200).json({
        success: true,
        data: result,
        message: "User Logged in Successfully",
      });
    },
  )(req, res);
};

const facebookSocialLogin = (req: Request, res: Response) => {
  req.body.access_token = req.body.access_token || req.body.accessToken;

  passport.authenticate(
    "facebook-token",
    { session: false },
    (error: any, user: any, info: any) => {
      if (error) {
        return res.status(500).json({
          success: false,
          message: error.message,
        });
      }

      if (!user) {
        return res.status(401).json({
          success: false,
          message: info?.message || "Facebook authentication failed",
        });
      }

      const result = AuthService.issueAuthForUser(user);
      setAuthCookie(res, result.token);

      return res.status(200).json({
        success: true,
        data: result,
        message: "Facebook social login successful",
      });
    },
  )(req, res);
};

const logoutUser = async (req: Request, res: Response) => {
  try {
    const result = await AuthService.logoutUser();
    res.clearCookie("token");
    res.status(200).json({
      success: true,
      data: result,
      message: "User Logged out Successfully",
    });
  } catch (error: any) {
    console.log(error);
    res.status(500).json({
      success: false,

      message: error.message,
    });
  }
};
const getUserFromToken = async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization as string;
    const result = await AuthService.getUserFromToken(token);
    res.status(200).json({
      success: true,
      data: result,
      message: "User fetched successfully",
    });
  } catch (error: any) {
    console.log(error);
    res.status(500).json({
      success: false,

      message: error.message,
    });
  }
};
export const AuthController = {
  createUser,
  loginUser,
  facebookSocialLogin,
  logoutUser,
  getUserFromToken,
};
