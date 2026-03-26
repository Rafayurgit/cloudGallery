const { createClient } = require("redis");
const env = require("./env");
const logger = require("../utils/logger");

let redisClient;

const getRedisClient = async () => {
  if (!env.redisUrl) return null;
  if (redisClient) return redisClient;

  redisClient = createClient({ url: env.redisUrl });
  redisClient.on("error", (err) => logger.error("Redis error", err));
  await redisClient.connect();
  logger.info("Redis connected");
  return redisClient;
};

module.exports = { getRedisClient };
