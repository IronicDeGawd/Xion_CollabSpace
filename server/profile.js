const express = require("express");
const router = express.Router();
const sql = require("./db");
const auth = require("./middleware/auth");

// @route   GET api/profile
// @desc    Get current user's profile
// @access  Private
router.get("/", auth, async (req, res) => {
  try {
    // Get user data from users table
    const userResult = await sql`
      SELECT u.id, u.name, u.email, u.address, u.skills, u.created_at,
             p.about, p.image_url
      FROM users u
      LEFT JOIN user_profiles p ON u.id = p.user_id
      WHERE u.id = ${req.user.id}
    `;

    if (userResult.length === 0) {
      return res.status(404).json({ msg: "User not found" });
    }

    const user = userResult[0];

    // Parse skills if stored as JSON string
    if (user.skills && typeof user.skills === "string") {
      try {
        user.skills = JSON.parse(user.skills);
      } catch (e) {
        user.skills = user.skills.split(",").map((s) => s.trim());
      }
    } else if (!user.skills) {
      user.skills = [];
    }

    res.json(user);
  } catch (err) {
    console.error("Profile fetch error:", err.message);
    res.status(500).send("Server error");
  }
});

// @route   PUT api/profile
// @desc    Update user profile
// @access  Private
router.put("/", auth, async (req, res) => {
  const { about, imageUrl } = req.body;

  try {
    // Check if profile exists
    const profileCheck = await sql`
      SELECT * FROM user_profiles WHERE user_id = ${req.user.id}
    `;

    if (profileCheck.length === 0) {
      // Create new profile
      await sql`
        INSERT INTO user_profiles (user_id, about, image_url)
        VALUES (${req.user.id}, ${about}, ${imageUrl})
      `;
    } else {
      // Update existing profile
      await sql`
        UPDATE user_profiles
        SET about = ${about},
            image_url = ${imageUrl},
            updated_at = CURRENT_TIMESTAMP
        WHERE user_id = ${req.user.id}
      `;
    }

    // Return updated profile
    const updatedProfile = await sql`
      SELECT u.id, u.name, u.email, u.address, u.skills, u.created_at,
             p.about, p.image_url
      FROM users u
      LEFT JOIN user_profiles p ON u.id = p.user_id
      WHERE u.id = ${req.user.id}
    `;

    // Parse skills
    const user = updatedProfile[0];
    if (user.skills && typeof user.skills === "string") {
      try {
        user.skills = JSON.parse(user.skills);
      } catch (e) {
        user.skills = user.skills.split(",").map((s) => s.trim());
      }
    } else if (!user.skills) {
      user.skills = [];
    }

    res.json(user);
  } catch (err) {
    console.error("Profile update error:", err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
