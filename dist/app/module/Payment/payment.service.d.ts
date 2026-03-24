import Stripe from "stripe";
export declare const PaymentService: {
    createPaymentIntent: (userEmail: string, eventId: string) => Promise<{
        clientSecret: string | null;
        transactionId: string;
    }>;
    handleStripeWebhook: (event: Stripe.Event) => Promise<void>;
};
//# sourceMappingURL=payment.service.d.ts.map