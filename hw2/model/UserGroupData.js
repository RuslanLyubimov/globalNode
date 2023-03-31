import { sequelize } from "../Middlewares/db-config/connector";
import { User } from "./UserData";
import { GroupModel } from "./GroupData";
const { Sequelize, DataTypes, Model } = require("sequelize");

class UserGroup extends Model {}

UserGroup.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
      unique: true,
    },

    userId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    groupId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "UserGroup",
    timestamps: false,
  }
);

User.belongsToMany(GroupModel, {
  through: "UserGroup",
  foreignKey: "userId",
});

GroupModel.belongsToMany(User, {
  through: "UserGroup",
  foreignKey: "groupId",
});

sequelize.sync();

module.exports = UserGroup;
