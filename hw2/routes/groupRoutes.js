const express = require("express");
const validator = require("express-joi-validation").createValidator({});

import {
  getGroupByID,
  getAllGroups,
  postGroup,
  putGroup,
  deleteGroup,
  postUserGroup,
} from "../controllers/GroupControllers";

import { logErrors } from "../Middlewares/Loggers/logServiceMethods";
import { groupSchema } from "../Middlewares/validators/validation";

const router = express.Router();

router
  .route("/")
  .get(logErrors(getAllGroups))
  .post(validator.body(groupSchema), logErrors(postGroup));

router
  .route("/:id")
  .get(logErrors(getGroupByID))
  .put(validator.body(groupSchema), logErrors(putGroup))
  .delete(logErrors(deleteGroup));

router.route("/:id/addUsers").post(logErrors(postUserGroup));

module.exports = router;
