import { ParticipationService } from "./participation.service";
const joinEvent = async (req, res) => {
    try {
        const { eventId } = req.body;
        const userId = req.user.id; // Populated by your Auth Middleware
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
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error.message || "Failed to join event",
        });
    }
};
export const ParticipationController = {
    joinEvent,
};
//# sourceMappingURL=participation.controller.js.map