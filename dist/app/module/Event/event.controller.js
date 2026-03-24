import { EventService } from "./event.service";
const createEvent = async (req, res) => {
    try {
        if (!req.user?.id) {
            throw new Error("Unauthorized user");
        }
        const result = await EventService.createEventIntoDB(req.body, req.user.id);
        res.status(201).json({
            success: true,
            data: result,
            message: "Event Created Successfully",
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
//get all events and also apply filter and pagination
const getAllEvents = async (req, res) => {
    try {
        const filters = req.query;
        const pagination = {
            page: parseInt(req.query.page) || 1,
            limit: parseInt(req.query.limit) || 10,
        };
        const result = await EventService.getAllEvents(filters, pagination);
        res.status(200).json({
            success: true,
            data: result,
            message: "Events fetched successfully",
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
const getSingleEvent = async (req, res) => {
    const eventId = req.params.id;
    const event = await EventService.getEventById(eventId);
    res.status(200).json({
        success: true,
        data: event,
        message: "Event fetched successfully",
    });
};
//update event by id
const updateEvent = async (req, res) => {
    const eventId = req.params.id;
    const updatedData = req.body;
    const updatedEvent = await EventService.updateEventById(eventId, updatedData);
    res.status(200).json({
        success: true,
        data: updatedEvent,
        message: "Event updated successfully",
    });
};
//delete event
const deleteEvent = async (req, res) => {
    await EventService.deleteEventById(req.params.id);
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
//# sourceMappingURL=event.controller.js.map