import client from "../config/db.js";
import nodeFetch from "node-fetch";
import { saveImageToDb } from "../controllers/imagesController.js";
import { serverUrl } from "../index.js";
const fetch = nodeFetch;

export const migrateDatabase = async () => {
  try {
    console.log("Starting database migration...");
    await client.query("BEGIN");

    // Insert types and get their IDs
    await client.query(
      "INSERT INTO items_types (name) VALUES ($1) ON CONFLICT (name) DO NOTHING",
      ["Plat"]
    );
    await client.query(
      "INSERT INTO items_types (name) VALUES ($1) ON CONFLICT (name) DO NOTHING",
      ["Extra"]
    );
    await client.query(
      "INSERT INTO items_types (name) VALUES ($1) ON CONFLICT (name) DO NOTHING",
      ["Boisson"]
    );

    // Get the actual IDs from the database
    let platResult = await client.query(
      "SELECT id FROM items_types WHERE name = $1",
      ["Plat"]
    );
    let extraResult = await client.query(
      "SELECT id FROM items_types WHERE name = $1",
      ["Extra"]
    );
    let boissonResult = await client.query(
      "SELECT id FROM items_types WHERE name = $1",
      ["Boisson"]
    );

    let platID = platResult.rows[0].id;
    let extraID = extraResult.rows[0].id;
    let boissonID = boissonResult.rows[0].id;

    let old_events = await client.query("SELECT * FROM events_backup");
    for (let event of old_events.rows) {
      event.img_url = await convertToBase64(event.img_url);

      let imgId = await saveImageToDb(event.img_url);
      let new_event = await client.query(
        "INSERT INTO events (title, description, date, time, form_closing_date, form_closing_time,img_url) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id",
        [
          event.title,
          event.description,
          event.date,
          event.time,
          event.form_closing_date,
          event.form_closing_time,
          `${serverUrl}/api/images/${imgId.rows[0].id}`,
        ]
      );
      let event_id = new_event.rows[0].id;
      await client.query(
        "INSERT INTO items_types_events (event_id, type_id, order_index, is_required) VALUES ($1, $2, $3, $4)",
        [event_id, platID, 1, true]
      );
      await client.query(
        "INSERT INTO items_types_events (event_id, type_id, order_index, is_required) VALUES ($1, $2, $3, $4)",
        [event_id, extraID, 2, false]
      );
      await client.query(
        "INSERT INTO items_types_events (event_id, type_id, order_index, is_required) VALUES ($1, $2, $3, $4)",
        [event_id, boissonID, 3, false]
      );
      let itemIdDishConversions = {};
      let itemIdSideConversions = {};
      let itemIdDrinkConversions = {};

      let old_items = await client.query(
        "SELECT * FROM items_backup WHERE event_id = $1",
        [event.id]
      );
      for (let item of old_items.rows) {
        let img_url = await convertToBase64(item.img_url);
        if (img_url == null) {
          console.warn(
            "Skipping item due to image conversion failure:",
            item.name
          );
          continue;
        }
        let imgId = await saveImageToDb(img_url);
        item.img_url = `${serverUrl}/api/images/${imgId.rows[0].id}`;
        let newType = "";
        if (item.type === "dish") {
          newType = "Plat";
        } else if (item.type === "side") {
          newType = "Extra";
        } else if (item.type === "drink") {
          newType = "Boisson";
        }
        let new_item = await client.query(
          "INSERT INTO items (name, description, price, type, quantity,img_url) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id",
          [
            item.name,
            item.description,
            item.price,
            newType,
            item.quantity,
            item.img_url,
          ]
        );

        let item_id = new_item.rows[0].id;
        let itemTypeId;
        if (item.type === "dish") {
          itemTypeId = platID;
          itemIdDishConversions[item.id] = item_id;
        } else if (item.type === "side") {
          itemTypeId = extraID;
          console.log(item.id, "side");
          itemIdSideConversions[item.id] = item_id;
        } else if (item.type === "drink") {
          itemTypeId = boissonID;
          itemIdDrinkConversions[item.id] = item_id;
        }
        await client.query(
          "INSERT INTO items_events (item_id, event_id,type_id) VALUES ($1, $2, $3)",
          [item_id, event_id, itemTypeId]
        );
      }
      let old_orders = await client.query(
        "SELECT * FROM orders_backup WHERE event_id = $1",
        [event.id]
      );
      for (let order of old_orders.rows) {
        let new_order = await client.query(
          "INSERT INTO orders (name, firstname, phone, event_id, created_at, prepared, delivered) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id",
          [
            order.name,
            order.firstname,
            order.phone,
            event_id,
            order.created_at,
            order.prepared,
            order.delivered,
          ]
        );
        let order_id = new_order.rows[0].id;
        let dish_id = order.dish_id;
        let side_id = order.side_id;
        let drink_id = order.drink_id;

        if (dish_id != null && dish_id > 0 && itemIdDishConversions[dish_id]) {
          await client.query(
            "INSERT INTO orders_items (order_id, item_id,ordered_quantity) VALUES ($1, $2,1)",
            [order_id, itemIdDishConversions[dish_id]]
          );
        } else if (dish_id != null && dish_id > 0) {
          console.warn(
            `Warning: dish_id ${dish_id} not found in conversions for order ${order_id}`
          );
        }

        if (side_id != null && side_id > 0 && itemIdSideConversions[side_id]) {
          await client.query(
            "INSERT INTO orders_items (order_id, item_id,ordered_quantity) VALUES ($1, $2,1)",
            [order_id, itemIdSideConversions[side_id]]
          );
        } else if (side_id != null && side_id > 0) {
          console.warn(
            `Warning: side_id ${side_id} not found in conversions for order ${order_id}`
          );
        }

        if (
          drink_id != null &&
          drink_id > 0 &&
          itemIdDrinkConversions[drink_id]
        ) {
          await client.query(
            "INSERT INTO orders_items (order_id, item_id,ordered_quantity) VALUES ($1, $2,1)",
            [order_id, itemIdDrinkConversions[drink_id]]
          );
        } else if (drink_id != null && drink_id > 0) {
          console.warn(
            `Warning: drink_id ${drink_id} not found in conversions for order ${order_id}`
          );
        }
      }
    }
    await client.query("COMMIT");
    console.log("Database migration completed successfully.");
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Error during database migration", err.stack);
  }
};

function convertToBase64(img_url) {
  // first check if the img_url is a data URL or a regular URL
  if (img_url.startsWith("data:")) {
    // It's already a data URL, return as is
    return img_url;
  }
  return fetch(img_url)
    .then((response) => response.arrayBuffer())
    .then((buffer) => {
      const base64Flag = "data:image/jpeg;base64,";
      const imageStr = arrayBufferToBase64(buffer);
      return base64Flag + imageStr;
    })
    .catch((error) => {
      console.error("Error converting image to base64:", error);
      return null;
    });
}

function arrayBufferToBase64(buffer) {
  let binary = "";
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return Buffer.from(binary, "binary").toString("base64");
}
