import { InvitationService } from "./invitation.service";
const sendInvitation = async (req, res) => {
    try {
        const { eventId, userId } = req.body;
        const requesterId = req.user?.id;
        if (!eventId || !userId) {
            return res.status(400).json({ success: false, message: "Event ID and User ID are required" });
        }
        const invitation = await InvitationService.sendInvitation(eventId, userId, requesterId);
        res.status(201).json({
            success: true,
            message: "Invitation sent successfully",
            data: invitation,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error.message || "Failed to send invitation",
        });
    }
};
const acceptInvitation = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user?.id;
        const result = await InvitationService.acceptInvitation(id, userId);
        res.status(200).json({
            success: true,
            message: "Invitation accepted successfully",
            data: result,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error.message || "Failed to accept invitation",
        });
    }
};
const declineInvitation = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user?.id;
        const invitation = await InvitationService.declineInvitation(id, userId);
        res.status(200).json({
            success: true,
            message: "Invitation declined successfully",
            data: invitation,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error.message || "Failed to decline invitation",
        });
    }
};
const getUserInvitations = async (req, res) => {
    try {
        const userId = req.user?.id;
        const invitations = await InvitationService.getUserInvitations(userId);
        res.status(200).json({
            success: true,
            message: "Invitations retrieved successfully",
            data: invitations,
        });
    }
    catch (error) {
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
//# sourceMappingURL=invitation.controller.js.map