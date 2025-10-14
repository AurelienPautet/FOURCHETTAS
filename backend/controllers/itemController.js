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
    .query("UPDATE items SET deleted = TRUE WHERE event_id =$1 RETURNING *", [
      event_id,
    ])
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
  const { items } = req.body;
  console.log("Creating items with body:", items);
  if (!items) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const insertedItems = [];

    for (const item of items) {
      const imageId = await client.query(
        "INSERT INTO images (data) VALUES ($1) RETURNING id",
        [[Buffer.from(item.img_url, "utf-8")]]
      );

      const result = await client.query(
        "INSERT INTO items (name, description, price,img_url,type,quantity) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
        [
          item.name,
          item.description,
          Number(item.price),
          `${serverUrl}/api/images/${imageId.rows[0].id}`,
          item.type,
          item.quantity,
        ]
      );

      insertedItems.push(result.rows[0]);
    }
    res.status(201).json(insertedItems);
    return insertedItems;
  } catch (err) {
    console.error("Error creating item", err.stack);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteItems = async (req, res) => {
  const itemIds = req.body;
  console.log("Deleting items with IDs:", itemIds);
  if (!Array.isArray(itemIds) || itemIds.length === 0) {
    return res.status(400).json({ error: "Invalid item IDs" });
  }

  try {
    const result = await client.query(
      "UPDATE items SET deleted = TRUE WHERE id = ANY($1) RETURNING *",
      [itemIds]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "No items found" });
    }

    res.status(200).json({ message: "Items deleted successfully" });
  } catch (err) {
    console.error("Error deleting items", err.stack);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateItems = async (req, res) => {
  const items = req.body;
  console.log("Updating items with data:", items);
  if (items.length === 0) {
    return res.status(400).json({ error: "Invalid items data" });
  }
  try {
    const updatedItems = [];
    for (const item of items) {
      if (
        !item.id ||
        !item.name ||
        !item.description ||
        item.price === undefined ||
        !item.event_id ||
        !item.type ||
        item.quantity === undefined
      ) {
        return res.status(400).json({ error: "Missing required fields" });
      }
      const result = await client.query(
        "UPDATE items SET name=$1, description=$2, price=$3, event_id=$4, img_url=$5, type=$6, quantity=$7 WHERE id=$8 RETURNING *",
        [
          item.name,
          item.description,
          Number(item.price),
          item.event_id,
          item.img_url,
          item.type,
          item.quantity,
          item.id,
        ]
      );
      updatedItems.push(result.rows[0]);
    }
    res.status(200).json(updatedItems);
  } catch (err) {
    console.error("Error updating items", err.stack);
    res.status(500).json({ error: "Internal server error" });
  }
};
