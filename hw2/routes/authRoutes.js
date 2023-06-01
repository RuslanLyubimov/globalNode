const express = require("express");
const validator = require("express-joi-validation").createValidator({});

import { logErrors } from "../Middlewares/Loggers/logServiceMethods";
import { loginSchema } from "../Middlewares/validators/validation";
import { login } from "../controllers/LoginController";

const router = express.Router();

router.route("/login").post(validator.body(loginSchema), logErrors(login));

module.exports = router;
