import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";
import eventRoutes from "./routes/eventRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import imageGenRoutes from "./routes/imageGenRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import itemRoutes from "./routes/itemRoutes.js";
import imageRoutes from "./routes/imagesRoutes.js";
import migrationRoutes from "./routes/migrationRoutes.js";

dotenv.config();
const PORT = process.env.PORT;

const app = express();

app.use((req, res, next) => {
  next();
});

app.use(helmet());
app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ extended: true }));

const corsOptions = {
  origin: [
    "https://fourchettas.vercel.app/",
    "https://fourchettas-client.vercel.app",
    "http://localhost:5173",
    "http://localhost:3000",
  ],
};

app.use(cors(corsOptions));
app.use(morgan("dev"));

app.use("/api/events", eventRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/image-gen", imageGenRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/items", itemRoutes);
app.use("/api/images", imageRoutes);
app.use("/api/migration", migrationRoutes);

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "Server is running smoothly!" });
});

if (process.env.NODE_ENV !== "production") {
  var serverUrl = `http://localhost:${PORT}`;
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
} else {
  serverUrl = "https://fourchettas.vercel.app";
}

export { serverUrl };

export default app;
