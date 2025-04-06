const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Simplified CORS setup for Render deployment
app.use(
  cors({
    origin: ["https://xion-collabspace.vercel.app", "http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "x-auth-token"],
    credentials: true,
  })
);

app.use(express.json());

// Routes
app.use("/api/auth", require("./auth"));
app.use("/api/user-data", require("./user_data"));
app.use("/api/profile", require("./profile"));

// DB initialization
const sql = require("./db");
const initDb = async () => {
  try {
    // Create users table if not exists
    await sql`
      CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          name VARCHAR(100) NOT NULL,
          email VARCHAR(100) UNIQUE NOT NULL,
          address VARCHAR(255) UNIQUE NOT NULL,
          skills TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Create user_profiles table if not exists
    await sql`
      CREATE TABLE IF NOT EXISTS user_profiles (
          user_id INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
          about TEXT,
          image_url TEXT,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    console.log("Database initialized");
  } catch (err) {
    console.error(
      "Database initialization error:",
      err instanceof Error ? err.message : "Unknown error"
    );
  }
};

// Initialize database on startup
initDb();

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
