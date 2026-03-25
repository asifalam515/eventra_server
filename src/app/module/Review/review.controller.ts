import { Request, Response } from "express";
import { ReviewService } from "./review.service";

const createReview = async (req: Request, res: Response) => {
  try {
    const { eventId, rating, comment } = req.body;
    const userId = req.user?.id as string;

    if (!eventId || !rating || !comment) {
      return res.status(400).json({ success: false, message: "eventId, rating, and comment are required" });
    }

    const review = await ReviewService.createReview(eventId, userId, parseInt(rating), comment);
    res.status(201).json({ success: true, message: "Review created successfully", data: review });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message || "Failed to create review" });
  }
};

const getReviewsByEvent = async (req: Request, res: Response) => {
  try {
    const { eventId } = req.params;
    const reviews = await ReviewService.getReviewsByEvent(eventId as string);
    res.status(200).json({ success: true, message: "Reviews fetched successfully", data: reviews });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message || "Failed to fetch reviews" });
  }
};

const updateReview = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user?.id as string;

    const review = await ReviewService.updateReview(id as string, userId, parseInt(rating), comment);
    res.status(200).json({ success: true, message: "Review updated successfully", data: review });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message || "Failed to update review" });
  }
};

const deleteReview = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id as string;

    await ReviewService.deleteReview(id as string, userId);
    res.status(200).json({ success: true, message: "Review deleted successfully" });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message || "Failed to delete review" });
  }
};

export const ReviewController = {
  createReview,
  getReviewsByEvent,
  updateReview,
  deleteReview,
};
