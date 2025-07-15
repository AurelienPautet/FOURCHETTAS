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

  client
    .query(
      "update orders set prepared = $1, delivered = $2 where id = $3 returning *",
      [prepared, delivered, orderId]
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
