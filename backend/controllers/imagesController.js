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

export function saveImageToDb(data) {
  let imageBuffer;
  try {
    if (!data.startsWith("https://fourchettas.vercel.app/api/images"))
      data = convertToBase64(data);
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

function convertToBase64(img_url) {
  console.log(`Converting image to base64: ${img_url?.substring(0, 50)}...`);
  // first check if the img_url is a data URL or a regular URL
  if (img_url.startsWith("data:")) {
    console.log("Image is already a data URL");
    return img_url;
  }
  return fetch(img_url)
    .then((response) => {
      console.log(`Fetch response status: ${response.status}`);
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
