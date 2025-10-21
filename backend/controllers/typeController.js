import pool from "../config/db.js";

export const getTypeByEventId = async (req, res) => {
  const event_id = req.params.id;
  try {
    const result = await pool.query(
      "SELECT items_types.name,order_index,is_required FROM items_types JOIN items_types_events ON items_types.id = items_types_events.type_id WHERE items_types_events.event_id = $1",
      [event_id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "No types found for this event" });
    }
    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Error fetching types by event ID", err.stack);
    res.status(500).json({ error: "Internal server error" });
  }
};
