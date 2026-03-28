import { Request, Response } from "express";
export declare const ReviewController: {
    createReview: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
    getReviewsByEvent: (req: Request, res: Response) => Promise<void>;
    updateReview: (req: Request, res: Response) => Promise<void>;
    deleteReview: (req: Request, res: Response) => Promise<void>;
};
//# sourceMappingURL=review.controller.d.ts.map