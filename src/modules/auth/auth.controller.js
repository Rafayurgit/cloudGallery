const { sendSuccess } = require("../../utils/apiResponse");
const { registerSchema, loginSchema, refreshSchema } = require("./auth.validation");
const authService = require("./auth.service");

const register = async (req, res, next) => {
  try {
    const payload = registerSchema.parse(req.body);
    const result = await authService.register(payload);
    return sendSuccess(res, result, "User registered", 201);
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const payload = loginSchema.parse(req.body);
    const result = await authService.login({
      ...payload,
      userAgent: req.headers["user-agent"],
      ipAddress: req.ip
    });
    res.cookie("refreshToken", result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 30 * 24 * 60 * 60 * 1000
    });
    return sendSuccess(
      res,
      { user: result.user, accessToken: result.accessToken },
      "Login successful"
    );
  } catch (error) {
    next(error);
  }
};

const refresh = async (req, res, next) => {
  try {
    const payload = refreshSchema.parse(req.body);
    const refreshToken = payload.refreshToken || req.cookies?.refreshToken;
    if (!refreshToken) {
      const err = new Error("Refresh token is required");
      err.statusCode = 400;
      throw err;
    }
    const result = await authService.refreshAccessToken(refreshToken);
    return sendSuccess(res, result, "Access token refreshed");
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login, refresh };
