import client from "../config/db.js";

export const createOrder = (req, res) => {
  if (
    !req.body.name ||
    !req.body.firstname ||
    !req.body.phone ||
    !req.body.event_id ||
    !req.body.dish_id
  ) {
    console.log(
      req.body,
      "Request body for order creation is missing required fields"
    );
    return res.status(400).json({ error: "Missing required fields" });
  }
  client
    .query(
      "INSERT INTO orders (name, firstname, phone, event_id, dish_id, side_id, drink_id) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
      [
        req.body.name,
        req.body.firstname,
        req.body.phone,
        req.body.event_id,
        req.body.dish_id,
        req.body.side_id || null,
        req.body.drink_id || null,
      ]
    )
    .then((result) => {
      res.status(201).json(result.rows[0]);
    })
    .catch((err) => {
      console.error("Error creating order", err.stack);
      res.status(500).json({ error: "Internal server error" });
    });
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
    values.push(prepared);
    nb_of_change++;
  }

  if (delivered != null) {
    set_string +=
      (nb_of_change > 0 ? "," : "") + "delivered = $" + (nb_of_change + 1);
    values.push(delivered);
    nb_of_change++;
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

export const getOrdersByEventId = (req, res) => {
  const event_id = req.params.id;
  client
    .query("SELECT * FROM orders WHERE event_id = $1 order by created_at", [
      event_id,
    ])
    .then((result) => {
      if (result.rows.length === 0) {
        return res
          .status(404)
          .json({ error: "No orders found for this event" });
      }
      res.status(200).json(result.rows);
    })
    .catch((err) => {
      console.error("Error fetching orders by event ID", err.stack);
      res.status(500).json({ error: "Internal server error" });
    });
};

export const deleteOrder = (req, res) => {
  const orderId = req.params.id;
  client
    .query("DELETE FROM orders WHERE id = $1 RETURNING *", [orderId])
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
    .query("DELETE FROM orders WHERE event_id = $1 RETURNING *", [orderId])
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
    .query("SELECT * FROM orders WHERE phone = $1 AND event_id = $2", [phone, event_id])
    .then((result) => {
      res.status(200).json(result.rows);
    })
    .catch((err) => {
      console.error("Error fetching order by phone and event", err.stack);
      res.status(500).json({ error: "Internal server error" });
    });
}

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
        return res.status(404).json({ error: "No orders found for this phone and event" });
      }
      res.status(200).json(result.rows[0]);
    })
    .catch((err) => {
      console.error("Error updating order content by phone and event", err.stack);
      res.status(500).json({ error: "Internal server error" });
    });
}