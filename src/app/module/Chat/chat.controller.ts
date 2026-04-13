import { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../../utils/catchAsync";
import sendResponse from "../../../utils/sendResponse";
import { AppError } from "../../errors/AppErrors";
import { ChatService } from "./chat.service.js";

const askAssistant = catchAsync(async (req: Request, res: Response) => {
  const message = req.body?.message;
  const sessionId = req.body?.sessionId;

  if (!message || typeof message !== "string" || !message.trim()) {
    throw new AppError(httpStatus.BAD_REQUEST, "message is required");
  }

  if (sessionId !== undefined && typeof sessionId !== "string") {
    throw new AppError(httpStatus.BAD_REQUEST, "sessionId must be a string");
  }

  const result = await ChatService.askAssistant(message.trim(), sessionId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Assistant response generated",
    data: result,
  });
});

export const ChatController = {
  askAssistant,
};
