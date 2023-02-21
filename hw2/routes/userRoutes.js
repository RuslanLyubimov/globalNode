const express = require("express");
const validator = require("express-joi-validation").createValidator({});
import {
  userSchema,
  queryParamSchema,
} from "../Middlewares/validators/validation";

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
  .get(validator.query(queryParamSchema), getUsersBySubstring)
  .post(validator.body(userSchema), postUser);

router
  .route("/:id")
  .get(getUsersByID)
  .put(validator.body(userSchema), putUser)
  .delete(deleteUser);

module.exports = router;
