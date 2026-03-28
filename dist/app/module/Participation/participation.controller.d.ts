import { Request, Response } from "express";
export declare const ParticipationController: {
    joinEvent: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
    getAllParticipants: (req: Request, res: Response) => Promise<void>;
    updateParticipationStatus: (req: Request, res: Response) => Promise<void>;
};
//# sourceMappingURL=participation.controller.d.ts.map