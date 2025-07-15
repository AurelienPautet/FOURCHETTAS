import express from "express";
const url = "https://api.imagerouter.io/v1/openai/images/generations";

import dotenv from "dotenv";
dotenv.config();

const API_KEY = process.env.IMAGEROUTER_API_KEY;

const options = {
  method: "POST",
  headers: {
    Authorization: `Bearer ${API_KEY}`,
    "Content-Type": "application/json",
  },
  body: '{"prompt": "Generate a image with black bg of a big chicken crispy tenders, IOS emoji style (no face nor eyes) with a white outline", "model": "google/gemini-2.0-flash-exp:free"}',
};

const router = express.Router();

router.post("/", async (req, res) => {
  const response = await fetch(url, options);
  const data = await response.json();
  console.log(data);
  res.status(201).json({ message: "Image generation request created", data });
});

export default router;
