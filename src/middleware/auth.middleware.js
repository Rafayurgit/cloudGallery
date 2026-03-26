const jwt = require("jsonwebtoken");
const env = require("../config/env");
const User = require("../modules/user/user.model");

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || "";
    const [scheme, token] = authHeader.split(" ");
    if (scheme !== "Bearer" || !token) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const payload = jwt.verify(token, env.jwtAccessSecret);
    const user = await User.findById(payload.sub).select("-password");
    if (!user) return res.status(401).json({ success: false, message: "Invalid token" });

    if (payload.tenantId && user.tenantId !== payload.tenantId) {
      return res.status(401).json({ success: false, message: "Invalid token" });
    }

    req.user = user;
    req.tenantId = payload.tenantId;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }
};

module.exports = authMiddleware;
