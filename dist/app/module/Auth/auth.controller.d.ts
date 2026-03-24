import { Request, Response } from "express";
export declare const AuthController: {
    createUser: (req: Request, res: Response) => Promise<void>;
    loginUser: (req: Request, res: Response) => Promise<void>;
    logoutUser: (req: Request, res: Response) => Promise<void>;
    getUserFromToken: (req: Request, res: Response) => Promise<void>;
};
//# sourceMappingURL=auth.controller.d.ts.map