export declare const ReportService: {
    createReport: (userId: string, targetType: string, targetId: string, reason: string) => Promise<{
        id: string;
        status: import("../../../generated/prisma/enums").ReportStatus;
        createdAt: Date;
        updatedAt: Date;
        targetId: string;
        targetType: import("../../../generated/prisma/enums").ReportTargetType;
        reason: string;
        reporterId: string;
    }>;
};
//# sourceMappingURL=report.service.d.ts.map