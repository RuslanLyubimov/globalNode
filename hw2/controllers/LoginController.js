import { getUserByCredentials } from "./UserControllers";

const jwt = require("jsonwebtoken");

require("dotenv").config();

export const login = async (req, res, next) => {
  const { login, password } = req.body;
  try {
    const user = await getUserByCredentials(login, password);

    if (!user) {
      res.status(400).send("Incorrect login and/or password!");
    } else {
      jwt.sign({ login, password }, process.env.JWT_SECRETKEY, (err, token) => {
        if (err) {
          throw err;
        }

        res.status(200).send({ token });
      });
    }
  } catch (error) {
    return next(error);
  }
};
