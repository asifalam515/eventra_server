import Stripe from "stripe";
export declare const PaymentService: {
    createPaymentIntent: (userEmail: string, eventId: string) => Promise<{
        clientSecret: string | null;
        transactionId: string;
    }>;
    handleStripeWebhook: (event: Stripe.Event) => Promise<void>;
    confirmPayment: (transactionId: string) => Promise<{
        status: string;
    }>;
};
//# sourceMappingURL=payment.service.d.ts.map