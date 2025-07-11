import express from "express";
import {
  getAllEvents,
  getEventById,
  getUpcomingEvents,
  createEvent,
  updateEvent,
  deleteEvent,
} from "../controllers/eventController.js";

import { getItemByEventId } from "../controllers/itemController.js";

const router = express.Router();

router.get("/", getAllEvents);

router.get("/upcoming", getUpcomingEvents);

router.get("/:id", getEventById);

router.get("/:id/items", getItemByEventId);

router.post("/", createEvent);

router.put("/:id", updateEvent);

router.delete("/:id", deleteEvent);

export default router;
