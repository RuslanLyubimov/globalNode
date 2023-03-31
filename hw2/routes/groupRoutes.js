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

import { groupSchema } from "../Middlewares/validators/validation";

const router = express.Router();

router
  .route("/")
  .get(getAllGroups)
  .post(validator.body(groupSchema), postGroup);

router
  .route("/:id")
  .get(getGroupByID)
  .put(validator.body(groupSchema), putGroup)
  .delete(deleteGroup);

router.route("/:id/addUsers").post(postUserGroup);

module.exports = router;
