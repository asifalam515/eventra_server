import { prisma } from "../../../lib/prisma";
const createReport = async (userId, targetType, targetId, reason) => {
    return await prisma.report.create({
        data: {
            reporterId: userId,
            targetType: targetType,
            targetId,
            reason
        }
    });
};
export const ReportService = { createReport };
//# sourceMappingURL=report.service.js.map