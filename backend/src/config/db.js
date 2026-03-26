const mongoose = require("mongoose");
const env = require("./env");
const logger = require("../utils/logger");

const connectDb = async () => {
  if (!env.mongoUri) {
    throw new Error("MONGO_URI is required");
  }

  await mongoose.connect(env.mongoUri, {
    autoIndex: env.nodeEnv !== "production"
  });

  logger.info("MongoDB connected");
};

module.exports = connectDb;
