const express = require("express");
const validator = require("express-joi-validation").createValidator({});
import {
  userSchema,
  queryParamSchema,
} from "../Middlewares/validators/validation";

import { logErrors } from "../Middlewares/Loggers/logServiceMethods";

import {
  getUsersBySubstring,
  getUsersByID,
  postUser,
  putUser,
  deleteUser,
} from "../controllers/UserControllers";

const router = express.Router();

router
  .route("/")
  .post(validator.body(userSchema), logErrors(postUser))
  .get(validator.query(queryParamSchema), logErrors(getUsersBySubstring));

router
  .route("/:id")
  .get(logErrors(getUsersByID))
  .put(validator.body(userSchema), logErrors(putUser))
  .delete(logErrors(deleteUser));
module.exports = router;
