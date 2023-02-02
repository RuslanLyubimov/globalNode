const { v4: uuidv4 } = require("uuid");
import { Users } from "../model/UserData";

const findUser = (reqId) => {
  return Users.find(({ id }) => id === reqId);
};

const createUser = (req) => {
  req.body["id"] = uuidv4();
  req.body["isDeleted"] = false;
  Users.push(req.body);
};

const getAutoSuggestUsers = (loginSubstring, limit) => {
  return Users.filter(
    (user) => !user.isDeleted && user.login.includes(loginSubstring)
  )
    .sort((a, b) => a.login.localeCompare(b.login))
    .slice(0, limit);
};

export const getUsersBySubstring = (req, res) => {
  const { loginSubstring = "", limit = users.length } = req.query;
  const list = getAutoSuggestUsers(loginSubstring, limit);
  if (list === undefined || list.length === 0) {
    res.status(404).json({ message: "No users(" });
  } else {
    res.json({ users: list });
  }
};

export const getUsersByID = (req, res) => {
  const user = findUser(req.params.id);
  if (user === undefined) {
    res
      .status(404)
      .json({ message: `User with id ${req.params.id} not found!` });
  } else {
    res.json({ user });
  }
};

export const postUser = (req, res) => {
  createUser(req);
  res.json({ message: "User was created!" });
};

export const putUser = (req, res) => {
  const user = findUser(req.params.id);
  const { login, password, age } = req.body;

  if (user === undefined || user.isDeleted) {
    res.status(404).send("User not found");
  } else {
    user.login = login;
    user.password = password;
    user.age = age;
    res.json({ user });
  }
};

export const deleteUser = (req, res) => {
  const userDelete = findUser(req.params.id);
  if (userDelete === undefined || userDelete.isDeleted) {
    res.status(404).send("User is not found(");
  } else {
    userDelete.isDeleted = true;
    res.json({ user: userDelete });
  }
};
