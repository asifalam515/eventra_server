import { Request, Response } from "express";
export declare const AdminController: {
    getAllUsers: (req: Request, res: Response) => Promise<void>;
    getSingleUser: (req: Request, res: Response) => Promise<void>;
    banUser: (req: Request, res: Response) => Promise<void>;
    updateUserRole: (req: Request, res: Response) => Promise<void>;
    getAllEvents: (req: Request, res: Response) => Promise<void>;
    getSingleEvent: (req: Request, res: Response) => Promise<void>;
    deleteEvent: (req: Request, res: Response) => Promise<void>;
    toggleEventFeature: (req: Request, res: Response) => Promise<void>;
    deleteReview: (req: Request, res: Response) => Promise<void>;
    getDashboardAnalytics: (req: Request, res: Response) => Promise<void>;
    getActivityLogs: (req: Request, res: Response) => Promise<void>;
    getAllReports: (req: Request, res: Response) => Promise<void>;
    updateReportStatus: (req: Request, res: Response) => Promise<void>;
};
//# sourceMappingURL=admin.controller.d.ts.map