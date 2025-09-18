import express from "express";

import {
  createItem,
  updateItems,
  deleteItems,
} from "../controllers/itemController.js";

const router = express.Router();

router.post("/", createItem);
router.put("/", updateItems);
router.delete("/", deleteItems);

export default router;
