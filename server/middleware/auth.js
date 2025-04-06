const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  // Get token from header
  const token = req.header("x-auth-token");

  // Check if no token
  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Add user from payload to request
    req.user = decoded.user;

    // Debug - log the user details for troubleshooting
    console.log("Authenticated user:", req.user);

    next();
  } catch (err) {
    console.error("Token validation error:", err.message);
    res.status(401).json({ msg: "Token is not valid" });
  }
};
