import { Router } from "express";
import { ChatController } from "./chat.controller.js";

const router = Router();

router.post("/", ChatController.askAssistant);

export const ChatRouter = router;
