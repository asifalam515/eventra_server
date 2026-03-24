export declare const Role: {
    readonly USER: "USER";
    readonly ADMIN: "ADMIN";
    readonly MODERATOR: "MODERATOR";
};
export type Role = (typeof Role)[keyof typeof Role];
export declare const Status: {
    readonly ACTIVE: "ACTIVE";
    readonly INACTIVE: "INACTIVE";
    readonly BLOCKED: "BLOCKED";
};
export type Status = (typeof Status)[keyof typeof Status];
export declare const EventType: {
    readonly PUBLIC: "PUBLIC";
    readonly PRIVATE: "PRIVATE";
};
export type EventType = (typeof EventType)[keyof typeof EventType];
export declare const ParticipationStatus: {
    readonly PENDING: "PENDING";
    readonly APPROVED: "APPROVED";
    readonly REJECTED: "REJECTED";
    readonly BANNED: "BANNED";
};
export type ParticipationStatus = (typeof ParticipationStatus)[keyof typeof ParticipationStatus];
export declare const InvitationStatus: {
    readonly PENDING: "PENDING";
    readonly ACCEPTED: "ACCEPTED";
    readonly DECLINED: "DECLINED";
};
export type InvitationStatus = (typeof InvitationStatus)[keyof typeof InvitationStatus];
export declare const PaymentStatus: {
    readonly UNPAID: "UNPAID";
    readonly PAID: "PAID";
    readonly FAILED: "FAILED";
};
export type PaymentStatus = (typeof PaymentStatus)[keyof typeof PaymentStatus];
//# sourceMappingURL=enums.d.ts.map