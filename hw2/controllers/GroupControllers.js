import { GroupModel } from "../model/GroupData";
import { User } from "../model/UserData";
import { v4 as uuidv4 } from "uuid";
import { sequelize } from "../Middlewares/db-config/connector";

const UserGroupModel = require("../model/UserGroupData");

const findGroup = (reqId) => {
  return GroupModel.findByPk(reqId);
};

export const getAllGroups = async (req, res) => {
  try {
    let groups = await GroupModel.findAll();
    if (groups) {
      res.json(groups);
    } else {
      res.status(404).json({ message: `Groups are not found` });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getGroupByID = async (req, res) => {
  try {
    const group = await findGroup(req.params.id);
    if (group) {
      res.json(group);
    } else {
      res
        .status(404)
        .json({ message: `Group with id ${req.params.id} not found!` });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const postGroup = async (req, res) => {
  try {
    const { name, permissions } = req.body;
    const id = uuidv4();
    const newGroup = await GroupModel.create({ id, name, permissions });
    res.status(201).json(newGroup);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const putGroup = (req, res) => {
  const id = req.params.id;
  const { name, permissions } = req.body;
  GroupModel.update(
    {
      name,
      permissions,
    },
    {
      where: {
        id,
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

export const deleteGroup = async (req, res) => {
  const id = req.params.id;
  GroupModel.destroy({ where: { id } })
    .then(() => res.sendStatus(200))
    .catch((error) => {
      console.log(error);
      res.sendStatus(500);
    });
};

const addUsersToGroup = async (groupId, data) => {
  const { userIds } = data;
  const transaction = await sequelize.transaction();
  const group = await GroupModel.findByPk(groupId, { transaction });
  if (!group) {
    return;
  }
  try {
    const users = await User.findAll({
      where: {
        id: userIds,
        isDeleted: false,
      },
      transaction,
    });

    const relationId = uuidv4();
    const usersGroups = await UserGroupModel.bulkCreate(
      users.map((user) => {
        return {
          id: relationId,
          userId: user.id,
          groupId: group.id,
        };
      }),
      {
        transaction,
      }
    );

    await transaction.commit();
    return usersGroups;
  } catch (error) {
    console.log(error);
    await transaction.rollback();
  }
};

export const postUserGroup = async (req, res) => {
  const id = req.params.id;
  const data = req.body;
  const users = await addUsersToGroup(id, data);
  if (!users) {
    res.status(404).send("Group does not exist");
  } else {
    res.status(201).send("ok");
  }
};
