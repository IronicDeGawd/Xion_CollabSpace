const express = require("express");
const router = express.Router();
const sql = require("./db");
const auth = require("./middleware/auth");

// @route   GET api/user-data
// @desc    Get user data
// @access  Private
router.get("/", auth, async (req, res) => {
  try {
    const result = await sql`
      SELECT u.id, u.name, u.email, u.address, u.skills, u.created_at,
             p.about, p.image_url
      FROM users u
      LEFT JOIN user_profiles p ON u.id = p.user_id
      WHERE u.id = ${req.user.id}
    `;

    if (result.length === 0) {
      return res.status(404).json({ msg: "User not found" });
    }

    const user = result[0];

    // Parse skills from JSON string if needed
    if (user.skills && typeof user.skills === "string") {
      try {
        user.skills = JSON.parse(user.skills);
      } catch (e) {
        // If parsing fails, try to split by comma
        user.skills = user.skills.split(",").map((s) => s.trim());
      }
    } else if (!user.skills) {
      user.skills = [];
    }

    res.json(user);
  } catch (err) {
    console.error(
      "User fetch error:",
      err instanceof Error ? err.message : String(err)
    );
    res.status(500).send("Server error");
  }
});

module.exports = router;
