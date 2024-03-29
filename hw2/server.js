import { runDb } from "./Middlewares/db-config/connector";
import cors from "cors";
import {
  logServiceMethod,
  logger,
} from "./Middlewares/Loggers/logServiceMethods";
import { jwtMiddleware } from "./Middlewares/jwtMiddleware";
const express = require("express");
const userRoutes = require("./routes/userRoutes");
const groupRoutes = require("./routes/groupRoutes");
const loginRoutes = require("./routes/authRoutes");
const app = express();
app.use(cors());
app.use(express.json());
app.use(logServiceMethod);
app.use(jwtMiddleware);

app.use((err, req, res, next) => {
  logger.error(`Unhandled error: ${err.message}`, err);
  res.status(500).send({ error: "Internal Server Error" });
});

const PORT = process.env.PORT || 3000;

app.use("/", loginRoutes);
app.use("/users", userRoutes);
app.use("/groups", groupRoutes);

async function startServer() {
  await runDb();
  app.listen(PORT, (err) => {
    if (err) {
      logger.error(`Failed to start server on port ${PORT}`, err);
      process.exit(1);
    }
    logger.info(`Server is listening on port ${PORT}`);
  });
}

startServer();

process.on("uncaughtException", (err) => {
  logger.error(`Unhandled exception: ${err.message}`, err);
  process.exit(1);
});

process.on("unhandledRejection", (err) => {
  logger.error(`Unhandled rejection: ${err.message}`, err);
  process.exit(1);
});
