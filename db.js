const { MongoClient } = require("mongodb");
require("dotenv").config();

const uri = process.env.MONGODB_URI;
let client;

async function connectDB() {
  try {
    client = new MongoClient(uri);
    await client.connect();
    console.log("Connected to MongoDB");
    return client.db();
  } catch (err) {
    console.error("Connection error:", err);
    process.exit(1);
  }
}

function getDB() {
  if (!client) throw Error("Database not connected");
  return client.db();
}

async function closeDB() {
  if (client) {
    await client.close();
    console.log("Database connection closed");
  }
}

module.exports = { connectDB, getDB, closeDB };
