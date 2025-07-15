import express from "express";

import { createOrder, updateOrder } from "../controllers/orderController.js";

const router = express.Router();

router.post("/", createOrder);

router.put("/:id", updateOrder);

export default router;
