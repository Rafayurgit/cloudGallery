const http = require("http");
const app = require("./app");
const env = require("./config/env");
const connectDb = require("./config/db");
const logger = require("./utils/logger");

const startServer = async () => {
  try {
    await connectDb();
    const server = http.createServer(app);
    server.listen(env.port, () => {
      logger.info(`CloudGallery server running on port ${env.port}`);
    });
  } catch (error) {
    logger.error("Failed to start server", error);
    process.exit(1);
  }
};

startServer();
