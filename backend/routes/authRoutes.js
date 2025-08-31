import express from "express";
import env from "dotenv";

env.config();

const router = express.Router();

router.post("/login", (req, res) => {
  const { password } = req.body;
  if (password === process.env.ADMIN_PASSWORD) {
    return res.status(200).json({ message: "Login successful" });
  }
  return res.status(401).json({ message: "Invalid password" });
});
export default router;
