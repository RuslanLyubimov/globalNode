require("dotenv").config();
const { Sequelize } = require("sequelize");

export const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.LOGIN,
  process.env.PASSWORD,
  {
    host: process.env.HOST,
    port: process.env.DB_PORT,
    dialect: "postgres",
  }
);

export const runDb = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};


