import express from "express";
import {
  getEventById,
  getUpcomingEvents,
  createEvent,
  updateEvent,
  deleteEvent,
  getOldEvents,
} from "../controllers/eventController.js";

import { getItemByEventId } from "../controllers/itemController.js";
import { getOrdersByEventId } from "../controllers/orderController.js";

const router = express.Router();

router.get("/upcoming", getUpcomingEvents);

router.get("/old", getOldEvents);

router.get("/:id", getEventById);

router.get("/:id/items", getItemByEventId);

router.get("/:id/orders", getOrdersByEventId);

router.post("/", createEvent);

router.put("/:id", updateEvent);

router.delete("/:id", deleteEvent);

export default router;
