const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model");

const requireAuth = async (req, res, next) => {
  try {
    const token =
      req.cookies.authToken ||
      (req.headers.authorization?.startsWith("Bearer ")
        ? req.headers.authorization.split(" ")[1]
        : null);

    if (!token) {
      return res.status(401).json({
        message: "Unauthorized - No Token Provided",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await userModel.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({
        message: "Unauthorized - User Not Found",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token." });
  }
};

module.exports = requireAuth;
