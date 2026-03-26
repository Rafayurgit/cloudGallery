const jwt = require("jsonwebtoken");
const env = require("../../config/env");
const { sendSuccess } = require("../../utils/apiResponse");
const providerService = require("./provider.service");

const getGoogleAuthUrl = async (req, res, next) => {
  try {
    const url = providerService.getOAuthUrl(
      "google",
      String(req.user._id),
      String(req.tenantId)
    );
    return sendSuccess(res, { url }, "OAuth URL generated");
  } catch (error) {
    next(error);
  }
};

const handleGoogleCallback = async (req, res, next) => {
  try {
    const { code, state } = req.query;
    if (!code || !state) {
      const err = new Error("Missing OAuth code/state");
      err.statusCode = 400;
      throw err;
    }

    const decoded = jwt.verify(String(state), env.jwtAccessSecret);
    if (decoded.provider !== "google") {
      const err = new Error("Invalid OAuth state");
      err.statusCode = 400;
      throw err;
    }
    if (!decoded.tenantId) {
      const err = new Error("Invalid OAuth state (missing tenantId)");
      err.statusCode = 400;
      throw err;
    }
    await providerService.connectProviderWithCode(
      "google",
      decoded.sub,
      String(decoded.tenantId),
      String(code)
    );
    return sendSuccess(res, {}, "Google provider connected");
  } catch (error) {
    next(error);
  }
};

module.exports = { getGoogleAuthUrl, handleGoogleCallback };
