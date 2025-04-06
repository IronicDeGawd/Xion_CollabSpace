const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const sql = require("./db");
const auth = require("./middleware/auth");

// @route   POST api/auth/register
router.post("/register", async (req, res) => {
  const { name, email, address, skills } = req.body;

  if (!name || !email || !address) {
    return res.status(400).json({ msg: "Please provide all required fields" });
  }

  try {
    // Check if user already exists by email or address
    const userCheck = await sql`
      SELECT * FROM users WHERE email = ${email} OR address = ${address}
    `;

    if (userCheck.length > 0) {
      return res.status(400).json({ msg: "User already exists" });
    }

    // Optional: If skills is an array, convert to JSON or string
    const skillStr = Array.isArray(skills) ? JSON.stringify(skills) : skills;

    // Create user
    const newUser = await sql`
      INSERT INTO users (name, email, address, skills)
      VALUES (${name}, ${email}, ${address}, ${skillStr})
      RETURNING *
    `;

    const user = newUser[0];

    const payload = {
      user: {
        id: user.id,
        address: user.address,
      },
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({ token });
  } catch (err) {
    console.error("Register Error:", err.message);
    res.status(500).send("Server error");
  }
});

// @route   POST api/auth/login
router.post("/login", async (req, res) => {
  const { address } = req.body;

  if (!address) {
    return res.status(400).json({ msg: "Please provide a wallet address" });
  }

  try {
    // Normalize address for comparison (remove case sensitivity)
    const normalizedAddress = address.toLowerCase();

    // Log the address we're looking for to help debug
    console.log("Looking for address:", normalizedAddress);

    const result = await sql`
        SELECT * FROM users WHERE LOWER(address) = ${normalizedAddress}
      `;

    // Log how many results we found
    console.log(`Found ${result.length} users with this address`);

    if (result.length === 0) {
      return res.status(400).json({ msg: "Invalid Address / Not Registered" });
    }

    const user = result[0];

    const payload = {
      user: {
        id: user.id,
        address: user.address,
      },
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1d", // Increase token expiration to 1 day
    });

    res.json({ token });
  } catch (err) {
    console.error("Login Error:", err.message);
    res.status(500).send("Server error");
  }
});

// @route   GET api/auth
router.get("/", auth, async (req, res) => {
  try {
    const result = await sql`
      SELECT id, name, email, address, skills
      FROM users
      WHERE id = ${req.user.id}
    `;

    if (result.length === 0) {
      return res.status(404).json({ msg: "User not found" });
    }

    // Parse skills if they're stored as JSON string
    const user = result[0];
    if (user.skills && typeof user.skills === "string") {
      try {
        user.skills = JSON.parse(user.skills);
      } catch (e) {
        // If parsing fails, try to split by comma
        user.skills = user.skills.split(",").map((s) => s.trim());
      }
    }

    res.json(user);
  } catch (err) {
    console.error("Fetch user error:", err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
