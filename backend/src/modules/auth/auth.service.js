const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const env = require("../../config/env");
const AuthSession = require("./auth.model");
const { createUser, getUserByEmail } = require("../user/user.service");
const User = require("../user/user.model");

const getRefreshTokenHash = (token) => {
  return crypto.createHash("sha256").update(token).digest("hex");
};

const signAccessToken = (user) => {
  return jwt.sign(
    { sub: user._id, tenantId: user.tenantId, role: user.role, plan: user.plan },
    env.jwtAccessSecret,
    {
    expiresIn: env.jwtAccessExpiresIn
    }
  );
};

const signRefreshToken = (user) => {
  return jwt.sign(
    { sub: user._id, tenantId: user.tenantId, type: "refresh" },
    env.jwtRefreshSecret,
    { expiresIn: env.jwtRefreshExpiresIn }
  );
};

const register = async (payload) => {
  const existing = await getUserByEmail({ tenantId: payload.tenantId, email: payload.email });
  if (existing) {
    const err = new Error("Email already in use");
    err.statusCode = 409;
    throw err;
  }

  const hashedPassword = await bcrypt.hash(payload.password, 12);
  const user = await createUser({
    name: payload.name,
    tenantId: payload.tenantId,
    email: payload.email,
    password: hashedPassword
  });

  return {
    user: { id: user._id, name: user.name, email: user.email, role: user.role, plan: user.plan }
  };
};

const login = async ({ tenantId, email, password, userAgent, ipAddress }) => {
  const user = await getUserByEmail({ tenantId, email });
  if (!user) {
    const err = new Error("Invalid credentials");
    err.statusCode = 401;
    throw err;
  }

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    const err = new Error("Invalid credentials");
    err.statusCode = 401;
    throw err;
  }

  const accessToken = signAccessToken(user);
  const refreshToken = signRefreshToken(user);

  const decoded = jwt.decode(refreshToken);
  await AuthSession.create({
    userId: user._id,
    tenantId: user.tenantId,
    refreshTokenHash: getRefreshTokenHash(refreshToken),
    userAgent,
    ipAddress,
    expiresAt: new Date(decoded.exp * 1000)
  });

  return {
    user: { id: user._id, name: user.name, email: user.email, role: user.role, plan: user.plan },
    accessToken,
    refreshToken
  };
};

const refreshAccessToken = async (refreshToken) => {
  let payload;
  try {
    payload = jwt.verify(refreshToken, env.jwtRefreshSecret);
  } catch {
    const err = new Error("Invalid refresh token");
    err.statusCode = 401;
    throw err;
  }

  const session = await AuthSession.findOne({
    userId: payload.sub,
    tenantId: payload.tenantId,
    refreshTokenHash: getRefreshTokenHash(refreshToken)
  });

  if (!session) {
    const err = new Error("Refresh session not found");
    err.statusCode = 401;
    throw err;
  }

  const user = await User.findOne({ _id: payload.sub, tenantId: payload.tenantId });
  if (!user) {
    const err = new Error("User not found");
    err.statusCode = 404;
    throw err;
  }

  return { accessToken: signAccessToken(user) };
};

module.exports = { register, login, refreshAccessToken };
