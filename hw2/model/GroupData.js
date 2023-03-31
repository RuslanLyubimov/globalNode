import { sequelize } from "../Middlewares/db-config/connector";
const { Sequelize, DataTypes, UUIDV4 } = require("sequelize");

export const GroupModel = sequelize.define(
  "Groups",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
      defaultValue: UUIDV4,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    permissions: {
      type: DataTypes.ARRAY(DataTypes.TEXT),
      allowNull: false,
    },
  },
  {
    timestamps: false,
    freezeTableName: true,
  }
);

sequelize.sync();
