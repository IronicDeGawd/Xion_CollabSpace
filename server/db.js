const postgres = require("postgres");
require("dotenv").config();

const connectionString = process.env.DATABASE_URL;

const sql = postgres(connectionString, {
  ssl: {
    rejectUnauthorized: false,
  },
  max: 1,
  idle_timeout: 0,
  max_lifetime: 60 * 30,
  connect_timeout: 10,
});

// Export the SQL client
module.exports = sql;

// Test the connection (but don't block exports)
(async function testConnection() {
  try {
    const result = await sql`SELECT 1 as connection_test`;
    console.log("Successfully connected to Supabase database");
  } catch (error) {
    console.error("Error connecting to Supabase database:", error.message);
  }
})();
