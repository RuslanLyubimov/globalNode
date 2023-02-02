const express = require("express");
import { DB } from "./fakeDb";
import { findUser, createUser, getAutoSuggestUsers } from "./dbFunctions";

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.json({ users: DB });
});

app.get("/users", (req, res) => {
  const { loginSubstring = "", limit = users.length } = req.query;
  const list = getAutoSuggestUsers(loginSubstring, limit);
  if (list === undefined || list.length === 0) {
    res.status(404).json({ message: "No users(" });
  } else {
    res.json({ users: list });
  }
});

app.get("/users/:id", (req, res) => {
  const userId = findUser(req.params.id);
  if (userId === undefined) {
    res
      .status(404)
      .json({ message: `User with id ${req.params.id} not found!` });
  } else {
    res.json({ user: userId });
  }
});

app.post("/user", (req, res) => {
  createUser(req);
  res.json({ message: "User was created!" });
});

app.put("/user/:id", (req, res) => {
  const user = findUser(req.params.id);
  const { login, password, age } = req.body;

  if (user === undefined) {
    res.status(404).send("User not found");
  } else {
    user.login = login;
    user.password = password;
    user.age = age;
    res.json({ user });
  }
});

app.delete("/user/:id", (req, res) => {
  const userDelete = findUser(req.params.id);
  if (userDelete === undefined || userDelete.isDeleted) {
    res.status(404).send("User is not found(");
  } else {
    userDelete.isDeleted = true;
    res.json({ user: userDelete });
  }
});

app.listen(PORT, (err) => {
  if (err) console.log(err);
  console.log("Server is working!");
});
