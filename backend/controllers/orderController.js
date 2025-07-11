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
