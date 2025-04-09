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
    // Get user WITH profile data
    const user = await sql`
      SELECT u.id, u.name, u.email, u.address, u.skills, u.created_at,
             p.about as bio, p.image_url, p.github_url, p.telegram_id, p.discord_id
      FROM users u
      LEFT JOIN user_profiles p ON u.id = p.user_id
      WHERE u.id = ${req.user.id}
    `;

    if (user.length === 0) {
      return res.status(404).json({ msg: "User not found" });
    }

    // Ensure fields aren't missing
    const userData = user[0];
    userData.bio = userData.bio || null;
    userData.image_url = userData.image_url || null;
    userData.github_url = userData.github_url || null;
    userData.telegram_id = userData.telegram_id || null;
    userData.discord_id = userData.discord_id || null;

    // Parse skills
    if (userData.skills && typeof userData.skills === "string") {
      try {
        userData.skills = JSON.parse(userData.skills);
      } catch (e) {
        userData.skills = userData.skills.split(",").map((s) => s.trim());
      }
    } else if (!userData.skills) {
      userData.skills = [];
    }

    res.json(userData);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
