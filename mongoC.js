// mongoC.js
import { MongoClient } from "mongodb";

const username = encodeURIComponent((process.env.MONGO_USERNAME || "").trim());
const password = encodeURIComponent((process.env.MONGO_PASSWORD || "").trim());
const host = (process.env.MONGO_HOST || "").trim(); // e.g. 13.232.110.55

if (!username || !password || !host) {
  console.error("MONGO_USERNAME, MONGO_PASSWORD and MONGO_HOST must be set in env");
  process.exit(1);
}

const connectionString = `mongodb://${username}:${password}@${host}:27017/?authSource=admin`;

const client = new MongoClient(connectionString, {
  serverSelectionTimeoutMS: 5000,
});

let db;

export async function connectToMongo() {
  try {
    await client.connect();
    console.log("✅ MongoDB connected successfully!");
    db = client.db("integration_ninjas");
    return db;
  } catch (e) {
    console.error("❌ MongoDB connection failed:", e);
    throw e;
  }
}

export function getDb() {
  if (!db) throw new Error("Database not initialized. Call connectToMongo() first.");
  return db;
}

export default { connectToMongo, getDb };
