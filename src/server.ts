import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectToDatabase } from "./config/database";
import elementsRouter from "./routes/elements";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// CORS - wspiera zarówno localhost jak i produkcję
const allowedOrigins = [
  "http://localhost:5173",
  "https://day-free.onrender.com",
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Pozwól na requesty bez origin (np. Postman, curl)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

// Routes
app.use("/api", elementsRouter);

// Test route
app.get("/", (req, res) => {
  res.json({ message: "Backend działa!" });
});

// Start serwera
const startServer = async () => {
  try {
    await connectToDatabase();

    app.listen(PORT, () => {
      console.log(`🚀 Serwer działa na http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Nie udało się uruchomić serwera:", error);
    process.exit(1);
  }
};

startServer();
