import jwt from "jsonwebtoken";
require("dotenv").config();

export function jwtMiddleware(req, res, next) {
  if (req.path === "/login") {
    return next();
  }

  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    res.status(401).send("Unauthorized");
  } else {
    jwt.verify(token, process.env.JWT_SECRETKEY, (err) => {
      if (err) {
        res.status(403).send(err.message);
      }

      next();
    });
  }
}
