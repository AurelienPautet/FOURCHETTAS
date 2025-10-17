import client from "../config/db.js";

export const createOrder = async (req, res) => {
  if (!req.body.name || !req.body.firstname || !req.body.items) {
    console.log(
      req.body,
      "Request body for order creation is missing required fields"
    );
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    await client.query("BEGIN");
    const result = await client.query(
      "INSERT INTO orders (name, firstname, phone, event_id) VALUES ($1, $2, $3, $4) RETURNING id",
      [req.body.name, req.body.firstname, req.body.phone, req.body.event_id]
    );
    const orderId = result.rows[0].id;
    for (const item of req.body.items) {
      console.log(item);
      await client.query(
        "INSERT INTO orders_items (order_id, item_id, ordered_quantity) VALUES ($1, $2, $3)",
        [orderId, item.id, item.ordered_quantity]
      );
    }
    await client.query("COMMIT");
    return res.status(201).json({ orderId });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Error starting transaction", err.stack);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const updateOrder = (req, res) => {
  const orderId = req.params.id;
  const { prepared, delivered } = req.body;
  if (prepared === undefined && delivered === undefined) {
    return res.status(400).json({ error: "No fields to update provided" });
  }

  let nb_of_change = 0;
  let values = [];
  let set_string = "";
  console.log(prepared, delivered);
  if (prepared != null) {
    set_string += "prepared = $" + (nb_of_change + 1);
    set_string += ", preparedAt = $" + (nb_of_change + 2);
    values.push(prepared);
    values.push(prepared ? new Date() : null);
    nb_of_change += 2;
  }

  if (delivered != null) {
    set_string +=
      (nb_of_change > 0 ? "," : "") + "delivered = $" + (nb_of_change + 1);
    set_string += ", deliveredAt = $" + (nb_of_change + 2);
    values.push(delivered);
    values.push(delivered ? new Date() : null);
    nb_of_change += 2;
  }
  console.log(set_string, [...values, parseInt(orderId)]);

  client
    .query(
      "update orders set " +
        set_string +
        " where id = $" +
        (nb_of_change + 1) +
        " returning *",
      [...values, parseInt(orderId)]
    )
    .then((result) => {
      if (result.rows.length === 0) {
        return res.status(404).json({ error: "Order not found" });
      }
      res.status(200).json(result.rows[0]);
    })
    .catch((err) => {
      console.error("Error updating order", err.stack);
      res.status(500).json({ error: "Internal server error" });
    });
};

export const getOrdersByEventId = async (req, res) => {
  const event_id = req.params.id;
  try {
    await client.query("BEGIN");
    let result = await client.query(
      "select orders.id, orders.name, firstname, phone, event_id, created_at,  orders.prepared, delivered , (SELECT json_agg(json_build_object('item_id',item_id,'ordered_quantity',ordered_quantity)) from orders_items where order_id = orders.id) AS items from orders where deleted = False AND event_id = $1 ORDER BY created_at DESC",
      [event_id]
    );
    await client.query("COMMIT");
    res.status(200).json(result.rows);
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Error fetching orders by event id", err.stack);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteOrder = (req, res) => {
  const orderId = req.params.id;
  client
    .query("UPDATE orders SET deleted = TRUE WHERE id = $1 RETURNING *", [
      orderId,
    ])
    .then((result) => {
      if (result.rows.length === 0) {
        return res.status(404).json({ error: "Order not found" });
      }
      res.status(200).json({ message: "Order deleted successfully" });
    })
    .catch((err) => {
      console.error("Error deleting order", err.stack);
      res.status(500).json({ error: "Internal server error" });
    });
};

export const deleteOrderByEventId = (req, res = false) => {
  const orderId = req.params.id;
  client
    .query("UPDATE orders SET deleted = TRUE WHERE event_id = $1 RETURNING *", [
      orderId,
    ])
    .then((result) => {
      if (result.rows.length === 0) {
        if (res !== false) {
          return res.status(404).json({ error: "Order not found" });
        }
        return;
      }
      if (res !== false) {
        res.status(200).json({ message: "Order deleted successfully" });
      }
    })
    .catch((err) => {
      console.error("Error deleting order", err.stack);
      if (res !== false) {
        res.status(500).json({ error: "Internal server error" });
      }
    });
};

export const getOrderByPhoneAndEvent = (req, res) => {
  const { id: event_id, phone } = req.params;
  console.log("Fetching order for phone:", phone, "and event_id:", event_id);
  console.log("Fetching order for phone:", phone, "and event_id:", event_id);
  client
    .query("SELECT * FROM orders WHERE phone = $1 AND event_id = $2", [
      phone,
      event_id,
    ])
    .then((result) => {
      res.status(200).json(result.rows);
    })
    .catch((err) => {
      console.error("Error fetching order by phone and event", err.stack);
      res.status(500).json({ error: "Internal server error" });
    });
};

export const updateOrderContentByPhoneAndEvent = (req, res) => {
  const event_id = req.params.id;
  const { phone, dish_id, side_id, drink_id } = req.body;
  client
    .query(
      "UPDATE orders SET dish_id = $1, side_id = $2, drink_id = $3 WHERE phone = $4 AND event_id = $5 RETURNING *",
      [dish_id, side_id, drink_id, phone, event_id]
    )
    .then((result) => {
      if (result.rows.length === 0) {
        return res
          .status(404)
          .json({ error: "No orders found for this phone and event" });
      }
      res.status(200).json(result.rows[0]);
    })
    .catch((err) => {
      console.error(
        "Error updating order content by phone and event",
        err.stack
      );
      res.status(500).json({ error: "Internal server error" });
    });
};
