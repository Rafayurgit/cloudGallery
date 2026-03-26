const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const authRoutes = require("./modules/auth/auth.routes");
const providerRoutes = require("./modules/provider/provider.routes");
const fileRoutes = require("./modules/file/file.routes");
const billingRoutes = require("./modules/billing/billing.routes");
const errorMiddleware = require("./middleware/error.middleware");

const app = express();

app.use(helmet());
app.use(cors({ origin: true, credentials: true }));
app.use(morgan("dev"));
app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());

app.get("/health", (req, res) => {
  return res.status(200).json({ success: true, message: "CloudGallery API healthy" });
});

app.use("/api/auth", authRoutes);
app.use("/api/providers", providerRoutes);
app.use("/api/files", fileRoutes);
app.use("/api/billing", billingRoutes);

app.use((req, res) => {
  return res.status(404).json({ success: false, message: "Route not found" });
});

app.use(errorMiddleware);

module.exports = app;
