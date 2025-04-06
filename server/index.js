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
app.use("/api/projects", require("./project_details"));

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
    await sql`
    CREATE TABLE IF NOT EXISTS project_details (
    id SERIAL PRIMARY KEY,
    project_id VARCHAR(255) UNIQUE NOT NULL,
    owner_address VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    skills_required TEXT[] NOT NULL,
    status VARCHAR(50) DEFAULT 'Open' NOT NULL,
    repository_url TEXT,
    website_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);`;
    await sql`
CREATE TABLE IF NOT EXISTS project_collaborators (
    id SERIAL PRIMARY KEY,
    project_id VARCHAR(255) NOT NULL,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    address VARCHAR(255) NOT NULL,
    role VARCHAR(100),
    status VARCHAR(50) DEFAULT 'Pending' NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(project_id, user_id)
);`;

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
