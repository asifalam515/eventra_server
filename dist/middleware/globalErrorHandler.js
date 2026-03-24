import { AppError } from "../app/errors/AppErrors";
export const globalErrorHandler = (error, req, res, next) => {
    let statusCode = 500;
    let message = "Something went wrong";
    // Custom AppError
    if (error instanceof AppError) {
        statusCode = error.statusCode;
        message = error.message;
    }
    // Prisma error (basic handling)
    else if (error.code === "P2002") {
        statusCode = 400;
        message = "Duplicate entry";
    }
    // JWT errors
    else if (error.name === "JsonWebTokenError") {
        statusCode = 401;
        message = "Invalid token";
    }
    else if (error.name === "TokenExpiredError") {
        statusCode = 401;
        message = "Token expired";
    }
    return res.status(statusCode).json({
        success: false,
        message,
        error: process.env.NODE_ENV === "development" ? error : undefined,
    });
};
//# sourceMappingURL=globalErrorHandler.js.map