import client from "../config/db.js";

export const getItemByEventId = async (req, res) => {
  const event_id = req.params.id;
  try {
    const result = await client.query(
      "SELECT * FROM items WHERE event_id = $1",
      [event_id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "No items found for this event" });
    }
    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Error fetching items by event ID", err.stack);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteItemByEventId = async (req, res = false) => {
  const event_id = req.params.id;
  await client
    .query("DELETE FROM items WHERE event_id =$1 RETURNING *", [event_id])
    .then((result) => {
      if (result.rows.length === 0) {
        if (res !== false) {
          return res.status(404).json({ error: "Item(s) not found" });
        }
      }
      if (res !== false) {
        res.status(200).json({ message: "Item(s) deleted successfully" });
      }
      return;
    })
    .catch((err) => {
      console.error("Error deleting Item(s)", err.stack);
      if (res !== false) {
        res.status(500).json({ error: "Internal server error" });
      }
    });
};

export const createItem = async (req, res) => {
  const body = req.body;
  if (!body.items) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const insertedItems = [];

    for (const item of body.items) {
      const result = await client.query(
        "INSERT INTO items (name, description, price, event_id,img_url,type,quantity) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
        [
          item.name,
          item.description,
          Number(item.price),
          body.event_id,
          item.img_url,
          item.type,
          item.quantity,
        ]
      );
      insertedItems.push(result.rows[0]);
    }

    res.status(201).json(body.event_id);
  } catch (err) {
    console.error("Error creating item", err.stack);
    res.status(500).json({ error: "Internal server error" });
  }
};
