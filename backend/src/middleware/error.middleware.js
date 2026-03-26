const { sendError } = require("../utils/apiResponse");
const logger = require("../utils/logger");
const { ZodError } = require("zod");

const errorMiddleware = (err, req, res, next) => {
  if (err instanceof ZodError) {
    return sendError(res, "Validation failed", 400, err.flatten());
  }
  logger.error("Unhandled error", err);
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal server error";
  return sendError(res, message, statusCode);
};

module.exports = errorMiddleware;
