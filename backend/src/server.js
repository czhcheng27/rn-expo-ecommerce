import express from "express";
import cors from "cors";
import { clerkMiddleware } from "@clerk/express";
import { ENV } from "./config/env.js";
import { connectDB } from "./config/db.js";

const app = express();

const defaultOrigins = [
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "http://localhost:3001",
  "http://127.0.0.1:3001",
];
const envOrigins = [ENV.CLIENT_URL, ENV.CORS_ORIGINS]
  .filter(Boolean)
  .flatMap((value) => value.split(","))
  .map((origin) => origin.trim())
  .filter(Boolean);
const allowedOrigins = [...new Set([...defaultOrigins, ...envOrigins])];

app.use(express.json());
app.use(clerkMiddleware())

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      console.warn(`CORS blocked: ${origin}`);
      callback(null, false);
    },
    credentials: true,
  }),
);

app.get("/api/health", (_req, res) => {
  res.status(200).json({ message: "Success" });
});

const PORT = Number(ENV.PORT) || 3001;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is up and running on port ${PORT}`);
  connectDB();
});
