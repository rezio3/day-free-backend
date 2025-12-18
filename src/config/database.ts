import { MongoClient, Db } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

let db: Db;

export const connectToDatabase = async (): Promise<Db> => {
  try {
    const client = new MongoClient(process.env.MONGODB_URI!);
    await client.connect();
    console.log("✅ Połączono z MongoDB");

    db = client.db("day-free-database");
    return db;
  } catch (error) {
    console.error("❌ Błąd połączenia z MongoDB:", error);
    process.exit(1);
  }
};

export const getDatabase = (): Db => {
  if (!db) {
    throw new Error("Database not initialized");
  }
  return db;
};
