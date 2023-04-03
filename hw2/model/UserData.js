import { sequelize } from "../Middlewares/db-config/connector";
import { v4 as uuidv4 } from "uuid";
const { Sequelize, DataTypes, UUIDV4 } = require("sequelize");

export const User = sequelize.define(
  "Users",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
      defaultValue: UUIDV4,
    },
    login: {
      type: DataTypes.TEXT,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    age: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    isDeleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    timestamps: false,
    freezeTableName: true,
  }
);

sequelize.sync();

User.beforeCreate((instance, options) => {
  instance.id = uuidv4();
});
