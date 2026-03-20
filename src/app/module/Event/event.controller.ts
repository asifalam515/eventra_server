import { Request, Response } from "express";
import { EventService } from "./event.service";

const createEvent = async (req: Request, res: Response) => {
  try {
    if (!req.user?.id) {
      throw new Error("Unauthorized user");
    }
    const result = await EventService.createEventIntoDB(
      req.body,
      req.user.id as string,
    );
    res.status(201).json({
      success: true,
      data: result,
      message: "Event Created Successfully",
    });
  } catch (error: any) {
    console.log(error);
    res.status(500).json({
      success: false,

      message: error.message,
    });
  }
};
//get all events and also apply filter and pagination
const getAllEvents = async (req: Request, res: Response) => {
  try {
    const filters = req.query;
    const pagination = {
      page: parseInt(req.query.page as string) || 1,
      limit: parseInt(req.query.limit as string) || 10,
    };
    const result = await EventService.getAllEvents(filters, pagination);
    res.status(200).json({
      success: true,
      data: result,
      message: "Events fetched successfully",
    });
  } catch (error: any) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const EventController = { createEvent, getAllEvents };
