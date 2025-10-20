import client from "../config/db.js";
import { createItem, deleteItemByEventId } from "./itemController.js";
import { deleteOrderByEventId } from "./orderController.js";
import { serverUrl } from "../index.js";
import { saveImageToDb } from "./imagesController.js";
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

export const updateEvent = async (req, res) => {
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

  try {
    await client.query("BEGIN");

    await client.query(
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
    );

    if (body.types && Array.isArray(body.types)) {
      for (let type of body.types) {
        let typeId = await client.query(
          "INSERT INTO items_types (name) VALUES ($1) ON CONFLICT (name) DO UPDATE SET name=EXCLUDED.name RETURNING id",
          [type.name]
        );

        const linkExists = await client.query(
          "SELECT * FROM items_types_events WHERE type_id=$1 AND event_id=$2",
          [typeId.rows[0].id, event_id]
        );

        if (linkExists.rows.length === 0) {
          await client.query(
            "INSERT INTO items_types_events (type_id, event_id, order_index, is_required) VALUES ($1, $2, $3, $4)",
            [typeId.rows[0].id, event_id, type.order_index, type.is_required]
          );
        } else {
          await client.query(
            "UPDATE items_types_events SET order_index=$1, is_required=$2 WHERE type_id=$3 AND event_id=$4",
            [type.order_index, type.is_required, typeId.rows[0].id, event_id]
          );
        }
      }

      if (body.typesToDelete && Array.isArray(body.typesToDelete)) {
        for (let typeName of body.typesToDelete) {
          await client.query(
            "DELETE FROM items_types_events WHERE type_id=(SELECT id FROM items_types WHERE name=$1) AND event_id=$2",
            [typeName, event_id]
          );
        }
      }
    }

    if (body.items && Array.isArray(body.items)) {
      for (let item of body.items) {
        if (item.new) {
          const imageId = await saveImageToDb(item.img_url);
          const inserted_item = await client.query(
            "INSERT INTO items (name, description, price, img_url, type, quantity) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
            [
              item.name,
              item.description,
              Number(item.price),
              `${serverUrl}/api/images/${imageId.rows[0].id}`,
              item.type,
              item.quantity,
            ]
          );
          await client.query(
            "INSERT INTO items_events (item_id, event_id, type_id) VALUES ($1, $2, (SELECT id FROM items_types WHERE name=$3))",
            [inserted_item.rows[0].id, event_id, item.type]
          );
        } else if (item.modified && item.id) {
          let img_url = item.img_url;
          if (item.img_url && !item.img_url.startsWith("http")) {
            const imageId = await saveImageToDb(item.img_url);
            img_url = `${serverUrl}/api/images/${imageId.rows[0].id}`;
          }
          await client.query(
            "UPDATE items SET name=$1, description=$2, price=$3, img_url=$4, type=$5, quantity=$6 WHERE id=$7",
            [
              item.name,
              item.description,
              Number(item.price),
              img_url,
              item.type,
              item.quantity,
              item.id,
            ]
          );
          await client.query(
            "UPDATE items_events SET type_id=(SELECT id FROM items_types WHERE name=$1) WHERE item_id=$2 AND event_id=$3",
            [item.type, item.id, event_id]
          );
        }
      }
    }

    if (body.itemsToDelete && Array.isArray(body.itemsToDelete)) {
      for (let item of body.itemsToDelete) {
        if (item.id) {
          await client.query("UPDATE items SET deleted=TRUE WHERE id=$1", [
            item.id,
          ]);
        }
      }
    }

    await client.query("COMMIT");
    res.status(200).json(event_id);
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Error updating event", err.stack);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getUpcomingEvents = (req, res) => {
  client
    .query(
      "SELECT * FROM events WHERE date >= CURRENT_DATE AND deleted = FALSE ORDER BY date ASC"
    )
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
      "SELECT e.*, TO_JSONB(o.*) AS orderUser FROM events e LEFT JOIN orders o ON e.id = o.event_id  AND o.phone = $1 WHERE date >= CURRENT_DATE AND e.deleted = FALSE ORDER BY date ASC",
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
    .query(
      "SELECT * FROM events WHERE date < CURRENT_DATE AND deleted = FALSE ORDER BY date ASC"
    )
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

export const createEvent = async (req, res) => {
  const body = req.body;
  if (
    !body.title ||
    !body.description ||
    !body.date ||
    !body.time ||
    !body.form_closing_date ||
    !body.form_closing_time ||
    !body.img_url ||
    !body.items ||
    !body.types
  ) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  console.log("Creating event with body:", body);
  try {
    await client.query("BEGIN");
    const eventImgId = await saveImageToDb(body.img_url);
    let result = await client.query(
      "INSERT INTO events (title, description, date, time, form_closing_date, form_closing_time, img_url) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
      [
        body.title,
        body.description,
        body.date,
        body.time,
        body.form_closing_date,
        body.form_closing_time,
        `${serverUrl}/api/images/${eventImgId.rows[0].id}`,
      ]
    );
    let eventId = result.rows[0].id;
    console.log("Created event with ID:", eventId);

    for (let type of body.types) {
      console.log("Processing type:", type);
      let typeId = await client.query(
        "INSERT INTO items_types (name) VALUES ($1) ON CONFLICT (name) DO UPDATE SET name=EXCLUDED.name RETURNING id",
        [type.name]
      );
      console.log("Inserted type:", typeId.rows[0]);
      await client.query(
        "INSERT INTO items_types_events (type_id, event_id,order_index,is_required) VALUES ($1, $2, $3, $4)",
        [typeId.rows[0].id, eventId, type.order_index, type.is_required]
      );
      console.log("Linked type to event:", typeId.rows[0].id, eventId);
    }
    for (let item of body.items) {
      const imageId = await saveImageToDb(item.img_url);
      console.log("Inserted image for item:", imageId.rows[0]);
      const inserted_item = await client.query(
        "INSERT INTO items (name, description, price,img_url,type,quantity) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
        [
          item.name,
          item.description,
          Number(item.price),
          `${serverUrl}/api/images/${imageId.rows[0].id}`,
          item.type,
          item.quantity,
        ]
      );
      console.log("Inserted item:", inserted_item.rows[0]);
      await client.query(
        "INSERT INTO items_events (item_id, event_id,type_id) VALUES ($1, $2, (SELECT id FROM items_types WHERE name=$3))",
        [inserted_item.rows[0].id, eventId, item.type]
      );
    }
    await client.query("COMMIT");
    res.status(201).json(eventId);
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error creating event", error.stack);
    res.status(500).json({ error: "Internal server error" });
  }
};
