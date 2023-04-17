const winston = require("winston");

export const logServiceMethod = (req, res, next) => {
  console.log(`Service method invoked: ${req.method}`);
  console.log(`Arguments passed: ${JSON.stringify(req.body)}`);
  next();
};

export const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: "logs/error.log", level: "error" }),
    new winston.transports.File({ filename: "logs/combined.log" }),
  ],
});

export const logErrors = (controllerMethod) => {
  return async (req, res, next) => {
    try {
      await controllerMethod(req, res, next);
    } catch (error) {
      logger.error({
        method: controllerMethod.name,
        arguments: req.body,
        error: error.message,
      });
      next(error);
    }
  };
};
