import { Request, Response } from "express";
import { ReportService } from "./report.service";

const createReport = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id as string;
    const { targetType, targetId, reason } = req.body;
    
    if (!targetType || !targetId || !reason) {
      return res.status(400).json({ success: false, message: "targetType, targetId, and reason are required" });
    }

    const report = await ReportService.createReport(userId, targetType, targetId, reason);
    res.status(201).json({ success: true, message: "Report created successfully", data: report });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const ReportController = { createReport };
