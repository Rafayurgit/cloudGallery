const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const env = require("../../config/env");
const { encryptText, decryptText } = require("../../utils/encrypt");
const googleProvider = require("./providers/google.provider");

const providerConnectionSchema = new mongoose.Schema(
  {
    tenantId: { type: String, required: true, index: true, trim: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    provider: { type: String, required: true, enum: ["google"] },
    providerUserId: { type: String },
    accessToken: { type: String, required: true },
    refreshToken: { type: String },
    expiryDate: { type: Date }
  },
  { timestamps: true }
);

providerConnectionSchema.index({ tenantId: 1, userId: 1, provider: 1 }, { unique: true });

const ProviderConnection = mongoose.model("ProviderConnection", providerConnectionSchema);

const providerRegistry = {
  google: googleProvider
};

const getProviderAdapter = (provider) => {
  const adapter = providerRegistry[provider];
  if (!adapter) {
    const err = new Error("Provider is not supported");
    err.statusCode = 400;
    throw err;
  }
  return adapter;
};

const getOAuthUrl = (provider, userId, tenantId) => {
  const adapter = getProviderAdapter(provider);
  const state = jwt.sign({ sub: userId, tenantId, provider }, env.jwtAccessSecret, { expiresIn: "10m" });
  return adapter.getAuthUrl(state);
};

const connectProviderWithCode = async (provider, userId, tenantId, code) => {
  const adapter = getProviderAdapter(provider);
  const tokens = await adapter.exchangeCodeForTokens(code);
  if (!tokens.access_token) {
    const err = new Error("Provider did not return access token");
    err.statusCode = 502;
    throw err;
  }

  const payload = {
    userId,
    tenantId,
    provider,
    accessToken: encryptText(tokens.access_token),
    refreshToken: tokens.refresh_token ? encryptText(tokens.refresh_token) : undefined,
    expiryDate: tokens.expiry_date ? new Date(tokens.expiry_date) : undefined
  };

  return ProviderConnection.findOneAndUpdate(
    { userId, tenantId, provider },
    payload,
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
};

const getDecryptedConnection = async (userId, provider, tenantId) => {
  const connection = await ProviderConnection.findOne({ userId, provider, tenantId });
  if (!connection) {
    const err = new Error(`No ${provider} connection found`);
    err.statusCode = 404;
    throw err;
  }

  return {
    provider: connection.provider,
    accessToken: decryptText(connection.accessToken),
    refreshToken: connection.refreshToken ? decryptText(connection.refreshToken) : undefined,
    expiryDate: connection.expiryDate
  };
};

module.exports = {
  getProviderAdapter,
  getOAuthUrl,
  connectProviderWithCode,
  getDecryptedConnection
};
