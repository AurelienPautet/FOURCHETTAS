import client from "../config/db.js";
import { createDish } from "./dishController.js";

export const getAllEvents = (req, res) => {};

export const getUpcomingEvents = (req, res) => {
  client
    .query("SELECT * FROM events WHERE date >= CURRENT_DATE ORDER BY date ASC")
    .then((result) => {
      res.status(200).json(result.rows);
    })
    .catch((err) => {
      console.error("Error fetching upcoming events", err.stack);
      res.status(500).json({ error: "Internal server error" });
    });
};

export const getEventById = (req, res) => {
  const eventId = req.params.id;
  client
    .query("SELECT * FROM events WHERE id = $1", [eventId])
    .then((result) => {
      if (result.rows.length === 0) {
        return res.status(404).json({ error: "Event not found" });
      }
      res.status(200).json(result.rows[0]);
    })
    .catch((err) => {
      console.error("Error fetching event by ID", err.stack);
      res.status(500).json({ error: "Internal server error" });
    });
};

export const createEvent = (req, res) => {
  const body = req.body;
  if (
    !body.title ||
    !body.description ||
    !body.date ||
    !body.time ||
    !body.form_closing_date ||
    !body.form_closing_time ||
    !body.img_url
  ) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  console.log("Creating event with body:", body);
  client
    .query(
      "INSERT INTO events (title, description, date, time, form_closing_date, form_closing_time, img_url) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
      [
        body.title,
        body.description,
        body.date,
        body.time,
        body.form_closing_date,
        body.form_closing_time,
        body.img_url,
      ]
    )
    .then((result) => {
      req.body["event_id"] = result.rows[0].id;
      createDish(req, res);
    })
    .catch((err) => {
      console.error("Error creating event", err.stack);
      res.status(500).json({ error: "Internal server error" });
    });
};

export const updateEvent = (req, res) => {};

export const deleteEvent = (req, res) => {};
