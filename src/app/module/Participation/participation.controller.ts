import { Request, Response } from "express";
import { ParticipationService } from "./participation.service";

const joinEvent = async (req: Request, res: Response) => {
  try {
    const { eventId } = req.body;
    const userId = req.user.id as string; // Populated by your Auth Middleware

    if (!eventId) {
      return res.status(400).json({
        success: false,
        message: "Event ID is required",
      });
    }

    const result = await ParticipationService.joinEvent(userId, eventId);

    res.status(201).json({
      success: true,
      message: result.message,
      data: result.participation,
      requiresPayment: result.requiresPayment,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || "Failed to join event",
    });
  }
};

const getAllParticipants = async (req: Request, res: Response) => {
  try {
    const { eventId } = req.params;
    const participants = await ParticipationService.getAllParticipantFromDb(eventId as string);
    res.status(200).json({
      success: true,
      message: "Participants fetched successfully For that Paritcular Event",
      data: participants,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || "Failed to fetch participants",
    });
  }
}
const updateParticipationStatus = async (req: Request, res: Response) => {
  try {
    const requesterId = req.user?.id as string;
    const { eventId, userId, status } = req.body;
    const updatedParticipation = await ParticipationService.updateParticipationStatus(requesterId, eventId, userId, status );
    res.status(200).json({
      success: true,
      message: "Participation status updated successfully",
      data: updatedParticipation,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || "Failed to update participation status",
    });
  }
}

export const ParticipationController = {
  joinEvent,
  getAllParticipants,
  updateParticipationStatus,
};
