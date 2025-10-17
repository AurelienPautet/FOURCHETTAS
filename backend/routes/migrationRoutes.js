import express from "express";
import { migrateDatabase } from "../config/migrate.js";

const router = express.Router();

router.post("/run", async (req, res) => {
  try {
    console.log("Starting migration from API endpoint...");
    await migrateDatabase();
    res.status(200).json({ 
      success: true, 
      message: "Migration completed successfully" 
    });
  } catch (error) {
    console.error("Migration failed:", error);
    res.status(500).json({ 
      success: false,
      error: "Migration failed", 
      details: error.message,
      stack: error.stack
    });
  }
});

export default router;
