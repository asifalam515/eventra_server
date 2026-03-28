import { Request, Response } from "express";
export declare const InvitationController: {
    sendInvitation: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
    acceptInvitation: (req: Request, res: Response) => Promise<void>;
    declineInvitation: (req: Request, res: Response) => Promise<void>;
    getUserInvitations: (req: Request, res: Response) => Promise<void>;
};
//# sourceMappingURL=invitation.controller.d.ts.map