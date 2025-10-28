import express from "express";

import {
  createOrder,
  updateOrder,
  deleteOrder,
  getOrderByPhoneAndEvent,
  updateOrderContentByPhoneAndEvent,
  deleteOrdersByEventIdAndPhone,
} from "../controllers/orderController.js";

const router = express.Router();

router.post("/", createOrder);

router.put("/:id", updateOrder);

router.delete("/:id", deleteOrder);

router.get("/phone/:phone/event/:id", getOrderByPhoneAndEvent);

router.put("/update/:id", updateOrderContentByPhoneAndEvent);

router.delete("/phone/:phone/event/:id", deleteOrdersByEventIdAndPhone);

export default router;
