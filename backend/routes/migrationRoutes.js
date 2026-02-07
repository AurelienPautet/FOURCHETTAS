import express from "express";
import { migrateDatabase } from "../config/migrate.js";
import initialQuery from "../config/initialQuery.js";
import pool from "../config/db.js";

const router = express.Router();

router.post("/run", async (req, res) => {
  return;
  try {
    console.log("Starting migration from API endpoint...");
    await migrateDatabase();
    res.status(200).json({
      success: true,
      message: "Migration completed successfully",
    });
  } catch (error) {
    console.error("Migration failed:", error);
    res.status(500).json({
      success: false,
      error: "Migration failed",
      details: error.message,
      stack: error.stack,
    });
  }
});

router.post("/init", async (req, res) => {
  try {
    console.log("Starting initial query execution from API endpoint...");
    const query = initialQuery();
    await pool.query(query);
    res.status(200).json({
      success: true,
      message: "Initial query executed successfully",
    });
  } catch (error) {
    console.error("Initial query execution failed:", error);
    res.status(500).json({
      success: false,
      error: "Initial query execution failed",
      details: error.message,
      stack: error.stack,
    });
  }
});

export default router;
