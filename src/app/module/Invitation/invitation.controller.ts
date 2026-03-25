import { Request, Response } from "express";
import { InvitationService } from "./invitation.service";

const sendInvitation = async (req: Request, res: Response) => {
  try {
    const { eventId, userId } = req.body;
    const requesterId = req.user?.id as string;
    
    if (!eventId || !userId) {
      return res.status(400).json({ success: false, message: "Event ID and User ID are required" });
    }

    const invitation = await InvitationService.sendInvitation(eventId, userId, requesterId);
    
    res.status(201).json({
      success: true,
      message: "Invitation sent successfully",
      data: invitation,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || "Failed to send invitation",
    });
  }
};

const acceptInvitation = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id as string;
    
    const result = await InvitationService.acceptInvitation(id as string, userId);
    
    res.status(200).json({
      success: true,
      message: "Invitation accepted successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || "Failed to accept invitation",
    });
  }
};

const declineInvitation = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id as string;
    
    const invitation = await InvitationService.declineInvitation(id as string, userId);
    
    res.status(200).json({
      success: true,
      message: "Invitation declined successfully",
      data: invitation,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || "Failed to decline invitation",
    });
  }
};

const getUserInvitations = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id as string;
    const invitations = await InvitationService.getUserInvitations(userId);
    
    res.status(200).json({
      success: true,
      message: "Invitations retrieved successfully",
      data: invitations,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || "Failed to retrieve invitations",
    });
  }
};

export const InvitationController = {
  sendInvitation,
  acceptInvitation,
  declineInvitation,
  getUserInvitations,
};
