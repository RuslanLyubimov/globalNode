import { User } from "../model/UserData";
import { Op } from "sequelize";

const findUser = (reqId) => {
  return User.findByPk(reqId);
};

const getAutoSuggestUsers = (loginSubstring, limit) => {
  return User.findAll({
    where: {
      login: {
        [Op.iLike]: `%${loginSubstring}%`,
      },
    },
    order: ["login"],
    limit,
  });
};

export const getUsersBySubstring = async (req, res) => {
  const { loginSubstring = "", limit = users.length } = req.query;
  const list = await getAutoSuggestUsers(loginSubstring, limit);
  if (list === undefined || list.length === 0) {
    res.status(404).json({ message: "No users(" });
  } else {
    res.json({ users: list });
  }
};

export const getUsersByID = async (req, res) => {
  try {
    const user = await findUser(req.params.id);
    if (user) {
      res.json(user);
    } else {
      res
        .status(404)
        .json({ message: `User with id ${req.params.id} not found!` });
    }
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const postUser = async (req, res) => {
  try {
    const { login, password, age } = req.body;
    const newUser = await User.create({ login, password, age });
    res.status(201).json(newUser);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const putUser = (req, res) => {
  const id = req.params.id;
  const { login, password, age } = req.body;
  User.update(
    {
      login,
      password,
      age,
    },
    {
      where: {
        id,
        isDeleted: false,
      },
      returning: true,
    }
  )
    .then(() => res.sendStatus(200))
    .catch((error) => {
      console.log(error);
      res.sendStatus(500);
    });
};

export const deleteUser = (req, res) => {
  const id = req.params.id;
  User.update(
    {
      isDeleted: true,
    },
    {
      where: {
        id,
        isDeleted: false,
      },
    }
  )
    .then(() => res.sendStatus(200))
    .catch((error) => {
      console.log(error);
      res.sendStatus(500);
    });
};

export const getUserByCredentials = (login, password) => {
  try {
    return User.findOne({
      where: {
        login,
        password,
      },
    });
  } catch (err) {
    throw new Error(err);
  }
};
