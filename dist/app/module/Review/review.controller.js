import { ReviewService } from "./review.service";
const createReview = async (req, res) => {
    try {
        const { eventId, rating, comment } = req.body;
        const userId = req.user?.id;
        if (!eventId || !rating || !comment) {
            return res.status(400).json({ success: false, message: "eventId, rating, and comment are required" });
        }
        const review = await ReviewService.createReview(eventId, userId, parseInt(rating), comment);
        res.status(201).json({ success: true, message: "Review created successfully", data: review });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message || "Failed to create review" });
    }
};
const getReviewsByEvent = async (req, res) => {
    try {
        const { eventId } = req.params;
        const reviews = await ReviewService.getReviewsByEvent(eventId);
        res.status(200).json({ success: true, message: "Reviews fetched successfully", data: reviews });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message || "Failed to fetch reviews" });
    }
};
const updateReview = async (req, res) => {
    try {
        const { id } = req.params;
        const { rating, comment } = req.body;
        const userId = req.user?.id;
        const review = await ReviewService.updateReview(id, userId, parseInt(rating), comment);
        res.status(200).json({ success: true, message: "Review updated successfully", data: review });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message || "Failed to update review" });
    }
};
const deleteReview = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user?.id;
        await ReviewService.deleteReview(id, userId);
        res.status(200).json({ success: true, message: "Review deleted successfully" });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message || "Failed to delete review" });
    }
};
export const ReviewController = {
    createReview,
    getReviewsByEvent,
    updateReview,
    deleteReview,
};
//# sourceMappingURL=review.controller.js.map