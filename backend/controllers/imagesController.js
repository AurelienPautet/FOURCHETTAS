import client from "../config/db.js";
import nodeFetch from "node-fetch";

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

export async function saveImageToDb(data) {
  // If the data is already a server image URL, extract and return the ID
  if (
    data.startsWith("https://fourchettas.vercel.app/api/images/") ||
    (data.startsWith("http://localhost:") && data.includes("/api/images/"))
  ) {
    const match = data.match(/\/api\/images\/(\d+)/);
    if (match) {
      return { rows: [{ id: match[1] }] };
    }
  }

  let imageBuffer;
  try {
    console.log("Saving image to DB");
    if (!data.startsWith("data:")) {
      console.log(`Image data received: ${data?.substring(0, 50)}...`);
      data = await convertToBase64(data);
    }
    const base64Data = data.replace(/^data:image\/\w+;base64,/, "");
    imageBuffer = Buffer.from(base64Data, "base64");
  } catch (err) {
    console.error("Error processing image data:", err);
    throw new Error(`Invalid image data format: ${err.message}`);
  }
  return client
    .query("INSERT INTO images (data,mime_type) VALUES ($1,$2) RETURNING id", [
      imageBuffer,
      "image/jpeg",
    ])
    .then((result) => result)
    .catch((err) => {
      console.error("Error inserting image into database:", err);
      throw err;
    });
}

function convertToBase64(img_url) {
  console.log(`Converting image to base64: ${img_url?.substring(0, 50)}...`);
  // first check if the img_url is a data URL or a regular URL
  if (img_url.startsWith("data:")) {
    console.log("Image is already a data URL");
    return img_url;
  }
  return nodeFetch(img_url)
    .then((response) => {
      console.log(`Fetch response status: ${response.status}`);
      if (!response.ok) {
        throw new Error(
          `Failed to fetch image: ${response.status} ${response.statusText}`
        );
      }
      return response.arrayBuffer();
    })
    .then((buffer) => {
      console.log(
        `Converting buffer of size ${buffer.byteLength} bytes to base64`
      );
      const base64Flag = "data:image/jpeg;base64,";
      const imageStr = arrayBufferToBase64(buffer);
      return base64Flag + imageStr;
    })
    .catch((error) => {
      console.error("Error converting image to base64:", error);
      throw error;
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
