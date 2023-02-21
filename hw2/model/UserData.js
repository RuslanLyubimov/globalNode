import { sequelize } from "../Middlewares/db-config/connector";
const { Sequelize, DataTypes } = require("sequelize");

export const User = sequelize.define("User", {
  id: {
    type: DataTypes.NUMBER,
    primaryKey: true,
    autoIncrement: true,
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
    type: DataTypes.NUMBER,
    allowNull: false,
  },
  isDeleted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
});

const Users = [
  {
    login: "ruslan",
    password: 123,
    age: 18,
    isDeleted: false,
    id: "01",
  },
  {
    login: "ulugbek",
    password: 456,
    age: 20,
    isDeleted: false,
    id: "02",
  },
];

module.exports = { Users };
