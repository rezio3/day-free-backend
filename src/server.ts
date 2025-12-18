import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectToDatabase } from "./config/database";
import elementsRouter from "./routes/elements";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware CORS - POPRAWIONA KONFIGURACJA
app.use(
  cors({
    origin: "http://localhost:5173", // adres Twojego frontendu
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
