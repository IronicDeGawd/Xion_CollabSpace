const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", require("./auth"));
app.use("/api/user-data", require("./user_data"));

// DB
const sql = require("./db");

// Initialize DB
const initDb = async () => {
  try {
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
    console.log("Database initialized");
  } catch (err) {
    console.error(
      "Database initialization error:",
      err instanceof Error ? err.message : "Unknown error"
    );
  }
};

// initDb();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
