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
export declare const EventStatus: {
    readonly AVAILABLE: "AVAILABLE";
    readonly COMPLETED: "COMPLETED";
    readonly CANCELLED: "CANCELLED";
    readonly EXPIRED: "EXPIRED";
};
export type EventStatus = (typeof EventStatus)[keyof typeof EventStatus];
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
export declare const LogAction: {
    readonly DELETE_EVENT: "DELETE_EVENT";
    readonly DELETE_REVIEW: "DELETE_REVIEW";
    readonly BAN_USER: "BAN_USER";
    readonly UPDATE_ROLE: "UPDATE_ROLE";
};
export type LogAction = (typeof LogAction)[keyof typeof LogAction];
export declare const ReportTargetType: {
    readonly EVENT: "EVENT";
    readonly REVIEW: "REVIEW";
};
export type ReportTargetType = (typeof ReportTargetType)[keyof typeof ReportTargetType];
export declare const ReportStatus: {
    readonly PENDING: "PENDING";
    readonly RESOLVED: "RESOLVED";
    readonly DISMISSED: "DISMISSED";
};
export type ReportStatus = (typeof ReportStatus)[keyof typeof ReportStatus];
//# sourceMappingURL=enums.d.ts.map