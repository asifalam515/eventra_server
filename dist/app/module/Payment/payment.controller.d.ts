import { Request, Response } from "express";
export declare const PaymentController: {
    createPaymentIntent: (req: Request, res: Response, next: import("express").NextFunction) => void;
    stripeWebhook: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
};
//# sourceMappingURL=payment.controller.d.ts.map