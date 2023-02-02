const { v4: uuidv4 } = require("uuid");
import { DB } from "./fakeDb";

export const findUser = (reqId) => {
  return DB.find(({ id }) => id === reqId);
};

export const createUser = (req) => {
  req.body["id"] = uuidv4();
  req.body["isDeleted"] = false;
  DB.push(req.body);
};

export const getAutoSuggestUsers = (loginSubstring, limit) => {
  return DB.filter(
    (user) => !user.isDeleted && user.login.includes(loginSubstring)
  )
    .sort((a, b) => a.login.localeCompare(b.login))
    .slice(0, limit);
};
