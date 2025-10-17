import client from "../config/db.js";

export const getImage = (req, res) => {
  const imageId = req.params.id;
  client
    .query("SELECT data, mime_type FROM images WHERE id = $1", [imageId])
    .then((result) => {
      if (result.rows.length === 0) {
        return res.status(404).json({ error: "Image not found" });
      }
      const imageBuffer = result.rows[0].data;
      const mimeType = result.rows[0].mime_type;
      res.writeHead(200, {
        "Content-Type": mimeType,
        "Cross-Origin-Resource-Policy": "cross-origin",
      });
      res.end(imageBuffer);
    })
    .catch((err) => {
      console.error("Error fetching image", err.stack);
      res.status(500).json({ error: "Internal server error" });
    });
};

export function saveImageToDb(data) {
  let imageBuffer;
  try {
    const base64Data = data.replace(/^data:image\/\w+;base64,/, "");
    imageBuffer = Buffer.from(base64Data, "base64");
  } catch (err) {
    throw new Error("Invalid image data format");
  }
  return client
    .query("INSERT INTO images (data,mime_type) VALUES ($1,$2) RETURNING id", [
      imageBuffer,
      "image/jpeg",
    ])
    .then((result) => result);
}

export const saveImage = (req, res) => {
  const { data } = req.body;
  if (!data) {
    return res.status(400).json({ error: "Missing image data" });
  }

  saveImageToDb(data)
    .then((result) => {
      res
        .status(201)
        .json({ message: "Image saved successfully", id: result.id });
    })
    .catch((err) => {
      console.error("Error saving image", err.stack);
      res.status(500).json({ error: "Internal server error" });
    });
};
