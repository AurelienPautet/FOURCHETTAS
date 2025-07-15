import express from "express";
import postImageGen from "../controllers/imageGenController.js";

const router = express.Router();

router.post("/", postImageGen);

export default router;
