export declare const ReviewService: {
    createReview: (eventId: string, userId: string, rating: number, comment: string) => Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        eventId: string;
        rating: number;
        comment: string;
    }>;
    getReviewsByEvent: (eventId: string) => Promise<({
        user: {
            id: string;
            name: string;
            photo: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        eventId: string;
        rating: number;
        comment: string;
    })[]>;
    updateReview: (reviewId: string, userId: string, rating: number, comment: string) => Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        eventId: string;
        rating: number;
        comment: string;
    }>;
    deleteReview: (reviewId: string, userId: string) => Promise<boolean>;
};
//# sourceMappingURL=review.service.d.ts.map