import { Request, Response } from "express";
import { AdminService } from "./admin.service";

const getAllUsers = async (req: Request, res: Response) => {
  try {
    const filters = req.query;
    const pagination = {
      page: parseInt(req.query.page as string) || 1,
      limit: parseInt(req.query.limit as string) || 10,
    };
    const result = await AdminService.getAllUsers(filters, pagination);
    res.status(200).json({ success: true, message: "Users fetched successfully", data: result });
  } catch (error: any) {
    res.status(error.statusCode || 500).json({ success: false, message: error.message });
  }
};

const getSingleUser = async (req: Request, res: Response) => {
  try {
    const result = await AdminService.getSingleUser(req.params.id as string);
    res.status(200).json({ success: true, message: "User fetched successfully", data: result });
  } catch (error: any) {
    res.status(error.statusCode || 500).json({ success: false, message: error.message });
  }
};

const banUser = async (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    const adminId = req.user?.id as string;
    const result = await AdminService.updateUserStatus(req.params.id as string, status || "BLOCKED", adminId);
    res.status(200).json({ success: true, message: "User status updated successfully", data: result });
  } catch (error: any) {
    res.status(error.statusCode || 500).json({ success: false, message: error.message });
  }
};

const updateUserRole = async (req: Request, res: Response) => {
  try {
    const { role } = req.body;
    const adminId = req.user?.id as string;
    const result = await AdminService.updateUserRole(req.params.id as string, role, adminId);
    res.status(200).json({ success: true, message: "User role updated successfully", data: result });
  } catch (error: any) {
    res.status(error.statusCode || 500).json({ success: false, message: error.message });
  }
};

const getAllEvents = async (req: Request, res: Response) => {
  try {
    const filters = req.query;
    const pagination = {
      page: parseInt(req.query.page as string) || 1,
      limit: parseInt(req.query.limit as string) || 10,
    };
    const result = await AdminService.getAllEvents(filters, pagination);
    res.status(200).json({ success: true, message: "Events fetched successfully", data: result });
  } catch (error: any) {
    res.status(error.statusCode || 500).json({ success: false, message: error.message });
  }
};

const getSingleEvent = async (req: Request, res: Response) => {
  try {
    const result = await AdminService.getSingleEvent(req.params.id as string);
    res.status(200).json({ success: true, message: "Event fetched successfully", data: result });
  } catch (error: any) {
    res.status(error.statusCode || 500).json({ success: false, message: error.message });
  }
};

const deleteEvent = async (req: Request, res: Response) => {
  try {
    const adminId = req.user?.id as string;
    await AdminService.deleteEvent(req.params.id as string, adminId);
    res.status(200).json({ success: true, message: "Event deleted successfully" });
  } catch (error: any) {
    res.status(error.statusCode || 500).json({ success: false, message: error.message });
  }
};

const toggleEventFeature = async (req: Request, res: Response) => {
  try {
    const { isFeatured } = req.body;
    const result = await AdminService.toggleEventFeature(req.params.id as string, isFeatured);
    res.status(200).json({ success: true, message: "Event feature toggled successfully", data: result });
  } catch (error: any) {
    res.status(error.statusCode || 500).json({ success: false, message: error.message });
  }
};

const deleteReview = async (req: Request, res: Response) => {
  try {
    const adminId = req.user?.id as string;
    await AdminService.deleteReview(req.params.id as string, adminId);
    res.status(200).json({ success: true, message: "Review deleted successfully" });
  } catch (error: any) {
    res.status(error.statusCode || 500).json({ success: false, message: error.message });
  }
};

const getDashboardAnalytics = async (req: Request, res: Response) => {
  try {
    const result = await AdminService.getDashboardAnalytics();
    res.status(200).json({ success: true, message: "Dashboard analytics fetched successfully", data: result });
  } catch (error: any) {
    res.status(error.statusCode || 500).json({ success: false, message: error.message });
  }
};

const getActivityLogs = async (req: Request, res: Response) => {
  try {
    const pagination = {
      page: parseInt(req.query.page as string) || 1,
      limit: parseInt(req.query.limit as string) || 20,
    };
    const result = await AdminService.getActivityLogs(pagination);
    res.status(200).json({ success: true, message: "Activity logs fetched successfully", data: result });
  } catch (error: any) {
    res.status(error.statusCode || 500).json({ success: false, message: error.message });
  }
};

const getAllReports = async (req: Request, res: Response) => {
  try {
    const filters = req.query;
    const pagination = {
      page: parseInt(req.query.page as string) || 1,
      limit: parseInt(req.query.limit as string) || 20,
    };
    const result = await AdminService.getAllReports(filters, pagination);
    res.status(200).json({ success: true, message: "Reports fetched successfully", data: result });
  } catch (error: any) {
    res.status(error.statusCode || 500).json({ success: false, message: error.message });
  }
};

const updateReportStatus = async (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    const result = await AdminService.updateReportStatus(req.params.id as string, status);
    res.status(200).json({ success: true, message: "Report status updated successfully", data: result });
  } catch (error: any) {
    res.status(error.statusCode || 500).json({ success: false, message: error.message });
  }
};

export const AdminController = {
  getAllUsers, getSingleUser, banUser, updateUserRole,
  getAllEvents, getSingleEvent, deleteEvent, toggleEventFeature,
  deleteReview, getDashboardAnalytics, getActivityLogs,
  getAllReports, updateReportStatus
};
