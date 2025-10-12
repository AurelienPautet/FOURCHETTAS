import express from "express";

import { saveImage, getImage } from "../controllers/imagesController.js";

const router = express.Router();

router.post("/", saveImage);
router.get("/:id", getImage);

export default router;
