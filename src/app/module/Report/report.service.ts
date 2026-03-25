import { prisma } from "../../../lib/prisma";

const createReport = async (userId: string, targetType: string, targetId: string, reason: string) => {
  return await prisma.report.create({
    data: {
      reporterId: userId,
      targetType: targetType as any,
      targetId,
      reason
    }
  });
};

export const ReportService = { createReport };
