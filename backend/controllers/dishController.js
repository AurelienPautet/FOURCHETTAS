import client from "../config/db.js";

export const createDish = async (req, res) => {
  const body = req.body;
  if (!body.dishes) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const insertedDishes = [];

    for (const dish of body.dishes) {
      const result = await client.query(
        "INSERT INTO dishes (name, description, price, event_id) VALUES ($1, $2, $3, $4) RETURNING *",
        [dish.name, dish.description, Number(dish.price), body.event_id]
      );
      insertedDishes.push(result.rows[0]);
    }

    res.status(201).json(insertedDishes);
  } catch (err) {
    console.error("Error creating dish", err.stack);
    res.status(500).json({ error: "Internal server error" });
  }
};
