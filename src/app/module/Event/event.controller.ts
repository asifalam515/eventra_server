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
const getSingleEvent = async (req: Request, res: Response) => {
  const eventId = req.params.id as string;
  const event = await EventService.getEventById(eventId);
  res.status(200).json({
    success: true,
    data: event,
    message: "Event fetched successfully",
  });
};
//update event by id
const updateEvent = async (req: Request, res: Response) => {
  const eventId = req.params.id as string;
  const updatedData = req.body;
  const updatedEvent = await EventService.updateEventById(eventId, updatedData);
  res.status(200).json({
    success: true,
    data: updatedEvent,
    message: "Event updated successfully",
  });
};
//delete event
const deleteEvent = async (req: Request, res: Response) => {
  await EventService.deleteEventById(req.params.id as string);
  res.status(200).json({
    success: true,
    message: "Event deleted successfully",
  });
};
export const EventController = {
  createEvent,
  getAllEvents,
  getSingleEvent,
  updateEvent,
  deleteEvent,
};
