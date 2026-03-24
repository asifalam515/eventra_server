import { AuthService } from "./auth.service";
const createUser = async (req, res) => {
    try {
        const result = await AuthService.createUserIntoDB(req.body);
        res.status(201).json({
            success: true,
            data: result,
            message: "User Registered Successfully",
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
const loginUser = async (req, res) => {
    try {
        const result = await AuthService.loginUserIntoDB(req.body);
        res.cookie("token", result.token, {
            secure: false, //in production it will be true
            httpOnly: true,
            sameSite: "strict",
        });
        res.status(201).json({
            success: true,
            data: result,
            message: "User Logged in  Successfully",
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
const logoutUser = async (req, res) => {
    try {
        const result = await AuthService.logoutUser();
        res.clearCookie("token");
        res.status(200).json({
            success: true,
            data: result,
            message: "User Logged out Successfully",
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
const getUserFromToken = async (req, res) => {
    try {
        const token = req.headers.authorization;
        const result = await AuthService.getUserFromToken(token);
        res.status(200).json({
            success: true,
            data: result,
            message: "User fetched successfully",
        });
    }
    catch (error) {
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
    logoutUser,
    getUserFromToken,
};
//# sourceMappingURL=auth.controller.js.map