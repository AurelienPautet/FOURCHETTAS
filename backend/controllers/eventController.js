import client from "../config/db.js";
import { createItem, deleteItemByEventId } from "./itemController.js";
import { deleteOrderByEventId } from "./orderController.js";

export const deleteEvent = async (req, res) => {
  try {
    await deleteOrderByEventId(req);
    try {
      await deleteItemByEventId(req);
    } catch (error) {
      console.log(error);
    }
  } catch (error) {
    console.log(error);
  }
  const event_id = req.params.id;
  client
    .query("UPDATE events SET deleted = TRUE WHERE id = $1 RETURNING *", [
      event_id,
    ])
    .then((result) => {
      if (result.rows.length === 0) {
        return res.status(404).json({ error: "Event not found" });
      }
      res.status(200).json({ message: "Event deleted successfully" });
    })
    .catch((err) => {
      console.error("Error deleting event", err.stack);
      res.status(500).json({ error: "Internal server error" });
    });
};

export const updateEvent = (req, res) => {
  console.log("Received request to update event");
  const body = req.body;
  const event_id = req.params.id;
  console.log("Updating event with body:", body);
  console.log("Event ID:", event_id);
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
  client
    .query(
      "UPDATE events SET title=$1, description=$2, date=$3, time=$4, form_closing_date=$5, form_closing_time=$6, img_url=$7 WHERE id=$8 RETURNING *",
      [
        body.title,
        body.description,
        body.date,
        body.time,
        body.form_closing_date,
        body.form_closing_time,
        body.img_url,
        event_id,
      ]
    )
    .then((result) => {
      if (result.rows.length === 0) {
        return res.status(404).json({ error: "Event not found" });
      }
      res.status(200).json(result.rows[0]);
    })
    .catch((err) => {
      console.error("Error updating event", err.stack);
      res.status(500).json({ error: "Internal server error" });
    });
};

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

export const getUpcomingEventsWithPhoneOrder = (req, res) => {
  const phone = req.params.phone;
  client
    .query(
      "SELECT e.*, TO_JSONB(o.*) AS orderUser FROM events e LEFT JOIN orders o ON e.id = o.event_id  AND o.phone = $1 WHERE date >= CURRENT_DATE ORDER BY date ASC",
      [phone]
    )
    .then((result) => {
      res.status(200).json(result.rows);
    })
    .catch((err) => {
      console.error("Error fetching upcoming events", err.stack);
      res.status(500).json({ error: "Internal server error" });
    });
};

export const getOldEvents = (req, res) => {
  client
    .query("SELECT * FROM events WHERE date < CURRENT_DATE ORDER BY date ASC")
    .then((result) => {
      res.status(200).json(result.rows);
    })
    .catch((err) => {
      console.error("Error fetching upcoming events", err.stack);
      res.status(500).json({ error: "Internal server error" });
    });
};

export const getEventById = (req, res) => {
  const event_id = req.params.id;
  client
    .query("SELECT * FROM events WHERE events.id = $1", [event_id])
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
      createItem(req, res);
    })
    .catch((err) => {
      console.error("Error creating event", err.stack);
      res.status(500).json({ error: "Internal server error" });
    });
};
