export const getImage = (req, res) => {
  const imageId = req.params.id;
  client
    .query("SELECT * FROM images WHERE id = $1", [imageId])
    .then((result) => {
      if (result.rows.length === 0) {
        return res.status(404).json({ error: "Image not found" });
      }
      res.status(200).json(result.rows[0].data);
    })
    .catch((err) => {
      console.error("Error fetching image", err.stack);
      res.status(500).json({ error: "Internal server error" });
    });
};

export const saveImage = (req, res) => {
  const { data } = req.body;
  if (!data) {
    return res.status(400).json({ error: "Missing image data" });
  }
  client
    .query("INSERT INTO images (data) VALUES ($1) RETURNING *", [data])
    .then((result) => {
      res.status(201).json(result.rows[0]);
    })
    .catch((err) => {
      console.error("Error saving image", err.stack);
      res.status(500).json({ error: "Internal server error" });
    });
};
